import { useState } from "react";
import { useSelector } from "react-redux";

import { sendMail } from "../../stores/graphService.js";
import { useNavigate } from "react-router-dom";

export default function ComposeMail() {
    const { authProvider, setError } = useSelector((state) => state.auth);
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null);

    const navigate = useNavigate()

    // Narrow type early
    if (!authProvider) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
                <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-gray-100 max-w-md w-full text-center transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-gray-600 mb-8">
                        You need to be logged in to access this page.
                    </p>
                    <button onClick={()=> navigate("/dashboard/inbox")} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 w-full">
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    async function onSend(e) {
        e.preventDefault();
        setStatus(null);
        if (!authProvider) {
            setError?.({ message: "Authentication provider not available." });
            return;
        }
        try {
            setSending(true);
            await sendMail(authProvider, to.trim(), subject.trim(), content);
            setStatus("Sent ✔");
            setTo("");
            setSubject("");
            setContent("");
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            // Push error to global context so <ErrorMessage /> can display it
            setError?.({
                message,
                debug: typeof err === "object" ? JSON.stringify(err, null, 2) : undefined,
            });
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-16 px-4">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-gray-100 transform transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Compose</h1>

                {/* Status Message */}
                {/* Replace this with your dynamic status logic */}
                {/* {status && <div className="alert alert-success">{status}</div>} */}

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">To</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="someone@contoso.com"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Subject</label>
                        <input
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Hello from ERP"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Message</label>
                        <textarea
                            rows={8}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Write your message…"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5"
                        >
                            Send
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md"
                        >
                            Save Draft
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
