import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
} from "@/base-components";
import { faker as $f } from "../../pages/PropertyList";
import classnames from "classnames";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../stores/slices/appSlice.js";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import NotAuthenticated from "./NotAuthenticated.jsx";
import { useState, useEffect } from "react";
import { getInbox, getMessagesNextPage, markMessageRead } from "../../stores/graphService.js";
import { useNavigate } from "react-router-dom";

function Main() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { user, loading, authProvider, setError } = useSelector((state) => state.auth);
    const [items, setItems] = useState([]);
    const [next, setNext] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);

    // Function to fetch inbox
    const fetchInbox = async () => {
        if (!authProvider) return;
        try {
            setApiLoading(true);
            const res = await getInbox(authProvider, 25);
            setItems(res.value ?? []);
            setNext(res ?? null);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError?.({
                message,
                debug: typeof err === "object" ? JSON.stringify(err, null, 2) : undefined,
            });
        } finally {
            setApiLoading(false);
        }
    };

    // Run on mount or when authProvider is ready
    useEffect(() => {
        if (authProvider) fetchInbox();
    }, [authProvider]);

    // Load more messages
    const loadMore = async () => {
        if (!authProvider || !next) return;
        try {
            setApiLoading(true);
            const res = await getMessagesNextPage(authProvider, next);
            setItems((prev) => prev.concat(res.value ?? []));
            setNext(res ?? null);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError?.({
                message,
                debug: typeof err === "object" ? JSON.stringify(err, null, 2) : undefined,
            });
        } finally {
            setApiLoading(false);
        }
    };

    console.log("Item: ", items);

    return (
        <>
            <AuthenticatedTemplate>
                <div className="w-full min-h-screen flex flex-col bg-white dark:bg-darkmode-600 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight border-b border-slate-200 dark:border-darkmode-400 pb-2">
                        📥 Inbox
                    </h2>

                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6 mt-5">
                        {/* Left: Compose Button */}
                        <div className="flex items-center gap-3">
                            <button
                            onClick={() => navigate("/dashboard/compose-mail")}
                            type="button"
                            className="btn flex items-center justify-center text-slate-600 dark:text-slate-300 bg-blue-200 dark:bg-darkmode-300 border dark:border-darkmode-300 px-4 py-2 rounded-md hover:bg-blue-300 dark:hover:bg-darkmode-400 transition"
                        >
                            <Lucide icon="Edit3" className="w-4 h-4 mr-2" />
                            Compose
                        </button>

                        <button
                            onClick={() => navigate("/dashboard/calendar")}
                            type="button"
                            className="btn flex items-center justify-center text-slate-600 dark:text-slate-300 bg-blue-200 dark:bg-darkmode-300 border dark:border-darkmode-300 px-4 py-2 rounded-md hover:bg-blue-300 dark:hover:bg-darkmode-400 transition"
                        >
                            <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
                            Outlook Calendar
                        </button>
                        </div>

                        {/* Right: User Info & Logout */}
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                Hello, {user?.displayName || "User"}
                            </h2>
                            <button
                                onClick={() => dispatch(logout())}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-md transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>

                    {/* Inbox Content */}
                    <div className="flex-1 overflow-y-auto w-full border-t border-slate-200 dark:border-darkmode-400 pt-4">
                        {items && items.length > 0 ? (
                            items.map((item) => (
                                <div
                                    key={item?.id}
                                    className={classnames(
                                        "flex items-center px-5 py-4 border-b border-slate-200 dark:border-darkmode-400 cursor-pointer transition-colors duration-150 rounded-md mb-1",
                                        {
                                            "bg-slate-50 dark:bg-darkmode-400/70": !item?.isRead,
                                            "bg-white dark:bg-darkmode-700": item?.isRead,
                                            "hover:bg-slate-100 dark:hover:bg-darkmode-400": true,
                                        }
                                    )}
                                    onClick={() => navigate(`/dashboard/mail-preview/${item?.id}`)}
                                >
                                    {/* Checkbox */}
                                    <div className="flex-none mr-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={item?.isRead}
                                            onChange={() => {}}
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div className="truncate flex-1">
                                        <span
                                            className={classnames("font-medium", {
                                                "text-slate-800 dark:text-slate-200": !item?.isRead,
                                                "text-slate-500": item?.isRead,
                                            })}
                                        >
                                            {item?.subject || "No Subject"}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="ml-auto text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(item?.receivedDateTime).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                No messages found
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <NotAuthenticated />
            </UnauthenticatedTemplate>
        </>
    );
}

export default Main;
