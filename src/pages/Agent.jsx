import { useState, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { agentApi } from "../api/agentApi.js";
import { agentValidationSchema } from "../utils/validationSchemas/agentSchema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
    FiUser,
    FiPhone,
    FiMail,
    FiHome,
    FiMapPin,
    FiSave,
    FiChevronRight,
    FiChevronLeft,
    FiCamera,
} from "react-icons/fi";

function Agent() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        experience: "",
        bio: "",
        languages: [],
        licenseNumber: "",
        socialMedia: {
            facebook: "",
            linkedin: "",
            instagram: "",
        },
    });

    const initialValues = {
        name: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        area: "",
        profile: "",
    };

    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const fileInputRef = useRef(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested social media fields
        if (name.startsWith("socialMedia.")) {
            const socialMediaField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                socialMedia: {
                    ...prev.socialMedia,
                    [socialMediaField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle language addition
    const handleAddLanguage = () => {
        if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, selectedLanguage],
            }));
            setSelectedLanguage("");
        }
    };

    // Handle language removal
    const handleRemoveLanguage = (language) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter((lang) => lang !== language),
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Trigger file input
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    
        try {
            // let imageUrl = "";
            // if (values.profile) {
            //   console.log("🟡 Step 2: Profile file selected =>", values.profile);

            //   imageUrl = await new Promise((resolve, reject) => {
            //     const reader = new FileReader();
            //     reader.onloadend = () =>{
            //         console.log("🟡 Step 3: Converted Base64 =>", reader.result?.slice(0, 50) + "...");
            //     resolve(reader.result); // Base64 string
            //     }
            //     reader.onerror = reject;
            //     reader.readAsDataURL(values.profile);
            //   });
            // }

            const payload = {
                client_id: 1,
                name: values.name,
                email: values.email,
                mobile: values.mobile,
                address: values.address,
                city: values.city,
                area: values.area,
                // profile_photo_url: "abc.png", // send Base64 as URL
            };


            const res = await agentApi.createAgent(payload);
            
            if (res?.message) {
                toast.success("Lead saved successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                resetForm();
                setCurrentStep(1);
                setErrorMessage("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setTimeout(() => {
                    navigate("/dashboard/agentslist");
                }, 1000);
            }
        } catch (err) {
            console.error("❌ Step 6: API Error =>", err);
            setErrorMessage(err?.data?.message || "Failed to register agent.");
        } finally {
       
            setSubmitting(false);
        }
    };

    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkmode-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mt-8 mb-8">
                <h2 className="intro-y text-lg font-medium mr-auto">Agent Registration</h2>
            </div>

            <div className="intro-y box py-10 sm:py-20 mt-5">
                {/* Progress Steps */}
                <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
                    <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                        <button
                            className={`w-10 h-10 rounded-full btn ${
                                currentStep >= 1
                                    ? "btn-primary"
                                    : "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                            }`}
                        >
                            {currentStep > 1 ? <FiChevronRight className="w-5 h-5" /> : 1}
                        </button>
                        <div
                            className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${
                                currentStep >= 1
                                    ? "font-medium"
                                    : "text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            Personal Info
                        </div>
                    </div>
                    <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                        <button
                            className={`w-10 h-10 rounded-full btn ${
                                currentStep >= 2
                                    ? "btn-primary"
                                    : "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                            }`}
                        >
                            {currentStep > 2 ? <FiChevronRight className="w-5 h-5" /> : 2}
                        </button>
                        <div
                            className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${
                                currentStep >= 2
                                    ? "font-medium"
                                    : "text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            Profile Setup
                        </div>
                    </div>
                </div>

                <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-slate-200/60 dark:border-darkmode-400">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={agentValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form>
                                {/* Step 1: Personal Information */}
                                {currentStep === 1 && (
                                    <div>
                                        <div className="font-medium text-base">
                                            Personal Information
                                        </div>
                                        <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                            {/* Name */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="name" className="form-label">
                                                    <FiUser className="inline mr-2 text-primary" />
                                                    Full Name
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="John Doe"
                                                />
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="email" className="form-label">
                                                    <FiMail className="inline mr-2 text-primary" />
                                                    Email Address
                                                </label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="email@example.com"
                                                />
                                                <ErrorMessage
                                                    name="email"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Mobile */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="mobile" className="form-label">
                                                    <FiPhone className="inline mr-2 text-primary" />
                                                    Mobile Number
                                                </label>
                                                <Field
                                                    type="tel"
                                                    name="mobile"
                                                    className="form-control"
                                                    placeholder="Enter 10-digit mobile number"
                                                />
                                                <ErrorMessage
                                                    name="mobile"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="address" className="form-label">
                                                    <FiHome className="inline mr-2 text-primary" />
                                                    Address
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="address"
                                                    className="form-control"
                                                    placeholder="Street address"
                                                />
                                                <ErrorMessage
                                                    name="address"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* City */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="city" className="form-label">
                                                    <FiMapPin className="inline mr-2 text-primary" />
                                                    City
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="city"
                                                    className="form-control"
                                                    placeholder="City"
                                                />
                                                <ErrorMessage
                                                    name="city"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Area */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="area" className="form-label">
                                                    <FiMapPin className="inline mr-2 text-primary" />
                                                    Area
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="area"
                                                    className="form-control"
                                                    placeholder="Area/Locality"
                                                />
                                                <ErrorMessage
                                                    name="area"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-8">
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn-primary w-24 flex items-center justify-center"
                                            >
                                                Next
                                                <FiChevronRight className="ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Profile Setup */}
                                {currentStep === 2 && (
                                    <div>
                                        <div className="font-medium text-base">Profile Setup</div>
                                        <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                            {/* Profile Photo */}
                                            <div className="intro-y col-span-12">
                                                <label htmlFor="profile" className="form-label">
                                                    <FiCamera className="inline mr-2 text-primary" />
                                                    Profile Photo
                                                </label>
                                                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                                    <div
                                                        className={`relative w-32 h-32 rounded-full overflow-hidden border-2 ${
                                                            values.profile
                                                                ? "border-primary"
                                                                : "border-dashed border-slate-300"
                                                        } bg-slate-100 flex items-center justify-center cursor-pointer`}
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        {values.profile ? (
                                                            <img
                                                                src={
                                                                    typeof values.profile ===
                                                                    "string"
                                                                        ? values.profile
                                                                        : URL.createObjectURL(
                                                                              values.profile
                                                                          )
                                                                }
                                                                alt="Profile preview"
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center p-4">
                                                                <FiCamera className="w-8 h-8 mx-auto text-slate-400" />
                                                                <span className="text-xs text-slate-500 mt-1 block">
                                                                    Click to upload
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            ref={fileInputRef}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target.files &&
                                                                    e.target.files[0]
                                                                ) {
                                                                    setFieldValue(
                                                                        "profile",
                                                                        e.target.files[0]
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <p className="text-sm text-slate-700 mb-2">
                                                            Upload a professional headshot (JPG or
                                                            PNG, max 5MB)
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Recommended size: 500x500 pixels
                                                        </p>
                                                        {values.profile && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setFieldValue("profile", "")
                                                                }
                                                                className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg flex items-center"
                                                            >
                                                                Remove photo
                                                            </button>
                                                        )}
                                                        <ErrorMessage
                                                            name="profile"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-8">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn-secondary w-24 mr-2 flex items-center justify-center"
                                            >
                                                <FiChevronLeft className="mr-2" />
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn btn-primary w-32 flex items-center justify-center"
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
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiSave className="mr-2" />
                                                        Register Agent
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Agent;
