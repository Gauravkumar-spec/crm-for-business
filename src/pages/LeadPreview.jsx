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

const LeadPreview = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [lead, setLead] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                console.log("lead response: ", response.data);
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

    useEffect(() => {
        fetchLeadPreview();
    }, [id]);

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
                                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                    <span className="text-lg font-semibold-">Lead Status: </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            lead?.status
                                        )}`}
                                    >
                                        {lead?.status}
                                    </span>
                                    {/* <button
                                        onClick={handleEdit}
                                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                                    >
                                        <FiEdit className="mr-2" />
                                        Edit Lead
                                    </button> */}
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
                            {/* Summary Card */}
                            <div className="bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg p-6">
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
                            </div>

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

            <ToastContainer />
        </div>
    );
};

export default LeadPreview;
