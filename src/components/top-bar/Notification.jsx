import React, { useState, useEffect } from "react";
import { notificationApi } from "../../api/notificationApi.js"; // adjust your import

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [nextId, setNextId] = useState(null);

    const fetchNotifications = async (isLoadMore = false) => {
        try {
            setIsLoading(true);
            setError(null);

            const payload = {
                agent_email: "agent1@example.com",
                client_id: 1,
                limit: 5,
                sort_by: "notification_id",
                sort_order: "ASC",
                ...(isLoadMore && nextId ? { last_notification_id: nextId } : {}),
            };

            const response = await notificationApi.getAgentNotification(payload);

            if (response && response.notifications) {
                setNotifications((prev) =>
                    isLoadMore ? [...prev, ...response.notifications] : response.notifications
                );

                setHasMore(response.has_more);
                setNextId(response.next_last_notification_id);
            }
        } catch (error) {
            setError(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-4 w-full">
            <h2 className="text-lg font-semibold mb-3">Notifications</h2>

            {/* Scrollable Container */}
            <div className="h-64 overflow-y-auto border rounded-md p-3 space-y-2">
                {notifications.map((n) => (
                    <div
                        key={n.notification_id}
                        className={`p-3 rounded-lg border transition bg-gray-100 border-gray-200`}
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

                {notifications.length === 0 && !isLoading && (
                    <p className="text-gray-500 text-center py-4">No notifications</p>
                )}
            </div>

            {/* Load More Button */}
            {hasMore && !isLoading && (
                <button
                    onClick={() => fetchNotifications(true)}
                    className="mt-3 w-full py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Load More
                </button>
            )}

            {isLoading && <p className="text-center text-sm text-gray-500 mt-2">Loading...</p>}

            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default NotificationList;
