import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalBody,
} from "@/base-components";
import { useEffect, useState } from "react";
import { useLeadSearchMutation } from "../../services/leadApi";
import leadImage from "../../assets/images/profile-12.jpg";

import { faker as $f } from "../../pages/PropertyList";
import { useNavigate } from "react-router-dom";
import ErrorUI from "../../components/error-ui/Main.jsx";
import LoaderUI from "../../components/loading-ui/Main.jsx";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { leadApi } from "../../api/leadApi.js";
import { usePermission } from "../../context/PermissionContext";
import { useAuth } from "../../context/AuthContext";

function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [leadSearch] = useLeadSearchMutation();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteLeadId, setDeleteLeadId] = useState(null);

    const [lastLeadId, setLastLeadId] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const { role } = usePermission();
    const { session } = useAuth();

    const agentEmail = session?.account?.idTokenClaims?.emails?.[0];

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            fetchLead({ search: searchQuery });
        }
        // You can access other properties of the event object, like event.keyCode, event.code, etc.
    };

    const fetchLead = async (data = {}, isLoadMore = false) => {
        setError(null);

        if (role?.toLowerCase() === "agent" && !agentEmail) {
            setError("Agent identity not found");
            return;
        }

        // 🚫 Prevent duplicate calls
        if (isLoadMore && isLoadingMore) return;
        if (!isLoadMore && loading) return;

        isLoadMore ? setIsLoadingMore(true) : setLoading(true);

        const basePayload = {
            search: null,
            client_id: 1,
            lead_id: null,
            name: null,
            mobile: null,
            email: null,
            budget_min: null,
            budget_max: null,
            preferred_location: null,
            property_type: null,
            status: null,
            source: null,
            limit: 15,
            sort_by: "created_at",
            sort_order: "DESC",
        };

        const OriginalPayload = {
            ...basePayload,
            ...data,
            last_lead_id: isLoadMore ? lastLeadId : null,

            // 🔐 LOCKED role logic
            assigned_agent: role?.toLowerCase() === "agent" ? agentEmail : null,
        };

        try {
            const response = await leadSearch(OriginalPayload).unwrap();

            setLeads((prev) => (isLoadMore ? [...prev, ...response.data] : response.data));

            setLastLeadId(response.next_last_lead_id);
            setHasMore(response.has_more);
        } catch (error) {
            setError(error?.data?.message || "Failed to fetch leads, try again");
        } finally {
            isLoadMore ? setIsLoadingMore(false) : setLoading(false);
        }
    };

    useEffect(() => {
        if (!role) return;
        if (role?.toLowerCase() === "agent" && !agentEmail) return;

        setLastLeadId(null);
        setHasMore(true);
        fetchLead({}, false);
    }, [role, agentEmail]);

    const handleEdit = (e, id) => {
        e.preventDefault();
        navigate(`/dashboard/edit-lead/${id}`);
    };

    // Temp. fix
    const handleDelete = async (e) => {
        e.preventDefault();
        setDeleteLoading(true);

        try {
            const response = await leadApi.deleteLead({
                lead_id: deleteLeadId,
                client_id: 1,
            });

            if (response) {
                toast.success("Lead deleted successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });

                setLastLeadId(null);
                setHasMore(true);
                await fetchLead({}, false);
                setDeleteConfirmationModal(false);
            }
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            setDeleteConfirmationModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (error && leads.length === 0) {
        return <ErrorUI handlerFunc={fetchLead} />;
    }

    if (loading) {
        return <LoaderUI message="Loading Leads" />;
    }

    return (
        <>
            <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Lead Inventory</h2>
            </div>
            {/* BEGIN: Seller Details */}
            <div className="intro-y grid grid-cols-12 gap-5 mt-5">
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box p-5 rounded-md">
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                            <div className="font-medium text-base truncate">User Details</div>
                            <a href="" className="flex items-center ml-auto text-primary">
                                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> More Details
                            </a>
                        </div>
                        <div className="flex items-center">
                            <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                            Unique ID:
                            <a href="" className="underline decoration-dotted ml-1">
                                SLR-20220217-2053411933
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="User" className="w-4 h-4 text-slate-500 mr-2" /> Name:
                            <a href="" className="underline decoration-dotted ml-1">
                                {$f()[0].users[0].name}
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                            Phone Number: +71828273732
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="MapPin" className="w-4 h-4 text-slate-500 mr-2" />
                            Address: 260 W. Storm Street New York, NY 10025.
                        </div>
                        <div className="flex items-center border-t border-slate-200/60 dark:border-darkmode-400 pt-5 mt-5 font-medium">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-full py-1 px-2"
                            >
                                Message User
                            </button>
                        </div>
                    </div>
                    <div className="box p-5 rounded-md mt-5">
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                            <div className="font-medium text-base truncate">Store Details</div>
                            <a href="" className="flex items-center ml-auto text-primary">
                                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> More Details
                            </a>
                        </div>
                        <div className="flex items-center">
                            <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                            Unique ID:
                            <a href="" className="underline decoration-dotted ml-1">
                                STR-2053411933-20220217
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="ShoppingBag" className="w-4 h-4 text-slate-500 mr-2" />
                            Name:
                            <a href="" className="underline decoration-dotted ml-1">
                                Themeforest
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                            Phone Number: +71828273732
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="MapPin" className="w-4 h-4 text-slate-500 mr-2" />
                            Address: 260 W. Storm Street New York, NY 10025.
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                            Status:
                            <span className="bg-success/20 text-success rounded px-2 ml-1">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center border-t border-slate-200/60 dark:border-darkmode-400 pt-5 mt-5 font-medium">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-full py-1 px-2"
                            >
                                Change Status
                            </button>
                        </div>
                    </div>
                    <div className="box p-5 rounded-md mt-5">
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                            <div className="font-medium text-base truncate">
                                Transaction Reports
                            </div>
                            <a href="" className="flex items-center ml-auto text-primary">
                                <Lucide icon="Edit" className="w-4 h-4 mr-2" /> More Details
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                            Avg. Daily Transactions:
                            <div className="ml-auto">$1,500.00</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                            Avg. Monthly Transactions:
                            <div className="ml-auto">$42,500.00</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                            Avg. Annually Transactions:
                            <div className="ml-auto">$1,012,500.00</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Star" className="w-4 h-4 text-slate-500 mr-2" /> Average
                            Rating:
                            <div className="ml-auto">4.9+</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Album" className="w-4 h-4 text-slate-500 mr-2" /> Total
                            Products:
                            <div className="ml-auto">7,120</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Archive" className="w-4 h-4 text-slate-500 mr-2" />
                            Total Transactions:
                            <div className="ml-auto">1.512.001</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide icon="Monitor" className="w-4 h-4 text-slate-500 mr-2" />
                            Active Disputes:
                            <div className="ml-auto">1</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                    <div className="grid grid-cols-12 gap-5">
                        {leads.map((lead) => (
                            <div
                                key={lead?.lead_id}
                                className="intro-y col-span-12 sm:col-span-6 2xl:col-span-4"
                            >
                                <div className="box">
                                    <div className="p-5">
                                        <div className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                            <img
                                                alt="Midone - HTML Admin Template"
                                                className="rounded-md"
                                                src={leadImage}
                                            />

                                            {lead?.status && (
                                                <span className="absolute top-0 bg-blue-600 text-white text-xs m-5 px-2 py-1 rounded z-10">
                                                    {lead?.status}
                                                </span>
                                            )}

                                            <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                                                <a href="" className="block font-medium text-base">
                                                    {lead?.name}
                                                </a>
                                                <span className="text-white/90 text-xs mt-3">
                                                    {lead?.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-500 mt-5">
                                            <div className="flex items-center">
                                                <Lucide icon="Link" className="w-4 h-4 mr-2" />{" "}
                                                Budget-(max): ${lead?.budget_max}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <Lucide icon="Layers" className="w-4 h-4 mr-2" />{" "}
                                                Mobile:
                                                {lead?.mobile}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                Status: {lead?.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                        <p
                                            className="flex items-center text-primary mr-auto cursor-pointer"
                                            onClick={() =>
                                                navigate(`/dashboard/lead-preview/${lead?.lead_id}`)
                                            }
                                        >
                                            <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                                        </p>
                                        <p
                                            onClick={(e) => handleEdit(e, lead?.lead_id)}
                                            className="flex items-center mr-3 cursor-pointer"
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                                            Edit
                                        </p>
                                        <p
                                            className="flex items-center text-danger cursor-pointer"
                                            onClick={() => {
                                                setDeleteLeadId(lead?.lead_id);
                                                setDeleteConfirmationModal(true);
                                            }}
                                        >
                                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-6">
                            <button
                                disabled={isLoadingMore}
                                onClick={() => fetchLead({}, true)}
                                className="btn btn-outline-primary px-6"
                            >
                                {isLoadingMore ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* END: Seller Details */}
            {/* BEGIN: Delete Confirmation Modal */}
            <Modal
                show={deleteConfirmationModal}
                onHidden={() => {
                    setDeleteConfirmationModal(false);
                }}
            >
                <ModalBody className="p-0">
                    <div className="p-5 text-center">
                        <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
                        <div className="text-3xl mt-5">Are you sure?</div>
                        <div className="text-slate-500 mt-2">
                            Do you really want to delete these records? <br />
                            This process cannot be undone.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationModal(false);
                            }}
                            className="btn btn-outline-secondary w-24 mr-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => handleDelete(e)}
                            type="button"
                            className="btn btn-danger w-24"
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </ModalBody>
            </Modal>
            {/* END: Delete Confirmation Modal */}

            <ToastContainer />
        </>
    );
}

export default Main;
