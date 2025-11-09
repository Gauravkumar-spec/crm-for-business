import { useEffect, useState } from "react";
import { agentApi } from "../api/agentApi.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AgentList() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔵 useEffect triggered → Fetching agents...");
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const payload = {
                status: null,
                search: null,
                name: null,
                email: null,
                last_agent_id: null,
                limit: 10,
                sort_by: "name",
                sort_order: "ASC",
                client_id: 1,
            };

            console.log("🟡 Fetching agents with payload:", payload);
            const res = await agentApi.agentSearch(payload);
            console.log("🟢 Agents fetched successfully:", res);

            setAgents(res);
        } catch (err) {
            console.error("🔴 Failed to fetch agents:", err);
            setError("Failed to load agents. Please try again later.");
        } finally {
            setLoading(false);
            console.log("⚪ Fetch agents completed");
        }
    };

    // Temp. fixes
    const handleDelete = async (id) => {
        toast.error("You can't delete agent right now !", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
        });
    };

    const handleEdit = (e, name) => {
        console.log("handle edit run....");
        e.preventDefault();
        navigate(`/dashboard/edit-agent/${name}`);
    };

    if (loading) {
        console.log("⏳ Loading agents...");
        return (
            <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative inline-flex">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 rounded-full"></div>
                    </div>
                    <p className="mt-4 text-lg text-zinc-300 font-light tracking-wider">
                        LOADING NETWORK
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        console.warn("⚠️ Error UI shown:", error);
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="bg-gradient-to-br from-red-900/40 to-red-800/30 border border-red-800/50 text-red-300 px-6 py-4 rounded-xl max-w-md mx-auto backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={async () => {
                            console.log("🔄 Retrying fetch...");
                            setError(null);
                            await fetchAgents();
                        }}
                        className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 relative overflow-hidden pb-20">
            {/* === Grid overlay and particles omitted for brevity === */}

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            AGENT NETWORK
                        </span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
                        Manage our elite team of agents
                    </p>
                </div>

                {/* No Agents */}
                {agents?.data?.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-300/50 p-12 text-center max-w-2xl mx-auto">
                        <h3 className="text-2xl font-medium text-gray-800 mb-2">No Agents Found</h3>
                        <p className="text-gray-500">
                            The network is currently empty. Add your first agent.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {agents?.data?.map((agent, index) => {
                            const imageUrl = `${import.meta.env.VITE_BASE_URL}uploads/${
                                agent.image
                            }`;

                            return (
                                <div
                                    onClick={() =>
                                        navigate(`/dashboard/agent-preview/${agent.name}`)
                                    }
                                    key={agent?.agent_id}
                                    className="relative group cursor-pointer"
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-300/50 overflow-hidden">
                                        <div className="relative h-48 overflow-hidden">
                                            {agent.image ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) =>
                                                        console.error(
                                                            "🚫 Image failed to load:",
                                                            imageUrl
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span>No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {agent?.name}
                                            </h3>
                                            <span className="text-sm text-blue-500 font-mono mb-4">
                                                ID: {agent?.agent_code?.slice(-6)}
                                            </span>
                                            <p className="text-gray-700">{agent?.email}</p>
                                            <p className="text-gray-700">{agent?.mobile}</p>
                                            <div className="mt-6 flex space-x-2">
                                                <button
                                                    onClick={(e) => handleEdit(e, agent?.name)}
                                                    className="flex-1 py-2 px-3 bg-gray-200 hover:bg-blue-400 text-gray-900 rounded-lg transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(agent?.agent_id)}
                                                    className="flex-1 py-2 px-3 bg-gray-200 hover:bg-red-400 text-gray-900 rounded-lg transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

export default AgentList;
