// src/components/DashboardIndexRedirect.jsx
import { Navigate } from "react-router-dom";
import { usePermission } from "../context/PermissionContext";
import { PERMISSIONS } from "../constants/permission.js";

export default function DashboardIndexRedirect({ basePath = "/dashboard" }) {
    const { loading, role, effectivePermissions, requiresActivation, status } = usePermission();

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-white">Loading…</div>;
    }

    if (role === "admin") {
        return <Navigate to={`${basePath}`} replace />;
    }

    if (requiresActivation || !status) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (effectivePermissions.includes(PERMISSIONS.MANAGE_LISTINGS)) {
        return <Navigate to={`${basePath}/product-list`} replace />;
    }

    if (effectivePermissions.includes(PERMISSIONS.MANAGE_LEADS)) {
        return <Navigate to={`${basePath}/lead-list`} replace />;
    }

    return <Navigate to="/unauthorized" replace />;
}
