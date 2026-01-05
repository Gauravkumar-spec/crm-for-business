import { useEffect, useState } from "react";
import {
    FiUser,
    FiPhone,
    FiMail,
    FiHome,
    FiDollarSign,
    FiMapPin,
    FiCalendar,
    FiGlobe,
    FiFileText,
    FiEdit,
    FiArrowLeft,
    FiBriefcase,
    FiStar,
    FiCheckCircle,
} from "react-icons/fi";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { leadApi } from "../api/leadApi";
import ErrorUI from "../components/error-ui/Main.jsx";
import LoadingUI from "../components/loading-ui/Main.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { agentApi } from "../api/agentApi.js";

const LeadPreview = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { session } = useAuth();

    const [lead, setLead] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // for pop-up modal
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

    // for agents
    const [agents, setAgents] = useState([]);
    const [agentLastId, setAgentLastId] = useState(null);
    const [agentHasMore, setAgentHasMore] = useState(false);
    const [agentLoading, setAgentLoading] = useState(false);
    const [agentLoadingMore, setAgentLoadingMore] = useState(false);

    const fetchLeadPreview = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                lead_id: id,
                client_id: 1,
            };

            const response = await leadApi.leadPreview(payload);

            if (response || response.data) {
                setLead(response.data || response?.data);
                toast.success("Lead Preview fetch successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        } catch (error) {
            setError(error || "Failed to fetch lead, try Again");
            toast.error("Failed to fetch lead", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAgentsForDropdown = async (lastId = null) => {
        try {
            setAgentLoading(true);

            const payload = {
                status: null,
                search: null,
                name: null,
                email: null,
                last_agent_id: lastId,
                limit: 10,
                sort_by: "name",
                sort_order: "ASC",
                client_id: 1,
            };

            const res = await agentApi.agentSearch(payload);

            setAgents((prev) => (lastId ? [...prev, ...res.data] : res.data));

            setAgentHasMore(res?.has_more);
            setAgentLastId(res?.next_last_agent_id);
        } catch (error) {
            console.error("❌ Failed to fetch agents:", error);
        } finally {
            setAgentLoading(false);
        }
    };

    const loadMoreAgentsForDropdown = async () => {
        if (!agentHasMore) return;
        fetchAgentsForDropdown(agentLastId);
    };

    const assignLead = async () => {
        try {
            if (!selectedAgentEmail) {
                toast.error("Please select an agent email", {
                    position: "top-center",
                    theme: "dark",
                });
                return;
            }

            const payload = {
                lead_id: lead?.lead_id,
                client_id: 1,
                agent_emails: [selectedAgentEmail],
                primary_agent_email: selectedAgentEmail,
                assigned_by: session.account.username,
            };

            await leadApi.leadAssign(payload);

            toast.success("Lead assigned successfully!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });

            setShowAssignModal(false);
            setSelectedAgentEmail("");

            // Refresh lead preview so Assigned Agent card updates
            fetchLeadPreview();
        } catch (error) {
            console.error("❌ Assign lead failed:", error);

            toast.error(error?.response?.data?.message || "Failed to assign lead", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
        }
    };

    useEffect(() => {
        fetchLeadPreview();
    }, [id]);

    useEffect(() => {
        if (showAssignModal) {
            setAgents([]);
            setAgentLastId(null);
            fetchAgentsForDropdown(null); // 👈 explicitly reset pagination
        }
    }, [showAssignModal]);

    const getStatusColor = (status) => {
        switch (status) {
            case "New Lead":
                return "bg-blue-100 text-blue-800";
            case "Contacted":
                return "bg-yellow-100 text-yellow-800";
            case "Qualified":
                return "bg-green-100 text-green-800";
            case "Closed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return <LoadingUI message="Loading Lead" />;
    }

    if (error) {
        return <ErrorUI handlerFunc={fetchLeadPreview} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-darkmode-800 dark:to-darkmode-900 py-8 px-4 sm:px-6 lg:px-8">
            {lead?.lead_id && (
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black p-6 text-white">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => history.back()}
                                        className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <FiArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                            Lead Details
                                        </h1>
                                        <p className="text-blue-100">
                                            Complete information for potential client
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                                    <div className="flex gap-2 items-center justify-center">
                                        <span className="text-sm font-semibold">Lead Status:</span>

                                        <span
                                            className={`px-5 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                lead?.status
                                            )}`}
                                        >
                                            {lead?.status}
                                        </span>
                                    </div>

                                    {/* Assign Lead Button */}
                                    {!lead?.primary_agent && (
                                        <button
                                            onClick={() => setShowAssignModal(true)}
                                            className="bg-white text-indigo-900 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                        >
                                            <FiUser className="mr-2" />
                                            Assign Agent
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Client Information */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Client Card */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        Client Information
                                    </h2>
                                    <FiCheckCircle className="text-green-500 w-6 h-6" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <FiUser className="text-blue-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Full Name
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <FiPhone className="text-green-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Mobile Number
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.mobile}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                <FiMail className="text-purple-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Email Address
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                <FiGlobe className="text-orange-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Lead Source
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.source}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                <FiCalendar className="text-red-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Follow-up Date
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {new Date(
                                                        lead?.follow_up_date
                                                    ).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                                                <FiCalendar className="text-gray-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Created
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {new Date(
                                                        lead?.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements Card */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                                    Property Requirements
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <FiBriefcase className="text-blue-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Requirement
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.requirement}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <FiHome className="text-green-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Property Type
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.property_type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                <FiDollarSign className="text-purple-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Budget Range
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    ₹{lead?.budget_min} - ₹{lead?.budget_max}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                <FiMapPin className="text-orange-600 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Preferred Location
                                                </p>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lead?.preferred_location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Card */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                                    Additional Notes
                                </h2>
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg mt-1">
                                        <FiFileText className="text-gray-600 w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                            {lead?.notes || "No additional notes provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quick Actions & Summary */}
                        <div className="space-y-8">
                            {/* Assigned Agent Card */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                                    Assigned Agent
                                </h3>

                                {lead?.primary_agent ? (
                                    <div className="space-y-4">
                                        {/* Primary Agent */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                    <FiStar className="text-indigo-600 w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Primary Agent
                                                    </p>
                                                    <p className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                                                        {lead?.primary_agent || "Not assigned"}
                                                    </p>
                                                </div>
                                            </div>

                                            {lead?.primary_agent && (
                                                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                                    Primary
                                                </span>
                                            )}
                                        </div>

                                        {/* Assigned Agents */}
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                                Assigned Agents
                                            </p>

                                            {lead?.assigned_agents?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {lead.assigned_agents.map((agent, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-slate-100 dark:bg-darkmode-600 text-slate-700 dark:text-slate-200 rounded-full text-sm capitalize"
                                                        >
                                                            {agent}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400">
                                                    No agents assigned
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <FiPhone className="text-green-600 w-5 h-5" />
                                            <span>{lead?.agent?.phone || "No Phone No."}</span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <FiMail className="text-purple-600 w-5 h-5" />
                                            <span>{lead?.agent?.email || "No Email"}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-slate-500 text-sm">
                                            No agent assigned yet
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Summary Card */}
                            {/* <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                                    Lead Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Priority
                                        </span>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                                            High
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Lead Score
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                            85%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Last Contact
                                        </span>
                                        <span className="text-sm text-slate-500">2 days ago</span>
                                    </div>
                                </div>
                            </div> */}

                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                                        <FiPhone className="mr-2" />
                                        Call Client
                                    </button>
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                                        <FiMail className="mr-2" />
                                        Send Email
                                    </button>
                                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                                        <FiCalendar className="mr-2" />
                                        Schedule Meeting
                                    </button>
                                </div>
                            </div>

                            {/* Property Suggestions */}
                            {/* <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Matching Properties
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="font-medium text-blue-900 dark:text-blue-100">
                                        Marina Bay Apartments
                                    </div>
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        Downtown Dubai • 3 Beds
                                    </div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                                        ₹650,000
                                    </div>
                                </div>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="font-medium text-green-900 dark:text-green-100">
                                        Palm Jumeirah Villa
                                    </div>
                                    <div className="text-sm text-green-700 dark:text-green-300">
                                        Palm Jumeirah • 4 Beds
                                    </div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                        ₹720,000
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={() => navigate("/dashboard/lead-detail")}
                            className="px-6 py-3 border border-slate-300 dark:border-darkmode-400 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-600 transition-colors"
                        >
                            Back to List
                        </button>
                    </div>
                </div>
            )}

            {/* pop for agent assigned  */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        {/* Modal Header */}
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                Assign Lead to Agent
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Select an agent email to assign this lead
                            </p>
                        </div>

                        {/* Email Dropdown */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Agent Email
                            </label>

                            <select
                                value={selectedAgentEmail}
                                onChange={(e) => setSelectedAgentEmail(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-darkmode-400 bg-white dark:bg-darkmode-600 px-4 py-3 text-slate-800 dark:text-slate-200"
                            >
                                <option value="">Select agent email</option>

                                {agents.map((agent, index) => (
                                    <option key={`${agent?.agent_id}+${index}`} value={agent.email}>
                                        {agent.email}
                                    </option>
                                ))}
                            </select>

                            {/* Load More inside dropdown area */}
                            {agentHasMore && (
                                <button
                                    type="button"
                                    onClick={loadMoreAgentsForDropdown}
                                    disabled={agentLoadingMore}
                                    className="mt-3 text-sm text-indigo-600 hover:underline disabled:opacity-50"
                                >
                                    {agentLoadingMore ? "Loading more..." : "Load more agents"}
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-5 py-2 rounded-lg border border-slate-300 dark:border-darkmode-400 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkmode-600"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!selectedAgentEmail}
                                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium"
                                onClick={() => assignLead()}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default LeadPreview;
