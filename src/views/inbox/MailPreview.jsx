import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMessage, markMessageRead } from "../../stores/graphService.js";
import LoadingUI from "../../components/loading-ui/Main.jsx";
import MessageRender from "./MessageRender.jsx";
import {ChevronLeft} from "lucide-react"

const MailPreview = () => {
    const { authProvider, setError } = useSelector((state) => state.auth);
    const { id } = useParams();
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const markedOnceRef = useRef(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    console.log("Auth provider:- ", authProvider?.options?.account?.idToken);

    useEffect(() => {
        let disposed = false;

        const fetchMessage = async () => {
            if (!authProvider) return;

            const m = await getMessage(authProvider, id); // your fetch function
            if (!disposed) setMsg(m);

            // Mark as read if not already
            if (!markedOnceRef.current && m?.isRead === false) {
                try {
                    await markMessageRead(authProvider, id);
                    if (!disposed) {
                        setMsg((prev) => (prev ? { ...prev, isRead: true } : prev));
                    }
                } catch (e) {
                    console.warn("Failed to mark message as read:", e);
                } finally {
                    markedOnceRef.current = true;
                }
            }
        };

        fetchMessage();

        return () => {
            disposed = true;
        };
    }, [authProvider, id]);

    if (!authProvider) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
                <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-gray-100 max-w-md w-full text-center transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-gray-600 mb-8">
                        You need to be logged in to access this page.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard/inbox")}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 w-full"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingUI message="Content Loading" />;
    }

    return (
        <div className="w-full min-h-screen flex justify-center py-10 px-4 bg-gray-50">
            {msg && (
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-100">
                    <button onClick={()=> navigate("/dashboard/inbox")} className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800 transition">
                        <ChevronLeft size={20}/>
                        <span className="font-semibold text-sm">Back</span>
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{msg?.subject}</h2>

                    <p className="text-gray-600 text-sm mb-6">
                        From:{" "}
                        <span className="font-medium text-gray-800">
                            {msg?.from?.emailAddress?.address}
                        </span>
                    </p>

                    {console.log(msg)}

                    <div className="mt-10 prose max-w-none text-gray-800">
                        <MessageRender html={msg?.body.content} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MailPreview;
