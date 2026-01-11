// src/pages/Unauthorized.jsx
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">🚫</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-semibold text-gray-900">Access Denied</h1>

                {/* Message */}
                <p className="mt-3 text-gray-600">
                    You don’t have permission to view this page.
                    <br />
                    Please contact your administrator if you think this is a mistake.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
