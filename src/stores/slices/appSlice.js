import { ensureMsalInitialized, msalInstance } from "../msalInstance.js";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { InteractionType } from "@azure/msal-browser";
import { getUser } from "../graphService";
import config from "../config";
import { createSlice } from "@reduxjs/toolkit";

// Slice setup
const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, authProvider: null, error: null, loading: false },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setAuthProvider: (state, action) => {
            state.authProvider = action.payload;
        },
        signOut: (state) => {
            state.user = null;
            state.authProvider = null;
            state.error = null;
        },
    },
});

export const { setLoading, setUser, setError, clearError, setAuthProvider, signOut } =
    authSlice.actions;

// Async logic
export const signIn = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await ensureMsalInitialized();
        const result = await msalInstance.loginPopup({
            scopes: config.scopes,
            prompt: "select_account",
        });

        

        if(!localStorage.getItem("mslAccessToken")){
            localStorage.setItem("mslAccessToken", result?.accessToken)
        }

        if (result.account) {
            msalInstance.setActiveAccount(result.account);
        }

        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
            account: result.account,
            scopes: config.scopes,
            interactionType: InteractionType.Popup,
        });

        const u = await getUser(authProvider);
        dispatch(
            setUser({
                displayName: u.displayName || "",
                email: u.mail || u.userPrincipalName || "",
                timeFormat: u.mailboxSettings?.timeFormat || "h:mm a",
                timeZone: u.mailboxSettings?.timeZone || "UTC",
            })
        );
        dispatch(setAuthProvider(authProvider));
    } catch (err) {
        dispatch(setError(err.message || "Sign-in failed"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logout = () => async (dispatch) => {
    await msalInstance.logoutPopup();
    dispatch(signOut());
};

export const restoreSession = () => async (dispatch) => {
    try {
        await ensureMsalInitialized();

        const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
        if (!account) return; // no cached session

        const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
            account,
            scopes: config.scopes,
            interactionType: InteractionType.Popup,
        });

        const u = await getUser(authProvider);
        dispatch(
            setUser({
                displayName: u.displayName || "",
                email: u.mail || u.userPrincipalName || "",
                timeFormat: u.mailboxSettings?.timeFormat || "h:mm a",
                timeZone: u.mailboxSettings?.timeZone || "UTC",
            })
        );
        dispatch(setAuthProvider(authProvider));
    } catch (err) {
        console.error("Session restore failed:", err);
    }
};

export default authSlice.reducer;
