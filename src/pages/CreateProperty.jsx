import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    FiUpload,
    FiX,
    FiImage,
    FiVideo,
    FiCheckCircle,
    FiHome,
    FiDollarSign,
    FiMapPin,
    FiCheck,
} from "react-icons/fi";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { propertyValidationSchema } from "../utils/validationSchemas/propertySchema";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { propertyApi } from "../api/propertyApi.js";
import { tableApi } from "../api/tableApi.js";

const initialValues = {
    agent_email: "",
    property_type: "",
    property_category: "",
    title: "",
    location: "",
    size_sqft: "",
    carpet_area: "",
    buildup_area: "",
    bhk: "",
    floor: "",
    total_floor: "",
    facing: "",
    furnishing: "",
    price: "",
    maintenance: "",
    expected_value: "",
    availability: "",
    builder: "",
    description: "",
    covered_parking: "",
    open_parking: "",
    bathroom: "",
    brokerage: "",
    images: [],
    video: "",
    facilities: [],
    property_age: "",
};

function PropertyListingForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const isPreview = location.state?.isPropertyPreview;
    const previewData = location.state?.propertyPreview;

    const { id } = useParams();

    const [editData, setEditData] = useState(null);

    const isEditMode = Boolean(id);

    const [currentStep, setCurrentStep] = useState(1);
    const [imageFiles, setImageFiles] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [propertyCategories, setPropertyCategories] = useState([]);
    const [facingOptions, setFacingOptions] = useState([]);
    const [furnishingOptions, setFurnishingOptions] = useState([]);
    const [parkingOptions, setParkingOptions] = useState([]);
    const [availabilityOptions, setAvailabilityOptions] = useState([]);
    const [brokerageOptions, setBrokerageOptions] = useState([]);
    const [facilitiesList, setFacilitiesList] = useState([]);
    const [builder, setBuilder] = useState([]);
    const [bathroomType, setBathroomType] = useState([]);
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

    const formInitialValues = useMemo(() => {
        if (isPreview && previewData) {
            const previewValues = { ...initialValues };
            Object.keys(previewData).forEach((key) => {
                if (previewData[key] !== undefined && previewData[key] !== null) {
                    previewValues[key] = previewData[key];
                }
            });
            return previewValues;
        } else if (editData) {
            const editValues = { ...initialValues };
            Object.keys(editData).forEach((key) => {
                if (editData[key] !== undefined && editData[key] !== null) {
                    editValues[key] = editData[key];
                }
            });
            return editValues;
        } else {
            return initialValues;
        }
    }, [editData, previewData]);

    const getFieldProps = () => {
        if (isPreview) {
            return { disabled: true, readOnly: true };
        }
        return {};
    };

    const fieldProps = getFieldProps();

    useEffect(() => {
        if (isPreview && previewData?.images) {
            setImageFiles(Array.isArray(previewData.images) ? previewData.images : []);
        } else if (editData?.images) {
            setImageFiles(Array.isArray(editData.images) ? editData.images : []);
        } else {
            setImageFiles([]);
        }
    }, [isPreview, previewData, editData]);

    useEffect(() => {
        const fetchDropDownData = async () => {
            try {
                setIsLoadingDropdowns(true);
                const propertyRes = await tableApi.dataTable({
                    table_name: "PropertyType",
                });

                const propertyCatRes = await tableApi.dataTable({
                    table_name: "PropertyCategory",
                });
                const facingOptionsRes = await tableApi.dataTable({
                    table_name: "PropertyFacing",
                });
                const furnishingOptionsRes = await tableApi.dataTable({
                    table_name: "PropertyFurnishing",
                });
                const parkingOptionsRes = await tableApi.dataTable({
                    table_name: "ParkingType",
                });
                const availabilityOptionsRes = await tableApi.dataTable({
                    table_name: "PropertyAvailability",
                });

                const brokerageOptionsRes = await tableApi.dataTable({
                    table_name: "BrokerageOption",
                });
                const facilitiesListRes = await tableApi.dataTable({
                    table_name: "Facility",
                });
                const bathroomTypeRes = await tableApi.dataTable({
                    table_name: "BathroomType",
                });
                const builderRes = await tableApi.dataTable({
                    table_name: "Builder",
                });

                setPropertyTypes(propertyRes?.data || propertyRes || []);
                setPropertyCategories(propertyCatRes?.data || propertyCatRes || []);
                setFacingOptions(facingOptionsRes?.data || facingOptionsRes || []);
                setFurnishingOptions(furnishingOptionsRes?.data || furnishingOptionsRes || []);
                setParkingOptions(parkingOptionsRes?.data || parkingOptionsRes || []);
                setAvailabilityOptions(
                    availabilityOptionsRes?.data || availabilityOptionsRes || [],
                );
                setBrokerageOptions(brokerageOptionsRes?.data || brokerageOptionsRes || []);
                setFacilitiesList(facilitiesListRes?.data || facilitiesListRes || []);
                setBathroomType(bathroomTypeRes?.data || bathroomTypeRes || []);
                setBuilder(builderRes?.data || builderRes || []);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                toast.error("Failed to load dropdown options", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                // Fallback data
                setPropertyTypes([
                    { id: 4, name: "Commercial" },
                    { id: 1, name: "Flat" },
                    { id: 3, name: "Plot" },
                    { id: 2, name: "Villa" },
                ]);
                setPropertyCategories([
                    { id: 1, name: "Rent" },
                    { id: 3, name: "Resale" },
                    { id: 2, name: "Sale" },
                ]);
                setFacingOptions([
                    { id: 1, name: "East" },
                    { id: 2, name: "Eastwest" },
                    { id: 3, name: "North" },
                    { id: 4, name: "Northsouth" },
                    { id: 5, name: "South" },
                    { id: 6, name: "Southnorth" },
                    { id: 7, name: "West" },
                    { id: 8, name: "Westeast" },
                ]);
                setFurnishingOptions([
                    { id: 1, name: "Furnished" },
                    { id: 2, name: "Semi-Furnished" },
                    { id: 3, name: "Unfurnished" },
                ]);
                setParkingOptions([
                    { id: 8, name: "3+" },
                    { id: 3, name: "Double" },
                    { id: 1, name: "None" },
                    { id: 2, name: "Single" },
                    { id: 9, name: "Undisclosed" },
                ]);
                setAvailabilityOptions([
                    { id: 1, name: "Available" },
                    { id: 2, name: "Pending" },
                    { id: 3, name: "Sold" },
                ]);
                setBrokerageOptions([
                    { id: 1, name: "No" },
                    { id: 2, name: "Yes" },
                ]);
                setFacilitiesList([
                    { id: 10, name: "24x7 Security" },
                    { id: 26, name: "ATM" },
                    { id: 16, name: "CCTV" },
                    { id: 13, name: "Children's Play Area" },
                    { id: 6, name: "Clubhouse" },
                    { id: 19, name: "Community Hall" },
                    { id: 8, name: "Covered Parking" },
                    { id: 23, name: "Fire Safety" },
                    { id: 4, name: "Gym" },
                    { id: 15, name: "Intercom" },
                    { id: 17, name: "Jogging Track" },
                    { id: 25, name: "Landscape Garden" },
                    { id: 12, name: "Lift" },
                    { id: 3, name: "Market" },
                    { id: 2, name: "Metro" },
                    { id: 9, name: "Open Parking" },
                    { id: 11, name: "Park" },
                    { id: 20, name: "Piped Gas" },
                    { id: 7, name: "Power Backup" },
                    { id: 14, name: "Rainwater Harvesting" },
                    { id: 1, name: "School" },
                    { id: 27, name: "Security" },
                    { id: 21, name: "Shopping Center" },
                    { id: 18, name: "Sports Facility" },
                    { id: 5, name: "Swimming Pool" },
                    { id: 24, name: "Visitor Parking" },
                    { id: 22, name: "Wi‑Fi" },
                ]);
                setBathroomType([
                    { id: 1, name: "1" },
                    { id: 2, name: "2" },
                    { id: 3, name: "3" },
                    { id: 4, name: "4" },
                    { id: 5, name: "5+" },
                ]);
                setBuilder([
                    { id: 1, name: "DLF Builder" },
                    { id: 2, name: "Emaar" },
                    { id: 3, name: "Godrej" },
                    { id: 4, name: "M3M" },
                ]);
            } finally {
                setIsLoadingDropdowns(false);
            }
        };
        fetchDropDownData();
    }, [tableApi.dataTable]);

    const handleImageChange = (e, setFieldValue) => {
        if (isPreview) return;

        const files = Array.from(e.target.files);
        if (files.length + imageFiles.length > 12) {
            alert("Maximum 12 images allowed");
            return;
        }

        const urls = files.map((file) => URL.createObjectURL(file));
        setImageFiles((prev) => [...prev, ...urls]);
        setFieldValue("images", [...imageFiles, ...urls]);
    };

    const removeImage = (idx, setFieldValue) => {
        if (isPreview) return;

        const newFiles = imageFiles.filter((_, i) => i !== idx);
        setImageFiles(newFiles);
        setFieldValue("images", newFiles);
    };

    const toggleFacility = (facility, values, setFieldValue) => {
        if (isPreview) return;

        const facilities = values.facilities.includes(facility.name)
            ? values.facilities.filter((f) => f !== facility.name)
            : [...values.facilities, facility.name];
        setFieldValue("facilities", facilities);
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const onSubmitProperty = async (values, { setSubmitting, resetForm }) => {
        if (isPreview) {
            return;
        }
        try {
            const payload = {
                client_id: 1,
                agent_email: values.agent_email,
                property_type: values.property_type,
                property_category: values.property_category,
                title: values.title,
                location: values.location,
                size_sqft: Number(values.size_sqft),
                carpet_area: Number(values.carpet_area),
                buildup_area: Number(values.buildup_area),
                bhk: Number(values.bhk),
                floor: Number(values.floor),
                total_floor: Number(values.total_floor),
                facing: values.facing,
                furnishing: values.furnishing,
                price: Number(values.price),
                maintenance: Number(values.maintenance),
                expected_value: Number(values.expected_value),
                availability: values.availability,
                builder: values.builder,
                description: values.description,
                covered_parking: values.covered_parking,
                open_parking: values.open_parking,
                bathroom: values.bathroom,
                brokerage: values.brokerage,
                images: values.images,
                video: values.video,
                facilities: values.facilities,
                property_age: Number(values.property_age),
            };

            let res;

            if (id) {
                // UPDATE
                res = await propertyApi.updateProperty({
                    ...payload,
                    property_id: id,
                });
            } else {
                // CREATE
                res = await propertyApi.createProperty(payload);
            }

            if (res?.message) {
                toast.success("Property saved successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                setImageFiles([]);
                resetForm();
                setTimeout(() => {
                    navigate("/dashboard/product-list");
                }, 1000);
            }
        } catch (err) {
            toast.error(
                err?.data.replace("Transaction failed:", "") ||
                    "Failed to submit listing. Try again.",
                {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                },
            );
            console.error("Error details:", err?.data || err?.error || err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const response = await propertyApi.propertyPreview({
                        property_id: id,
                        client_id: 1,
                    });

                    if (response) {
                        setEditData(response);
                    }
                } catch (err) {
                    console.error("Failed to fetch property:", err);
                }
            })();
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-darkmode-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mt-8 mb-8">
                <h2 className="intro-y text-lg font-medium mr-auto">
                    {isPreview
                        ? "Property Preview"
                        : editData
                          ? "Edit Property"
                          : "Add New Property"}
                </h2>
            </div>

            {/* Show mode indicator */}
            {isPreview && (
                <div className="intro-y mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                        📋 Preview Mode - Data is read-only
                    </p>
                </div>
            )}
            {editData && !isPreview && (
                <div className="intro-y mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                        ✏️ Edit Mode - Updating existing property
                    </p>
                </div>
            )}

            <div className="intro-y box py-10 sm:py-20 mt-5">
                {/* Progress Steps */}
                <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className="intro-x lg:text-center flex items-center lg:block flex-1 z-10"
                        >
                            <button
                                className={`w-10 h-10 rounded-full btn ${
                                    currentStep >= step
                                        ? "btn-primary"
                                        : "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                                }`}
                            >
                                {currentStep > step ? <FiCheck size={18} /> : step}
                            </button>
                            <div
                                className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${
                                    currentStep >= step
                                        ? "font-medium"
                                        : "text-slate-600 dark:text-slate-400"
                                }`}
                            >
                                {step === 1
                                    ? "Basic Details"
                                    : step === 2
                                      ? "Pricing & Features"
                                      : step === 3
                                        ? "Amenities"
                                        : step === 4
                                          ? "Media"
                                          : "Review & Submit"}
                            </div>
                        </div>
                    ))}
                </div>

                {(isEditMode && !editData) || (isPreview && !previewData) ? (
                    <>
                        <div>Loading...</div>
                    </>
                ) : (
                    <>
                        <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-slate-200/60 dark:border-darkmode-400">
                            <Formik
                                initialValues={formInitialValues}
                                validationSchema={isPreview ? undefined : propertyValidationSchema}
                                validateOnChange={false}
                                validateOnBlur={true}
                                context={{ isEditMode }}
                                onSubmit={onSubmitProperty}
                                key={id || "create"}
                                enableReinitialize
                            >
                                {({
                                    values,
                                    setFieldValue,
                                    isSubmitting,
                                    errors,
                                    touched,
                                    handleChange,
                                }) => (
                                    <Form>
                                        {/* Step 1: Property Details */}
                                        {currentStep === 1 && (
                                            <div>
                                                <div className="font-medium text-base">
                                                    Property Details
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                                    {/* Agent Email */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="agent_email"
                                                            className="form-label"
                                                        >
                                                            Agent Email
                                                        </label>
                                                        <Field
                                                            type="email"
                                                            id="agent_email"
                                                            name="agent_email"
                                                            className="form-control"
                                                            placeholder="agent@example.com"
                                                            disabled={editData}
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="agent_email"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Property Type */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="property_type"
                                                            className="form-label"
                                                        >
                                                            <FiHome className="inline mr-2" />{" "}
                                                            Property Type
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="property_type"
                                                            name="property_type"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select property type"}
                                                            </option>
                                                            {propertyTypes.map((type) => (
                                                                <option
                                                                    key={type?.id}
                                                                    value={type?.name}
                                                                >
                                                                    {type?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="property_type"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Property Category */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="property_category"
                                                            className="form-label"
                                                        >
                                                            Property Category
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="property_category"
                                                            name="property_category"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select category"}
                                                            </option>
                                                            {propertyCategories.map((cat) => (
                                                                <option
                                                                    key={cat?.id}
                                                                    value={cat?.name}
                                                                >
                                                                    {cat?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="property_category"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Title */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="title"
                                                            className="form-label"
                                                        >
                                                            Title
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            id="title"
                                                            name="title"
                                                            className="form-control"
                                                            placeholder="Luxury 3BHK Apartment"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="title"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Location */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="location"
                                                            className="form-label"
                                                        >
                                                            <FiMapPin className="inline mr-2" />{" "}
                                                            Location
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            id="location"
                                                            name="location"
                                                            className="form-control"
                                                            placeholder="DLF Phase 5, Gurgaon"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="location"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Size Sqft */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="size_sqft"
                                                            className="form-label"
                                                        >
                                                            Size (sqft)
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="size_sqft"
                                                            name="size_sqft"
                                                            className="form-control"
                                                            placeholder="1800"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="size_sqft"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Carpet Area */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="carpet_area"
                                                            className="form-label"
                                                        >
                                                            Carpet Area
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="carpet_area"
                                                            name="carpet_area"
                                                            className="form-control"
                                                            placeholder="1600"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="carpet_area"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Buildup Area */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="buildup_area"
                                                            className="form-label"
                                                        >
                                                            Buildup Area
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="buildup_area"
                                                            name="buildup_area"
                                                            className="form-control"
                                                            placeholder="1750"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="buildup_area"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* BHK */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label htmlFor="bhk" className="form-label">
                                                            BHK
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="bhk"
                                                            name="bhk"
                                                            className="form-control"
                                                            placeholder="3"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="bhk"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="btn btn-primary w-24"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Additional Details */}
                                        {currentStep === 2 && (
                                            <div>
                                                <div className="font-medium text-base">
                                                    Pricing & Features
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                                    {/* Floor */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="floor"
                                                            className="form-label"
                                                        >
                                                            Floor
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="floor"
                                                            name="floor"
                                                            className="form-control"
                                                            placeholder="5"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="floor"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Total Floor */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="total_floor"
                                                            className="form-label"
                                                        >
                                                            Total Floor
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="total_floor"
                                                            name="total_floor"
                                                            className="form-control"
                                                            placeholder="20"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="total_floor"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Facing */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="facing"
                                                            className="form-label"
                                                        >
                                                            Facing
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="facing"
                                                            name="facing"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select facing"}
                                                            </option>
                                                            {facingOptions.map((f) => (
                                                                <option key={f?.id} value={f?.name}>
                                                                    {f?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="facing"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Furnishing */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="furnishing"
                                                            className="form-label"
                                                        >
                                                            Furnishing
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="furnishing"
                                                            name="furnishing"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select furnishing"}
                                                            </option>
                                                            {furnishingOptions.map((f) => (
                                                                <option key={f?.id} value={f?.name}>
                                                                    {f?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="furnishing"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Price */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="price"
                                                            className="form-label"
                                                        >
                                                            <FiDollarSign className="inline mr-2" />{" "}
                                                            Price (INR)
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="price"
                                                            name="price"
                                                            className="form-control"
                                                            placeholder="15000000"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="price"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Maintenance */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="maintenance"
                                                            className="form-label"
                                                        >
                                                            Maintenance
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="maintenance"
                                                            name="maintenance"
                                                            className="form-control"
                                                            placeholder="5000"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="maintenance"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Expected Value */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="expected_value"
                                                            className="form-label"
                                                        >
                                                            Expected Value
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="expected_value"
                                                            name="expected_value"
                                                            className="form-control"
                                                            placeholder="15500000"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="expected_value"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Availability */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="availability"
                                                            className="form-label"
                                                        >
                                                            Availability
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="availability"
                                                            name="availability"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select availability"}
                                                            </option>
                                                            {availabilityOptions.map((a) => (
                                                                <option key={a?.id} value={a?.name}>
                                                                    {a?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="availability"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Builder */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="builder"
                                                            className="form-label"
                                                        >
                                                            Builder
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="builder"
                                                            name="builder"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select Builder"}
                                                            </option>
                                                            {builder.map((a) => (
                                                                <option key={a?.id} value={a?.name}>
                                                                    {a?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="builder"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="btn btn-secondary w-24"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="btn btn-primary w-24 ml-2"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Additional Features */}
                                        {currentStep === 3 && (
                                            <div>
                                                <div className="font-medium text-base">
                                                    Additional Features
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                                    {/* Covered Parking */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="covered_parking"
                                                            className="form-label"
                                                        >
                                                            Covered Parking
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="covered_parking"
                                                            name="covered_parking"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select Parking"}
                                                            </option>
                                                            {parkingOptions.map((p) => (
                                                                <option key={p?.id} value={p?.name}>
                                                                    {p?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="covered_parking"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Open Parking */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="open_parking"
                                                            className="form-label"
                                                        >
                                                            Open Parking
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="open_parking"
                                                            name="open_parking"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select Parking"}
                                                            </option>
                                                            {parkingOptions.map((p) => (
                                                                <option key={p?.id} value={p?.name}>
                                                                    {p?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="open_parking"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Bathroom */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="bathroom"
                                                            className="form-label"
                                                        >
                                                            Bathroom
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="bathroom"
                                                            name="bathroom"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select Bathroom type"}
                                                            </option>
                                                            {bathroomType.map((a) => (
                                                                <option key={a?.id} value={a?.name}>
                                                                    {a?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="bathroom"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Brokerage */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="brokerage"
                                                            className="form-label"
                                                        >
                                                            Brokerage
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            id="brokerage"
                                                            name="brokerage"
                                                            className="form-select"
                                                            {...fieldProps}
                                                        >
                                                            <option value="">
                                                                {isLoadingDropdowns
                                                                    ? "Loading..."
                                                                    : "Select Brokerage"}
                                                            </option>
                                                            {brokerageOptions.map((b) => (
                                                                <option key={b?.id} value={b?.name}>
                                                                    {b?.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="brokerage"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Property Age */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="property_age"
                                                            className="form-label"
                                                        >
                                                            Property Age (years)
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            id="property_age"
                                                            name="property_age"
                                                            className="form-control"
                                                            placeholder="2"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="property_age"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Facilities */}
                                                    <div className="intro-y col-span-12">
                                                        <label className="form-label">
                                                            Facilities
                                                        </label>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {facilitiesList.map((facility) => (
                                                                <button
                                                                    type="button"
                                                                    key={facility.id}
                                                                    onClick={() =>
                                                                        toggleFacility(
                                                                            facility,
                                                                            values,
                                                                            setFieldValue,
                                                                        )
                                                                    }
                                                                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                                                                        values.facilities.includes(
                                                                            facility.name,
                                                                        )
                                                                            ? "bg-primary text-white border border-primary"
                                                                            : "bg-slate-100 text-slate-600 dark:bg-darkmode-400 dark:text-slate-400 border border-slate-200 dark:border-darkmode-400"
                                                                    }`}
                                                                    disabled={isPreview}
                                                                >
                                                                    {facility.name}
                                                                    {values.facilities.includes(
                                                                        facility.name,
                                                                    ) && (
                                                                        <FiCheckCircle className="ml-1" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="facilities"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="btn btn-secondary w-24"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="btn btn-primary w-24 ml-2"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 4: Media Upload */}
                                        {currentStep === 4 && (
                                            <div>
                                                <div className="font-medium text-base">
                                                    Media Upload
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                                    {/* Images Upload */}
                                                    <div className="intro-y col-span-12">
                                                        <label className="form-label flex items-center">
                                                            <FiImage className="mr-2" /> Property
                                                            Images (Max 12)
                                                        </label>
                                                        <div className="border-2 border-dashed border-slate-200 dark:border-darkmode-400 rounded-lg p-6 text-center bg-slate-100 dark:bg-darkmode-400/20">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <FiUpload className="w-10 h-10 text-slate-400 mb-3" />
                                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                    <span className="font-medium text-primary">
                                                                        Click to upload
                                                                    </span>{" "}
                                                                    or drag and drop
                                                                </p>
                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    PNG, JPG up to 5MB each
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handleImageChange(
                                                                        e,
                                                                        setFieldValue,
                                                                    )
                                                                }
                                                                className="hidden"
                                                                id="image-upload"
                                                            />
                                                            <label
                                                                htmlFor="image-upload"
                                                                className="mt-4 inline-block px-4 py-2 bg-slate-200 dark:bg-darkmode-400 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-300 dark:hover:bg-darkmode-300 cursor-pointer border border-slate-300 dark:border-darkmode-500"
                                                            >
                                                                Select Images
                                                            </label>
                                                        </div>
                                                        {/* Image Previews */}
                                                        {imageFiles.length > 0 && (
                                                            <div className="mt-6">
                                                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                                                    Selected Images (
                                                                    {imageFiles.length}/12)
                                                                </h3>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                                    {imageFiles.map((img, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="relative group"
                                                                        >
                                                                            <img
                                                                                src={img}
                                                                                alt="Preview"
                                                                                className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-darkmode-400"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeImage(
                                                                                        idx,
                                                                                        setFieldValue,
                                                                                    )
                                                                                }
                                                                                className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <FiX size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Video */}
                                                    <div className="intro-y col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="video"
                                                            className="form-label"
                                                        >
                                                            <FiVideo className="inline mr-2" />{" "}
                                                            Video URL
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            id="video"
                                                            name="video"
                                                            className="form-control"
                                                            placeholder="https://www.youtube.com/watch?v=example"
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="video"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Description */}
                                                    <div className="intro-y col-span-12">
                                                        <label
                                                            htmlFor="description"
                                                            className="form-label"
                                                        >
                                                            Description
                                                        </label>
                                                        <Field
                                                            as="textarea"
                                                            id="description"
                                                            name="description"
                                                            rows={4}
                                                            className="form-control"
                                                            placeholder="A spacious and luxurious 3BHK apartment with all modern amenities."
                                                            {...fieldProps}
                                                        />
                                                        {!isPreview && (
                                                            <ErrorMessage
                                                                name="description"
                                                                component="div"
                                                                className="text-red-500 text-xs mt-1"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="btn btn-secondary w-24"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="btn btn-primary w-24 ml-2"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 5: Review & Submit */}
                                        {currentStep === 5 && (
                                            <div>
                                                <div className="font-medium text-base">
                                                    Review Your Listing
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                                    {/* Property Details Summary */}
                                                    <div className="intro-y col-span-12 md:col-span-6">
                                                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b border-slate-200 dark:border-darkmode-400">
                                                            Property Details
                                                        </h3>
                                                        <div className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Agent Email:{" "}
                                                                </span>
                                                                {values.agent_email}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Type:{" "}
                                                                </span>
                                                                {values.property_type}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Category:{" "}
                                                                </span>
                                                                {values.property_category}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Title:{" "}
                                                                </span>
                                                                {values.title}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Location:{" "}
                                                                </span>
                                                                {values.location}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Size:{" "}
                                                                </span>
                                                                {values.size_sqft} sqft
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Carpet Area:{" "}
                                                                </span>
                                                                {values.carpet_area}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Buildup Area:{" "}
                                                                </span>
                                                                {values.buildup_area}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    BHK:{" "}
                                                                </span>
                                                                {values.bhk}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Floor:{" "}
                                                                </span>
                                                                {values.floor}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Total Floor:{" "}
                                                                </span>
                                                                {values.total_floor}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Facing:{" "}
                                                                </span>
                                                                {values.facing}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Furnishing:{" "}
                                                                </span>
                                                                {values.furnishing}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Price:{" "}
                                                                </span>
                                                                ₹{values.price}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Maintenance:{" "}
                                                                </span>
                                                                ₹{values.maintenance}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Expected Value:{" "}
                                                                </span>
                                                                ₹{values.expected_value}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Availability:{" "}
                                                                </span>
                                                                {values.availability}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Builder:{" "}
                                                                </span>
                                                                {values.builder}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Description:{" "}
                                                                </span>
                                                                {values.description}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Covered Parking:{" "}
                                                                </span>
                                                                {values.covered_parking}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Open Parking:{" "}
                                                                </span>
                                                                {values.open_parking}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Bathroom:{" "}
                                                                </span>
                                                                {values.bathroom}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Brokerage:{" "}
                                                                </span>
                                                                {values.brokerage}
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                                                    Property Age:{" "}
                                                                </span>
                                                                {values.property_age}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Facilities & Media Summary */}
                                                    <div className="intro-y col-span-12 md:col-span-6">
                                                        <div className="mb-8">
                                                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b border-slate-200 dark:border-darkmode-400">
                                                                Facilities
                                                            </h3>
                                                            {values.facilities.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {values.facilities.map(
                                                                        (facility) => (
                                                                            <span
                                                                                key={facility}
                                                                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center border border-primary/20"
                                                                            >
                                                                                <FiCheck className="mr-1" />{" "}
                                                                                {facility}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-slate-500 dark:text-slate-400">
                                                                    No facilities selected
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 pb-2 border-b border-slate-200 dark:border-darkmode-400">
                                                                Media
                                                            </h3>
                                                            <div className="mb-4">
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                                    Images ({imageFiles.length})
                                                                </p>
                                                                {imageFiles.length > 0 ? (
                                                                    <div className="grid grid-cols-3 gap-2">
                                                                        {imageFiles
                                                                            .slice(0, 3)
                                                                            .map((img, idx) => (
                                                                                <img
                                                                                    key={idx}
                                                                                    src={img}
                                                                                    alt="Preview"
                                                                                    className="w-full h-20 object-cover rounded border border-slate-200 dark:border-darkmode-400"
                                                                                />
                                                                            ))}
                                                                        {imageFiles.length > 3 && (
                                                                            <div className="border border-slate-200 dark:border-darkmode-400 rounded flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                                                                                +
                                                                                {imageFiles.length -
                                                                                    3}{" "}
                                                                                more
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-slate-500 dark:text-slate-400">
                                                                        No images added
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                                    Video
                                                                </p>
                                                                {values.video ? (
                                                                    <div className="flex items-center text-primary">
                                                                        <FiVideo className="mr-2" />
                                                                        <span className="text-slate-700 dark:text-slate-300 truncate">
                                                                            {values.video}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-slate-500 dark:text-slate-400">
                                                                        No video Link Added
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="btn btn-secondary w-24"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="btn btn-primary w-30 ml-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <svg
                                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    ></path>
                                                                </svg>
                                                                Submitting...
                                                            </>
                                                        ) : editData ? (
                                                            "Update Property"
                                                        ) : (
                                                            "Create Property"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer />
        </div>
    );
}

export default PropertyListingForm;
