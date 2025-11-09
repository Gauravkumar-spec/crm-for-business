import { useEffect, useState } from "react";
import { FaStar, FaEdit, FaEye, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { agentApi } from "../api/agentApi";
import Loader from "../components/loading-ui/Main.jsx";
import ErrorUI from "../components/error-ui/Main.jsx";
import { useNavigate, useParams } from "react-router-dom";

const AgentPreview = () => {
    const { agentName } = useParams();
    const [agentDetails, setAgentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    const fetchAgentDetails = async () => {
        try {
            setLoading(true);
            const payload = {
                name: agentName,
                client_id: 1,
            };

            console.log("🟡 Fetching agents with payload:", payload);
            const res = await agentApi.agentPreview(payload);
            if (res) {
                console.log("🟢 Agents fetched successfully:", res.data[0]);
                setAgentDetails(res.data[0]);
            }
        } catch (err) {
            console.error("🔴 Failed to fetch agents:", err);
            setError("Failed to load agents. Please try again later.");
        } finally {
            setLoading(false);
            console.log("⚪ Fetch agents completed");
        }
    };

    useEffect(() => {
        console.log("🔵 useEffect triggered → Fetching agents...");
        fetchAgentDetails();
    }, []);

    // Temporary Data
    const [reviews] = useState([
        {
            id: 1,
            client_name: "Rajesh Kumar",
            rating: 4.5,
            comment:
                "Excellent service and very professional. Helped me find the perfect property.",
            date: "2024-01-15",
            property_type: "Residential",
        },
        {
            id: 2,
            client_name: "Priya Sharma",
            rating: 5,
            comment: "Very responsive and knowledgeable about the market. Highly recommended!",
            date: "2024-01-10",
            property_type: "Commercial",
        },
        {
            id: 3,
            client_name: "Amit Patel",
            rating: 4,
            comment: "Good communication and negotiation skills. Satisfied with the service.",
            date: "2024-01-05",
            property_type: "Residential",
        },
    ]);

    // Temporary Data
    const [performance] = useState({
        total_leads: 45,
        converted_leads: 28,
        conversion_rate: "62%",
        average_rating: 4.5,
        total_reviews: 12,
        response_time: "2.3h",
    });

    // Temporary Data
    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`w-4 h-4 ${
                            star <= Math.floor(rating)
                                ? "text-yellow-400 fill-current"
                                : star === Math.ceil(rating) && !Number.isInteger(rating)
                                ? "text-yellow-400 fill-current opacity-50"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
            </div>
        );
    };

    if (loading) {
        return <Loader message="Agent Details Loading..." />;
    }

    if (error) {
        return <ErrorUI handlerFunc={fetchAgentDetails} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start gap-2">
                            <button
                                onClick={() => navigate(`/dashboard/agentslist`)}
                                className="flex items-center text-gray-600 hover:text-[#A00500] transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2" />
                                Back to Agents
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">
                                Agent Review & Performance
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    agentDetails?.status
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {agentDetails?.status ? (
                                    <>
                                        <FaCheck className="w-3 h-3 mr-1" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <FaTimes className="w-3 h-3 mr-1" />
                                        Inactive
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Agent Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border mb-8">
                    <div className="px-6 py-5 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Agent Profile</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Agent Code
                                </label>
                                <p className="text-lg font-semibold text-[#A00500]">
                                    {agentDetails?.agent_code}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Name
                                </label>
                                <p className="text-lg font-medium text-gray-900">
                                    {agentDetails?.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900">{agentDetails?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Mobile
                                </label>
                                <p className="text-lg text-gray-900">{agentDetails?.mobile}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    City
                                </label>
                                <p className="text-lg text-gray-900 capitalize">
                                    {agentDetails?.city}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Area
                                </label>
                                <p className="text-lg text-gray-900 capitalize">
                                    {agentDetails?.area}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Role
                                </label>
                                <p className="text-lg text-gray-900">{agentDetails?.roles}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Permissions
                                </label>
                                <div className="flex flex-wrap gap-1">
                                    {agentDetails?.direct_permissions
                                        .split(", ")
                                        .map((permission, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                            >
                                                {permission}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {performance.total_leads}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaEye className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Converted Leads</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {performance.converted_leads}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaCheck className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                <p className="text-2xl font-bold text-[#A00500]">
                                    {performance.conversion_rate}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <FaStar className="w-6 h-6 text-[#A00500]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Avg. Response Time
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {performance.response_time}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaEdit className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-5 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {renderStars(performance.average_rating)}
                                    <span className="text-sm text-gray-500">
                                        ({performance.total_reviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b pb-6 last:border-b-0 last:pb-0"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {review.client_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 capitalize">
                                                    {review.property_type} • {review.date}
                                                </p>
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No reviews yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    This agent doesn't have any reviews at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentPreview;
