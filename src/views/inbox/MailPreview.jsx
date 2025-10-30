import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getMessage, markMessageRead } from "../../stores/graphService.js";
import LoadingUI from "../../components/loading-ui/Main.jsx";
import MessageRender from "./MessageRender.jsx";

const MailPreview = () => {
    const { authProvider, setError } = useSelector((state) => state.auth);
    const { id } = useParams();
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const markedOnceRef = useRef(false);
    const dispatch = useDispatch();

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
            <div className="container mt-4">
                <p>Please sign in first.</p>
            </div>
        );
    }

    if (loading) {
        return <LoadingUI message="Content Loading" />;
    }

    return (
        <div>
            {msg && (
                <div>
                    <h2>{msg?.subject}</h2>
                    <p>
                        From: <span>{msg?.from?.emailAddress?.address}</span>
                    </p>

                    {console.log(msg)}

                    <div className="mt-10">
                        <MessageRender html={msg?.body.content} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MailPreview;
