import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { getSession, refreshSession, isTokenExpired, isTokenExpiringSoon } from "./Auth.js";
import { logout as logoutService } from "./Auth.js";
import axios from "axios";
import axiosRetry from "axios-retry";

const AuthContext = createContext(null);

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach retry policy
axiosRetry(axiosInstance, {
    retries: 4,
    retryDelay: axiosRetry.exponentialDelay, // 1s, 2s, 4s
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
    },
});

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshPromise = useRef(null);

    // Single refresh function - prevents multiple simultaneous calls
    const refreshToken = async () => {
        
        const sessionId = session?.sessionId || sessionStorage.getItem("sessionId");
        if (!sessionId) return null;

        // Return existing refresh promise if already refreshing
        if (refreshPromise.current) {
            return refreshPromise.current;
        }

        refreshPromise.current = (async () => {
            try {
                
                const data = await refreshSession(sessionId);

                // Update session and storage
                setSession((prev) => ({ ...(prev || {}), ...data, sessionId }));
                if (data?.accessToken) {
                    sessionStorage.setItem("token", data.accessToken);
                }

                return data;
            } catch (error) {
                console.error("[Auth] Refresh failed:", error);

                // If 401, session is completely expired
                if (error.response?.status === 401) {
                    handleLogout();
                }
                throw error;
            } finally {
                refreshPromise.current = null;
            }
        })();

        return refreshPromise.current;
    };

    // Load initial session
    useEffect(() => {
        const sessionIdFromUrl = new URLSearchParams(window.location.search).get("sessionId");
        const storedSessionId = sessionStorage.getItem("sessionId");
        const sessionId = sessionIdFromUrl || storedSessionId;

        if (!sessionId) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const data = await getSession(sessionId);
                sessionStorage.setItem("sessionId", sessionId);
                sessionStorage.setItem("token", data?.accessToken);
                setSession({ ...data, sessionId });
            } catch (error) {
                console.error("[Auth] Session load failed:", error);
                sessionStorage.clear();
                setSession(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Setup axios interceptors (the magic happens here!)
    useEffect(() => {
        // REQUEST INTERCEPTOR - Add token and proactive refresh
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                const token = sessionStorage.getItem("token");

                // Add token to request
                if (token && !isTokenExpired(token)) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Proactive refresh if token expiring soon
                if (token && isTokenExpiringSoon(token) && !refreshPromise.current) {
                    try {
                        await refreshToken();
                        const newToken = sessionStorage.getItem("token");
                        if (newToken) {
                            config.headers.Authorization = `Bearer ${newToken}`;
                        }
                    } catch (error) {
                        console.error("[Auth] Proactive refresh failed:", error);
                    }
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // RESPONSE INTERCEPTOR - Handle 401 errors
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Handle 401 errors with automatic retry
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        await refreshToken();
                        const newToken = sessionStorage.getItem("token");
                        if (newToken && !isTokenExpired(newToken)) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error("[Auth] Token refresh on 401 failed:", refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup interceptors
        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // Logout function
    const handleLogout = async () => {
        const sessionId = session?.sessionId || sessionStorage.getItem("sessionId");

        if (sessionId) {
            try {
                const res = await logoutService(sessionId);
                
            } catch (error) {
                console.error("[Auth] Logout request failed", error);
            }
        }

        // Clear frontend session regardless of backend response

        setSession(null);
        sessionStorage.clear();
        refreshPromise.current = null;

        window.location.href = "/";
    };

    // Check if authenticated
    const isAuthenticated = useMemo(() => {
        if (!session?.sessionId) return false;
        const token = sessionStorage.getItem("token");
        return token && !isTokenExpired(token);
    }, [session?.sessionId]);

    const value = useMemo(
        () => ({
            session,
            loading,
            isAuthenticated,
            refreshToken,
            handleLogout,
            isRefreshing: !!refreshPromise.current,
        }),
        [session, loading, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
