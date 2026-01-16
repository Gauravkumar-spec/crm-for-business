import { createContext, useContext, useEffect, useState } from "react";
import { checkRoleApi } from "../api/checkRoleApi";
import { useAuth } from "./AuthContext";

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
    const { isAuthenticated, loading: authLoading, session } = useAuth();

    const [permissionState, setPermissionState] = useState({
        loading: true,
        role: null, // "admin" | "agent"
        requiresActivation: false,
        status: false,
        effectivePermissions: [],
    });

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            setPermissionState((prev) => ({ ...prev, loading: false }));
            return;
        }

        (async () => {
            try {
                console.log("session: ", session);
                const user = session.account.idTokenClaims;
                const payload = {
                    sub: user.sub,
                    email: user.emails[0],
                    name: user.name,
                    identity_provider: user.idp || "google.com",
                };
                const res = await checkRoleApi.checkRole(payload);

                const agent = res?.agent;

                // ADMIN detection (adapt if backend sends admin differently)
                const rawRole = agent?.roles;

                const role =
                    typeof rawRole === "string" && rawRole.toLowerCase() === "admin"
                        ? "admin"
                        : "agent";

                setPermissionState({
                    loading: false,
                    role,
                    requiresActivation: res.requires_activation,
                    status: agent?.status,
                    effectivePermissions: agent?.effective_permissions || [],
                });
            } catch (err) {
                console.error("[Permission] failed", err);
                setPermissionState((prev) => ({ ...prev, loading: false }));
            }
        })();
    }, [isAuthenticated, authLoading]);

    return (
        <PermissionContext.Provider value={permissionState}>{children}</PermissionContext.Provider>
    );
};

export const usePermission = () => {
    const ctx = useContext(PermissionContext);
    if (!ctx) throw new Error("usePermission must be used inside PermissionProvider");
    return ctx;
};
