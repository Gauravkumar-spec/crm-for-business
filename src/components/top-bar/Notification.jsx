import React, { useState, useEffect } from "react";
import { notificationApi } from "../../api/notificationApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [nextId, setNextId] = useState(null);

    const { loading, session } = useAuth();

    const fetchNotifications = async (isLoadMore = false) => {
        // 🚫 Prevent duplicate calls
        if (isLoadMore && isLoadingMore) return;
        if (!isLoadMore && isLoading) return;

        const agentEmail = session?.account?.idTokenClaims?.emails?.[0];
        if (!agentEmail) return;

        try {
            isLoadMore ? setIsLoadingMore(true) : setIsLoading(true);
            setError(null);

            const payload = {
                agent_email: agentEmail,
                client_id: 1,
                limit: 5,
                sort_by: "notification_id",
                sort_order: "ASC",
                ...(isLoadMore && nextId ? { last_notification_id: nextId } : {}),
            };

            const response = await notificationApi.getAgentNotification(payload);

            if (response?.notifications) {
                setNotifications((prev) =>
                    isLoadMore ? [...prev, ...response.notifications] : response.notifications,
                );

                setHasMore(response.has_more);
                setNextId(response.next_last_notification_id);
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Something went wrong");
        } finally {
            isLoadMore ? setIsLoadingMore(false) : setIsLoading(false);
        }
    };

    // ✅ Fetch ONLY when auth is ready
    useEffect(() => {
        if (!loading && session) {
            fetchNotifications(false);
        }
    }, [loading, session]);

    return (
        <div className="bg-white shadow rounded-lg p-4 w-full">
            <h2 className="text-lg font-semibold mb-3">Notifications</h2>

            {/* Scrollable Container */}
            <div className="h-64 overflow-y-auto border rounded-md p-3 space-y-2">
                {notifications.map((n) => (
                    <div
                        key={n.notification_id}
                        className="p-3 rounded-lg border bg-gray-100 border-gray-200"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">{n.lead_name}</h3>
                            <span className="text-xs text-gray-500">
                                {new Date(n.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                    </div>
                ))}

                {!isLoading && notifications.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No notifications</p>
                )}
            </div>

            {/* Load More Button */}
            {hasMore && !isLoadingMore && !isLoading && (
                <button
                    onClick={() => fetchNotifications(true)}
                    className="mt-3 w-full py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Load More
                </button>
            )}

            {(isLoading || isLoadingMore) && (
                <p className="text-center text-sm text-gray-500 mt-2">Loading...</p>
            )}

            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default NotificationList;
