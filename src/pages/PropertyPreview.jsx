import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiHome, FiDollarSign, FiMapPin, FiCheck, FiShare2, FiHeart } from "react-icons/fi";
import { propertyApi } from "../api/propertyApi.js";
import LoaderUI from "../components/loading-ui/Main.jsx";
import ErrorUI from "../components/error-ui/Main.jsx";

function PropertyPreview() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [previewData, setPreviewData] = useState({});
    const [formattedPrice, setFormattedPrice] = useState(null);
    const [formattedMaintenance, setFormattedMaintenance] = useState(null);

    const images = [
        "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
        "https://media.istockphoto.com/id/2155879454/photo/this-is-an-exterior-photo-of-a-home-for-sale-in-beverly-hills-ca.jpg?s=612x612&w=0&k=20&c=uSKacMQvmaYX5Pf5Br7pUfErYQbNt_UWXRTjfwrdSDQ=",
        "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
    ];

    const fetchPropertyPreview = async () => {
        try {
            setLoading(true);
            setError(null)
            const response = await propertyApi.propertyPreview({
                property_id: id,
                client_id: 1,
            });

            if (response) {
                console.log("property preview fetch successfully: ", response);
                setPreviewData(response);
            }
        } catch (error) {
            setError(error);
            console.log("Failed to fetch property-preview: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyPreview();
    }, [id]);

    // Format price with commas
    useEffect(() => {
        const res = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(previewData?.price || 0);

        if (res) {
            setFormattedPrice(res);
        }
    }, [previewData]);

    // Format maintenance if available
    useEffect(() => {
        const res = previewData?.maintenance
            ? new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
              }).format(previewData?.maintenance)
            : "Not specified";

        if (res) {
            setFormattedMaintenance(res);
        }
    }, [previewData]);

    if (loading) {
        console.log("⏳ Loading agents...");
        return <LoaderUI message="Loading Property Details" />;
    }

    if (error) {
        console.warn("⚠️ Error UI shown:", error);
        return <ErrorUI handlerFunc={fetchPropertyPreview} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-darkmode-900">
            <div className="container mx-auto px-4 py-8">
                {/* Property Header */}
                <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                                {previewData.title || "Property Title"}
                            </h1>
                            <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
                                <FiMapPin className="mr-2" />
                                <span>
                                    {previewData?.propertyLocation || "Location not specified"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-2xl font-bold text-primary">
                                    {formattedPrice}
                                </span>
                                {previewData?.property_category && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        {previewData?.property_category}
                                    </span>
                                )}
                                {previewData?.availability && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            previewData?.availability === "Available"
                                                ? "bg-success/10 text-success"
                                                : previewData?.availability === "Sold"
                                                ? "bg-danger/10 text-danger"
                                                : "bg-warning/10 text-warning"
                                        }`}
                                    >
                                        {previewData?.availability}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        {/* <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md overflow-hidden mb-6">
                            {previewData?.images && previewData?.images.length > 0 ? (
                                <div>
                                    <div className="relative h-80 bg-slate-200 dark:bg-darkmode-700">
                                        <img
                                            src={previewData?.images[activeImageIndex]}
                                            alt={previewData?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {previewData?.images.length > 1 && (
                                        <div className="p-4 flex space-x-2 overflow-x-auto">
                                            {previewData?.images.map((img, index) => (
                                                <button
                                                    key={index}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                                                        activeImageIndex === index
                                                            ? "ring-2 ring-primary"
                                                            : ""
                                                    }`}
                                                    onClick={() => setActiveImageIndex(index)}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-80 flex items-center justify-center bg-slate-100 dark:bg-darkmode-700 text-slate-400">
                                    <div className="text-center">
                                        <FiHome className="mx-auto text-4xl mb-2" />
                                        <p>No images available</p>
                                    </div>
                                </div>
                            )}
                        </div> */}

                        {/* This Image Gallery is for temporary period of time */}
                        <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md overflow-hidden mb-6">
                            {images && images.length > 0 ? (
                                <div>
                                    <div className="relative h-80 bg-slate-200 dark:bg-darkmode-700">
                                        <img
                                            src={images[activeImageIndex]}
                                            alt={previewData?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {images.length > 1 && (
                                        <div className="p-4 flex space-x-2 overflow-x-auto">
                                            {images.map((img, index) => (
                                                <button
                                                    key={index}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                                                        activeImageIndex === index
                                                            ? "ring-2 ring-primary"
                                                            : ""
                                                    }`}
                                                    onClick={() => setActiveImageIndex(index)}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-80 flex items-center justify-center bg-slate-100 dark:bg-darkmode-700 text-slate-400">
                                    <div className="text-center">
                                        <FiHome className="mx-auto text-4xl mb-2" />
                                        <p>No images available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Property Details
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-slate-50 dark:bg-darkmode-700 rounded-lg">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {previewData?.bhk || "N/A"}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        BHK
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-darkmode-700 rounded-lg">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {previewData?.bathrooms || "N/A"}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        Bathrooms
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-darkmode-700 rounded-lg">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {previewData?.size_sqft || "N/A"}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        Sq. Ft.
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-darkmode-600 pt-4">
                                <table className="w-full">
                                    <tbody className="divide-y divide-slate-200 dark:divide-darkmode-600">
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Property Type
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.property_type || "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Facing
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.facing || "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Furnishing
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.furnishing || "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Floor
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.floors
                                                    ? `${previewData?.floors} of ${
                                                          previewData?.total_floor || "N/A"
                                                      }`
                                                    : "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Builder
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.builder || "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Property Age
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {`${previewData?.property_age} years`}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Parking
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {previewData?.covered_parking &&
                                                previewData?.open_parking
                                                    ? `Covered: ${previewData?.covered_parking}, Open: ${previewData?.open_parking}`
                                                    : previewData?.covered_parking
                                                    ? `Covered: ${previewData?.covered_parking}`
                                                    : previewData?.open_parking
                                                    ? `Open: ${previewData?.open_parking}`
                                                    : "Not specified"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium text-slate-700 dark:text-slate-300">
                                                Maintenance
                                            </td>
                                            <td className="py-2 text-slate-600 dark:text-slate-400">
                                                {formattedMaintenance}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Description
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {previewData?.description || "No description provided."}
                            </p>
                        </div>

                        {/* Facilities */}
                        {previewData?.facilities && previewData?.facilities.length > 0 && (
                            <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                    Facilities
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {previewData?.facilities.map((facility, index) => (
                                        <div key={index} className="flex items-center">
                                            <FiCheck className="text-primary mr-2" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {facility}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        {/* Contact Card */}
                        <div className="bg-white dark:bg-darkmode-800 rounded-lg shadow-md p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Agent Detail
                            </h3>

                            <div className="mb-4 p-3 bg-slate-50 dark:bg-darkmode-700 rounded-lg">
                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                    {previewData?.agent_name}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Real Estate Agent
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <span className="font-medium mr-2">Phone:</span>
                                    <span>(01) 123 456 7895</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <span className="font-medium mr-2">Email:</span>
                                    <span>shivangi.preet@example.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyPreview;
