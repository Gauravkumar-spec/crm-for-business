// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermission } from "../context/PermissionContext";
import { PERMISSIONS } from "../constants/permission.js";

export default function ProtectedRoute({ children, permission }) {
    const location = useLocation();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const {
        loading: permLoading,
        role,
        effectivePermissions,
        requiresActivation,
        status,
    } = usePermission();

    // ⏳ loading
    if (authLoading || permLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-white font-bold text-5xl tracking-wider animate-pulse">TerraX</p>
                <div className="mt-6 w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="text-gray-100 mt-4 text-lg font-medium">Checking your session...</p>
            </div>
        );
    }

    // 🔐 not logged in
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 🔥 ADMIN: full access (short-circuit)
    if (role && role.toLowerCase() === "admin") {
        return children;
    }

    // 🚫 agent must NOT land on /dashboard root
    if (location.pathname === "/dashboard") {
        if (effectivePermissions.includes(PERMISSIONS.MANAGE_LISTINGS)) {
            return <Navigate to="/dashboard/product-list" replace />;
        }
        if (effectivePermissions.includes(PERMISSIONS.MANAGE_LEADS)) {
            return <Navigate to="/dashboard/lead-list" replace />;
        }
        return <Navigate to="/unauthorized" replace />;
    }

    // 🔒 agent activation / status
    if (requiresActivation || !status) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 🚫 agent accessing admin-only page
    if (permission === PERMISSIONS.ADMIN_ONLY) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 🔐 backend permission guard (agent)
    if (permission && !effectivePermissions.includes(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
