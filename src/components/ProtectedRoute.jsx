// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_HOME, ROUTE_PERMISSIONS } from "../router/routePermission";

export const user = {
    role: "agent",
};

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const { pathname } = useLocation();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                {/* App Name */}
                <p className="text-white font-bold text-5xl tracking-wider animate-pulse">TerraX</p>

                {/* Spinner */}
                <div className="mt-6 w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>

                {/* Subtext */}
                <p className="text-gray-100 mt-4 text-lg font-medium">Checking your session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 🔥 admin override
    if (user.role === "admin") {
        return children;
    }

    // If user is agent and trying to access admin-only dashboard root
    if (user.role === "agent" && pathname === "/dashboard") {
        return <Navigate to={ROLE_HOME.agent} replace />;
    }

    const rule = ROUTE_PERMISSIONS.find((r) => r.pattern.test(pathname));

    console.log("rule: ", rule);

    if (rule && !rule.roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
