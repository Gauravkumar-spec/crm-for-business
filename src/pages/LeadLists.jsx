import { Lucide, Modal, ModalBody } from "@/base-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { leadApi } from "../api/leadApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingUi from "../components/loading-ui/Main.jsx";
import ErrorUI from "../components/error-ui/Main.jsx";
import { exportLeadsToExcel } from "../utils/excelExport";

function Main() {
    const navigate = useNavigate();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    // Pagination (cursor-based)
    const [lastLeadId, setLastLeadId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Delete modal
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [deleteLeadId, setDeleteLeadId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // 🔍 Fetch leads
    const fetchLead = async (data = {}, isLoadMore = false) => {
        if (isLoadMore && isLoadingMore) return;
        if (!isLoadMore && loading) return;

        setError(null);
        isLoadMore ? setIsLoadingMore(true) : setLoading(true);

        const payload = {
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
            last_lead_id: isLoadMore ? lastLeadId : null,
            ...data,
        };

        try {
            const response = await leadApi.leadSearch(payload);

            setLeads((prev) => (isLoadMore ? [...prev, ...response.data] : response.data));

            setLastLeadId(response.next_last_lead_id);
            setHasMore(response.has_more);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch leads, try again");
        } finally {
            isLoadMore ? setIsLoadingMore(false) : setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        setLastLeadId(null);
        setHasMore(true);
        fetchLead({}, false);
    }, []);

    // 🔍 Search
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setLastLeadId(null);
            setHasMore(true);
            fetchLead({ search: searchQuery.trim() || null }, false);
            setSearchQuery("");
        }
    };

    // ✏️ Edit
    const handleEdit = (e, id) => {
        e.preventDefault();
        navigate(`/dashboard/edit-lead/${id}`);
    };

    // 🗑 Delete
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await leadApi.deleteLead({
                lead_id: deleteLeadId,
                client_id: 1,
            });

            toast.success("Lead deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });

            setDeleteConfirmationModal(false);
            setDeleteLeadId(null);

            setLastLeadId(null);
            setHasMore(true);
            fetchLead({}, false);
        } catch (err) {
            toast.error("Failed to delete lead", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    if (error && leads.length === 0) {
        return <ErrorUI handlerFunc={() => fetchLead({}, false)} />;
    }

    if (loading && leads.length === 0) {
        return <LoadingUi message="Loading Leads" />;
    }

    return (
        <>
            <h2 className="intro-y text-lg font-medium mt-10">Lead Inventory</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap justify-end xl:flex-nowrap items-center mt-2">
                    <div className="w-full flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between mt-3 xl:mt-0">
                        {/* 🔍 Search */}
                        <div className="w-full xl:w-auto">
                            <div className="relative text-slate-500">
                                <input
                                    onKeyDown={handleKeyDown}
                                    type="text"
                                    className="form-control w-full xl:w-56 box pr-10"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Lucide
                                    icon="Search"
                                    className="w-4 h-4 absolute my-auto inset-y-0 right-3"
                                />
                            </div>
                        </div>

                        {/* 📊 Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                            <button
                                onClick={() => exportLeadsToExcel(leads)}
                                className="btn btn-success w-full sm:w-auto"
                            >
                                📊 Export Leads
                            </button>

                            <button
                                onClick={() => navigate("/dashboard/upload-excel")}
                                className="btn btn-warning shadow-md w-full sm:w-auto"
                            >
                                📂 Upload Excel
                            </button>
                        </div>
                    </div>
                </div>
                {/* BEGIN: Data List */}
                <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead>
                            <tr>
                                <th className="whitespace-nowrap">
                                    <input className="form-check-input" type="checkbox" />
                                </th>
                                <th className="whitespace-nowrap">SELLER</th>
                                <th className="text-center whitespace-nowrap">MOBILE</th>
                                <th className="text-center whitespace-nowrap">SOURCE</th>
                                <th className="text-center whitespace-nowrap">STATUS</th>
                                <th className="text-center whitespace-nowrap">BUDGET-(MAX)</th>
                                <th className="text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length <= 0 ? (
                                <div className="w-[70vw] flex justify-center items-center">
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-16 h-16 mb-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z"
                                                />
                                            </svg>
                                            <h2 className="text-xl font-semibold text-gray-700 mb-1">
                                                Nothing Found
                                            </h2>
                                            <p className="text-sm text-gray-500 max-w-sm">
                                                We couldn’t find any results for your search. Try
                                                different keywords or filters.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {leads.map((lead) => (
                                        <tr key={lead?.lead_id} className="intro-x">
                                            <td className="w-10">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                />
                                            </td>
                                            <td className="!py-3.5">
                                                <div className="flex items-center">
                                                    
                                                    <div className="ml-4">
                                                        <a
                                                            href=""
                                                            className="font-medium whitespace-nowrap"
                                                        >
                                                            {lead?.name}
                                                        </a>
                                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                            {lead?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">{lead?.mobile}</td>
                                            <td className="text-center capitalize">
                                                {lead?.source}
                                            </td>
                                            <td className="w-40 text-center">{lead?.status}</td>
                                            <td className="text-center">Rs. {lead?.budget_max}</td>
                                            <td className="table-report__action w-56">
                                                <div className="flex justify-center items-center">
                                                    <p
                                                        onClick={(e) =>
                                                            handleEdit(e, lead?.lead_id)
                                                        }
                                                        className="flex items-center mr-3 cursor-pointer"
                                                    >
                                                        <Lucide
                                                            icon="CheckSquare"
                                                            className="w-4 h-4 mr-1"
                                                        />{" "}
                                                        Edit
                                                    </p>
                                                    <p
                                                        className="flex items-center text-danger cursor-pointer"
                                                        onClick={() => {
                                                            setDeleteLeadId(lead?.lead_id);
                                                            setDeleteConfirmationModal(true);
                                                        }}
                                                    >
                                                        <Lucide
                                                            icon="Trash2"
                                                            className="w-4 h-4 mr-1"
                                                        />{" "}
                                                        Delete
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* END: Data List */}

                {/* Load More */}
                {hasMore && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => fetchLead({}, true)}
                            disabled={isLoadingMore}
                            className="btn btn-outline-primary"
                        >
                            {isLoadingMore ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
            </div>
            {/* BEGIN: Delete Confirmation Modal */}

            {/* Delete Modal */}
            {deleteLeadId && (
                <Modal
                    show={deleteConfirmationModal}
                    onHidden={() => setDeleteConfirmationModal(false)}
                >
                    <ModalBody className="p-0">
                        <div className="p-5 text-center">
                            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
                            <div className="text-2xl mt-5">Are you sure?</div>
                            <p className="text-gray-500 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-center gap-3 pb-6">
                            <button
                                onClick={() => setDeleteConfirmationModal(false)}
                                className="btn btn-outline-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger">
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {/* END: Delete Confirmation Modal */}

            <ToastContainer />
        </>
    );
}

export default Main;
