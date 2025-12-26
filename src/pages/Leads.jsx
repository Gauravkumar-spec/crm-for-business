import React, { useEffect, useState } from "react";
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
    FiSave,
    FiChevronRight,
    FiChevronLeft,
    FiBriefcase,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { buildLeadValidationSchema } from "../utils/validationSchemas/leadSchema";
import { leadApi } from "../api/leadApi.js";
import { useNavigate } from "react-router-dom";
import { tableApi } from "../api/tableApi.js";

const Leads = () => {
    const navigate = useNavigate();
    const [propertyType, setPropertyType] = useState([]);
    const [leadSource, setLeadSource] = useState([]);
    const [leadRequirement, setLeadRequirement] = useState([]);
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const isEditMode = false;

    const initialValues = {
        name: "",
        mobile: "",
        email: "",
        requirement: "",
        budgetMin: "",
        budgetMax: "",
        location: "",
        propertyType: "",
        followUpDate: "",
        source: "",
        notes: "",
    };

    useEffect(() => {
        const fetchDropDownData = async () => {
            try {
                setIsLoadingDropdowns(true);
                const propertyRes = await tableApi.dataTable({
                    table_name: "PropertyType",
                });
                const leadSourceRes = await tableApi.dataTable({
                    table_name: "LeadSource",
                });
                const leadRequirementRes = await tableApi.dataTable({
                    table_name: "LeadRequirement",
                });
                setPropertyType(propertyRes?.data || propertyRes || []);
                setLeadSource(leadSourceRes?.data || leadSourceRes || []);
                setLeadRequirement(leadRequirementRes?.data || leadRequirementRes || []);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                toast.error("Failed to load dropdown options", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });

                setPropertyType([
                    {
                        id: 4,
                        name: "Commercial",
                    },
                    {
                        id: 1,
                        name: "Flat",
                    },
                    {
                        id: 3,
                        name: "Plot",
                    },
                    {
                        id: 2,
                        name: "Villa",
                    },
                ]);

                setLeadSource([
                    {
                        id: 1,
                        name: "Ads",
                    },
                    {
                        id: 2,
                        name: "Referral",
                    },
                    {
                        id: 3,
                        name: "Site Visit",
                    },
                ]);
                setLeadRequirement([
                    {
                        id: 1,
                        name: "Buy",
                    },
                    {
                        id: 2,
                        name: "Rent",
                    },
                    {
                        id: 3,
                        name: "Sell",
                    },
                ]);
            } finally {
                setIsLoadingDropdowns(false);
            }
        };
        fetchDropDownData();
    }, []);

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const payload = {
                name: values.name,
                mobile: values.mobile,
                email: values.email,
                requirement: values.requirement,
                budget_min: values.budgetMin,
                budget_max: values.budgetMax,
                preferred_location: values.location,
                property_type: values.propertyType,
                follow_up_date: values.followUpDate,
                source: values.source,
                notes: values.notes,
                agent_email: values.agentEmail || "appu@example.com", // optional
                client_id: 1,
            };

            const res = await leadApi.createLead(payload);
            
            if (res?.message) {
                toast.success("Lead saved successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                resetForm();
                setTimeout(() => {
                  navigate("/dashboard/lead-list");
                }, 1000);
            }
        } catch (error) {
            console.error("Error saving lead:", error);
            toast.error("Failed to save lead. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
        } finally {
            setSubmitting(false); // Ends Formik submitting state
        }
    };

    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkmode-800 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />

            <div className="flex items-center mt-8 mb-8">
                <h2 className="intro-y text-lg font-medium mr-auto">New Lead Capture</h2>
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
                            Basic Information
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
                            Requirements
                        </div>
                    </div>
                </div>

                <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-slate-200/60 dark:border-darkmode-400">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={buildLeadValidationSchema(isEditMode)}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, isValid }) => (
                            <Form>
                                {/* Step 1: Basic Information */}
                                {currentStep === 1 && (
                                    <div>
                                        <div className="font-medium text-base">
                                            Basic Information
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

                                            {/* Lead Source */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="source" className="form-label">
                                                    <FiGlobe className="inline mr-2 text-primary" />
                                                    Lead Source
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="source"
                                                    disabled={isLoadingDropdowns}
                                                    className="form-select"
                                                >
                                                    <option value="">
                                                        {isLoadingDropdowns
                                                            ? "Loading..."
                                                            : "Select source"}
                                                    </option>
                                                    {leadSource.map((source) => (
                                                        <option
                                                            key={source?.id}
                                                            value={source?.name}
                                                        >
                                                            {source?.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="source"
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

                                {/* Step 2: Requirements */}
                                {currentStep === 2 && (
                                    <div>
                                        <div className="font-medium text-base">Requirements</div>
                                        <div className="grid grid-cols-12 gap-4 gap-y-5 mt-5">
                                            {/* Requirement */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="requirement" className="form-label">
                                                    <FiBriefcase className="inline mr-2 text-primary" />
                                                    Requirement
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="requirement"
                                                    className="form-select"
                                                >
                                                    <option value="">
                                                        {isLoadingDropdowns
                                                            ? "Loading..."
                                                            : "Select Lead Requirement"}
                                                    </option>
                                                    {leadRequirement.map((type) => (
                                                        <option key={type?.id} value={type?.name}>
                                                            {type?.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="requirement"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Property Type */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="propertyType"
                                                    className="form-label"
                                                >
                                                    <FiHome className="inline mr-2 text-primary" />
                                                    Property Type
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="propertyType"
                                                    className="form-select"
                                                >
                                                    <option value="">
                                                        {isLoadingDropdowns
                                                            ? "Loading..."
                                                            : "Select property type"}
                                                    </option>
                                                    {propertyType.map((type) => (
                                                        <option key={type?.id} value={type?.name}>
                                                            {type?.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage
                                                    name="propertyType"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Budget Min */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="budgetMin" className="form-label">
                                                    <FiDollarSign className="inline mr-2 text-primary" />
                                                    Minimum Budget (₹)
                                                </label>
                                                <div className="relative rounded-md">
                                                    <Field
                                                        type="number"
                                                        name="budgetMin"
                                                        className="form-control pl-8"
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-slate-500">₹</span>
                                                    </div>
                                                </div>
                                                <ErrorMessage
                                                    name="budgetMin"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Budget Max */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="budgetMax" className="form-label">
                                                    <FiDollarSign className="inline mr-2 text-primary" />
                                                    Maximum Budget (₹)
                                                </label>
                                                <div className="relative rounded-md">
                                                    <Field
                                                        type="number"
                                                        name="budgetMax"
                                                        className="form-control pl-8"
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-slate-500">₹</span>
                                                    </div>
                                                </div>
                                                <ErrorMessage
                                                    name="budgetMax"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Location */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label htmlFor="location" className="form-label">
                                                    <FiMapPin className="inline mr-2 text-primary" />
                                                    Preferred Location
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="location"
                                                    className="form-control"
                                                    placeholder="City, Area"
                                                />
                                                <ErrorMessage
                                                    name="location"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Follow-up Date */}
                                            <div className="intro-y col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="followUpDate"
                                                    className="form-label"
                                                >
                                                    <FiCalendar className="inline mr-2 text-primary" />
                                                    Follow-up Date
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="followUpDate"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="followUpDate"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
                                            </div>

                                            {/* Notes */}
                                            <div className="intro-y col-span-12">
                                                <label htmlFor="notes" className="form-label">
                                                    <FiFileText className="inline mr-2 text-primary" />
                                                    Additional Notes
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="notes"
                                                    rows={4}
                                                    className="form-control"
                                                    placeholder="Any notes about the lead..."
                                                />
                                                <ErrorMessage
                                                    name="notes"
                                                    component="div"
                                                    className="text-red-500 text-xs mt-1"
                                                />
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
                                                        Save Lead
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
};

export default Leads;
