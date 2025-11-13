import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lucide, Modal, ModalBody } from "@/base-components";
import { leadApi } from "../api/leadApi.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { buildLeadValidationSchema } from "../utils/validationSchemas/leadSchema.js";
import { FiBriefcase, FiCalendar, FiFileText, FiGlobe, FiHome } from "react-icons/fi";
import { tableApi } from "../api/tableApi.js";
import ErrorUI from "../components/error-ui/Main.jsx";
import LoadingUI from "../components/loading-ui/Main.jsx";

function EditLead() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [error, setError] = useState(null);

    const [leadSource, setLeadSource] = useState([]);
    const [propertyType, setPropertyType] = useState([]);
    const [leadRequirement, setLeadRequirement] = useState([]);
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

    const navigate = useNavigate();

    console.log("Lead ID: ", id);
    const isEditMode = !!lead?.lead_id;
    console.log(isEditMode);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                lead_id: lead?.lead_id,
                client_id: 1,
                name: values.name,
                mobile: values.mobile,
                email: values.email,
                requirement: values.requirement,
                budget_min: values.budgetMin,
                budget_max: values.budgetMax,
                preferred_location: values.location,
                property_type: values.propertyType,
                follow_up_date: values.followUpDate,
                notes: values.notes,
                status: values.status,
                agent_email: values.assigned_agent,
            };

            const res = await leadApi.updateLead(payload);
            console.log("Form submit: ", res);
            if (res) {
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
            console.log("Failed to update lead", error);
            toast.error("Failed to save lead. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const fetchLeadById = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await leadApi.leadPreview({
                lead_id: id,
                client_id: 1,
            });

            if (response) {
                console.log("Lead data fetched for edit: ", response);
                setLead(response.data);
            }
        } catch (error) {
            setError(error);
            console.log("failed to fetch lead", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadById();
    }, []);

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

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const year = String(date.getFullYear()).padStart(4, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months 0-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    if (isLoading) {
        return <LoadingUI message="Loading Lead..." />;
    }

    if (error) {
        return <ErrorUI handlerFunc={fetchLeadById} />;
    }

    return (
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto text-white">Edit Lead</h2>
                <Link to="/dashboard/seller-list" className="btn btn-outline-secondary">
                    <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2 text-gray-200" /> Back to Leads
                </Link>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-8 2xl:col-span-9">
                    {/* BEGIN: Lead Information */}
                    <div className="intro-y box p-5">
                        <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                            <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                <Lucide icon="Edit3" className="w-4 h-4 mr-2" />
                                Lead Information
                            </div>

                            {isEditMode && !lead ? (
                                <div>
                                    <h2>Loading</h2>
                                </div>
                            ) : (
                                <>
                                    <Formik
                                        initialValues={{
                                            name: lead?.name || "",
                                            email: lead?.email || "",
                                            mobile: lead?.mobile || "",
                                            source: lead?.source || "",
                                            requirement: lead?.requirement || "",
                                            followUpDate:
                                                formatDateForInput(lead?.follow_up_date) || "",
                                            budgetMin: lead?.budget_min || "",
                                            budgetMax: lead?.budget_max || "",
                                            location: lead?.preferred_location || "",
                                            propertyType: lead?.property_type || "",
                                            status: lead?.status || "",
                                            assigned_agent: lead?.assigned_agents?.[0] || "",
                                            notes: lead?.notes || "",
                                        }}
                                        validationSchema={buildLeadValidationSchema(isEditMode)}
                                        onSubmit={handleSubmit}
                                        enableReinitialize
                                    >
                                        {({ isSubmitting }) => (
                                            <Form className="mt-5">
                                                <div className="grid grid-cols-12 gap-4">
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="name"
                                                            className="form-label"
                                                        >
                                                            Name
                                                        </label>
                                                        <Field
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Lead Name"
                                                        />
                                                        <ErrorMessage
                                                            name="name"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="email"
                                                            className="form-label"
                                                        >
                                                            Email
                                                        </label>
                                                        <Field
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Email Address"
                                                        />
                                                        <ErrorMessage
                                                            name="email"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="mobile"
                                                            className="form-label"
                                                        >
                                                            Mobile
                                                        </label>
                                                        <Field
                                                            id="mobile"
                                                            name="mobile"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Mobile Number"
                                                        />
                                                        <ErrorMessage
                                                            name="mobile"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="source"
                                                            className="form-label"
                                                        >
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

                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="requirement"
                                                            className="form-label"
                                                        >
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
                                                                <option
                                                                    key={type?.id}
                                                                    value={type?.name}
                                                                >
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

                                                    <div className="col-span-12 sm:col-span-6">
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
                                                </div>

                                                {/* Property Preferences */}
                                                <div className="grid grid-cols-12 gap-4 mt-5">
                                                    <div className="col-span-12">
                                                        <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                                            <Lucide
                                                                icon="Home"
                                                                className="w-4 h-4 mr-2"
                                                            />
                                                            Property Preferences
                                                        </div>
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="budgetMin"
                                                            className="form-label"
                                                        >
                                                            Budget Minimum
                                                        </label>
                                                        <Field
                                                            id="budgetMin"
                                                            name="budgetMin"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Minimum Budget"
                                                        />
                                                        <ErrorMessage
                                                            name="budgetMin"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="budgetMax"
                                                            className="form-label"
                                                        >
                                                            Budget Maximum
                                                        </label>
                                                        <Field
                                                            id="budgetMax"
                                                            name="budgetMax"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Maximum Budget"
                                                        />
                                                        <ErrorMessage
                                                            name="budgetMax"
                                                            component="div"
                                                            className="text-red-500 text-xs mt-1"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="location"
                                                            className="form-label"
                                                        >
                                                            Preferred Location
                                                        </label>
                                                        <Field
                                                            id="location"
                                                            name="location"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Preferred Location"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-6">
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
                                                                <option
                                                                    key={type?.id}
                                                                    value={type?.name}
                                                                >
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
                                                </div>

                                                {/* Assignment & Status */}
                                                <div className="grid grid-cols-12 gap-4 mt-5">
                                                    <div className="col-span-12">
                                                        <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                                                            <Lucide
                                                                icon="User"
                                                                className="w-4 h-4 mr-2"
                                                            />
                                                            Assignment & Status
                                                        </div>
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="status"
                                                            className="form-label"
                                                        >
                                                            Status
                                                        </label>
                                                        <Field
                                                            id="status"
                                                            name="status"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Lead Status"
                                                        />
                                                    </div>
                                                    {/* Here I am take care of only one assigned agent, if there is multiple i have to think how to show on UI. */}
                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="assigned_agent"
                                                            className="form-label"
                                                        >
                                                            Assigned Agent
                                                        </label>
                                                        <Field
                                                            id="assigned_agent"
                                                            name="assigned_agent"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Assigned Agent"
                                                        />
                                                    </div>

                                                    <div className="col-span-12 sm:col-span-6">
                                                        <label
                                                            htmlFor="notes"
                                                            className="form-label"
                                                        >
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

                                                {/* Buttons */}
                                                <div className="flex justify-end mt-8">
                                                    <Link
                                                        to="/dashboard/lead-list"
                                                        className="btn btn-outline-secondary w-24 mr-2"
                                                    >
                                                        Cancel
                                                    </Link>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary w-24"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Updating..." : "Update"}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            )}
                        </div>
                    </div>
                    {/* END: Lead Information */}
                </div>

                {/* BEGIN: Lead Summary */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="intro-y box p-5">
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                <Lucide icon="User" className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <div className="font-medium text-base">{lead?.name}</div>
                                <div className="text-slate-500">Lead ID: {lead?.lead_id}</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Lucide icon="Phone" className="w-4 h-4 text-slate-500 mr-2" />
                                <div>{lead?.mobile || "Not provided"}</div>
                            </div>
                            <div className="flex items-center">
                                <Lucide icon="Mail" className="w-4 h-4 text-slate-500 mr-2" />
                                <div>{lead?.email || "Not provided"}</div>
                            </div>
                            <div className="flex items-center">
                                <Lucide icon="Home" className="w-4 h-4 text-slate-500 mr-2" />
                                <div className="capitalize">
                                    {lead?.property_type || "Not specified"}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Lucide icon="MapPin" className="w-4 h-4 text-slate-500 mr-2" />
                                <div>{lead?.preferred_location || "Not specified"}</div>
                            </div>
                            <div className="flex items-center">
                                <Lucide icon="DollarSign" className="w-4 h-4 text-slate-500 mr-2" />
                                <div>
                                    Rs. {lead?.budget_min} - Rs. {lead?.budget_max}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Lucide icon="Star" className="w-4 h-4 text-slate-500 mr-2" />
                                <div className="capitalize">{lead?.status || "Not set"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* END: Lead Summary */}
            </div>

            {/* BEGIN: Save Confirmation Modal */}
            <Modal
                show={saveModal}
                onHidden={() => {
                    setSaveModal(false);
                }}
            >
                <ModalBody className="p-0">
                    <div className="p-5 text-center">
                        <Lucide
                            icon="CheckCircle"
                            className="w-16 h-16 text-success mx-auto mt-3"
                        />
                        <div className="text-3xl mt-5">Are you sure?</div>
                        <div className="text-slate-500 mt-2">
                            Do you want to save these changes?
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setSaveModal(false);
                            }}
                            className="btn btn-outline-secondary w-24 mr-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary w-24"
                            onClick={() => {
                                // Handle save logic here
                                setSaveModal(false);
                            }}
                        >
                            Save
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            {/* END: Save Confirmation Modal */}
        </>
    );
}

export default EditLead;
