// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

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

    return isAuthenticated ? children : <Navigate to="/" replace />;
}
