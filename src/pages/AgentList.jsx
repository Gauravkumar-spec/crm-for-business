import { useEffect, useState } from "react";
import { agentApi } from "../api/agentApi.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderUI from "../components/loading-ui/Main.jsx";
import ErrorUI from "../components/error-ui/Main.jsx";

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
            setError(null)
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
        return <LoaderUI message="Loading Agents" />;
    }

    if (error) {
        console.warn("⚠️ Error UI shown:", error);
        return <ErrorUI handlerFunc={fetchAgents} />;
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
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEdit(e, agent?.name)
                                                    }}
                                                    className="flex-1 py-2 px-3 bg-gray-200 hover:bg-blue-400 text-gray-900 rounded-lg transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(agent?.agent_id)
                                                    }}
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
