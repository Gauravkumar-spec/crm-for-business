import {
    Lucide,
    Tippy,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Modal,
    ModalBody,
} from "@/base-components";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { propertyApi } from "../../api/propertyApi.js";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// temporary imports
import image1 from "../../assets/images/p-1.jpg";
import image2 from "../../assets/images/p-2.jpg";
import image3 from "../../assets/images/p-3.jpg";
import { setProperty } from "../../stores/slices/propertySlice.js";
import LoaderUI from "../../components/loading-ui/Main.jsx";
import ErrorUI from "../../components/error-ui/Main.jsx";
import { exportPropertiesToExcel } from "../../utils/exportToExcel.js";

function Main() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    // 🔁 Pagination (cursor based)
    const [lastPropertyId, setLastPropertyId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // 🗑 Delete
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [deletePropertyId, setDeletePropertyId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 🔍 Fetch properties
    const fetchPage = async (data = {}, isLoadMore = false) => {
        if (isLoadMore && isLoadingMore) return;
        if (!isLoadMore && loading) return;

        setError(null);
        isLoadMore ? setIsLoadingMore(true) : setLoading(true);

        const payload = {
            filters: { status: null, location: null, type: null, agent_email: null },
            search: null,
            client_id: 1,
            title: null,
            location_search: null,
            limit: 20,
            sort_by: "property_id",
            sort_order: "ASC",
            last_property_id: isLoadMore ? lastPropertyId : null,
            ...data,
        };

        try {
            const result = await propertyApi.propertySearch(payload);

            setProperties((prev) => (isLoadMore ? [...prev, ...result.data] : result.data));

            setLastPropertyId(result.next_last_property_id);
            setHasMore(result.has_more);

            dispatch(setProperty(result.data));
            setSearchQuery("");
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            isLoadMore ? setIsLoadingMore(false) : setLoading(false);
        }
    };

    useEffect(() => {
        setLastPropertyId(null);
        setHasMore(true);
        fetchPage({}, false);
    }, []);

    // 🔍 Search
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setLastPropertyId(null);
            setHasMore(true);
            fetchPage({ search: searchQuery.trim() || null }, false);
        }
    };

    const handleEdit = (e, id) => {
        e.preventDefault();
        navigate(`/dashboard/edit-property/${id}`);
    };

    // 🗑 Delete
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await propertyApi.deleteProperty({
                property_id: deletePropertyId,
                client_id: 1,
            });

            toast.success("Property deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });

            setDeleteConfirmationModal(false);
            setDeletePropertyId(null);

            setLastPropertyId(null);
            setHasMore(true);
            fetchPage({}, false);
        } catch (error) {
            if (error.toString().includes("FK__Invoice")) {
                toast.error("First settle the generated invoice then you can delete", {
                    position: "top-center",
                    theme: "dark",
                });
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (error && properties.length === 0) {
        return <ErrorUI handlerFunc={() => fetchPage({}, false)} />;
    }

    return (
        <div>
            {loading ? (
                <LoaderUI message="Loading Property" />
            ) : (
                <>
                    <h2 className="intro-y text-lg font-medium mt-10">Property Inventory</h2>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-5">
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => exportPropertiesToExcel(properties)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Export to Excel
                                </button>

                                <button
                                    onClick={() => navigate("/dashboard/upload-excel2")}
                                    className="btn btn-warning shadow-md ml-2"
                                >
                                    📂 Upload Excel
                                </button>
                            </div>

                            <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                                <div className="w-56 relative text-slate-500">
                                    <input
                                        type="text"
                                        className="form-control w-56 box pr-10"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Lucide
                                        icon="Search"
                                        className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* BEGIN: Data List -*/}
                        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                            <table className="table table-report -mt-2">
                                <thead>
                                    <tr>
                                        <th className="whitespace-nowrap">IMAGES</th>
                                        <th className="whitespace-nowrap">AGENT NAME</th>
                                        <th className="text-center whitespace-nowrap">
                                            PROPERTY TYPE
                                        </th>
                                        <th className="text-center whitespace-nowrap">PRICE</th>
                                        <th className="text-center whitespace-nowrap">STATUS</th>
                                        <th className="text-center whitespace-nowrap">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.length <= 0 ? (
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
                                                        We couldn’t find any results for your
                                                        search. Try different keywords or filters.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {properties.map((p) => (
                                                <tr key={p?.property_id} className="intro-x">
                                                    <td className="w-40">
                                                        <div className="flex">
                                                            <div className="w-10 h-10 image-fit zoom-in">
                                                                <Tippy
                                                                    tag="img"
                                                                    alt="Midone Tailwind HTML Admin Template"
                                                                    className="rounded-full"
                                                                    src={image1}
                                                                />
                                                            </div>
                                                            <div className="w-10 h-10 image-fit zoom-in -ml-5">
                                                                <Tippy
                                                                    tag="img"
                                                                    alt="Midone Tailwind HTML Admin Template"
                                                                    className="rounded-full"
                                                                    src={image2}
                                                                />
                                                            </div>
                                                            <div className="w-10 h-10 image-fit zoom-in -ml-5">
                                                                <Tippy
                                                                    tag="img"
                                                                    alt="Midone Tailwind HTML Admin Template"
                                                                    className="rounded-full"
                                                                    src={image3}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <a
                                                            href=""
                                                            className="font-medium whitespace-nowrap"
                                                        >
                                                            {p?.agent_name}
                                                        </a>
                                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                            {p?.property_category}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {p?.property_type}
                                                    </td>
                                                    <td className="text-center">${p?.price}</td>
                                                    <td className="w-40">
                                                        <div
                                                            className={classnames({
                                                                "flex items-center justify-center": true,
                                                            })}
                                                        >
                                                            <Lucide
                                                                icon="CheckSquare"
                                                                className="w-4 h-4 mr-2"
                                                            />

                                                            {p?.availability}
                                                        </div>
                                                    </td>
                                                    <td className="table-report__action w-56">
                                                        <div className="flex justify-center items-center">
                                                            <p
                                                                onClick={(e) =>
                                                                    handleEdit(e, p?.property_id)
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
                                                                    setDeleteConfirmationModal(
                                                                        true,
                                                                    );
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
                    </div>

                    {/* Delete Modal */}
                    {deletePropertyId && (
                        <Modal
                            show={deleteConfirmationModal}
                            onHidden={() => setDeleteConfirmationModal(false)}
                        >
                            <ModalBody className="p-6 text-center">
                                <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto" />
                                <h3 className="text-xl mt-4">Are you sure?</h3>
                                <div className="mt-6 flex justify-center gap-3">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setDeleteConfirmationModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDelete}>
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </ModalBody>
                        </Modal>
                    )}
                </>
            )}

            <ToastContainer />
        </div>
    );
}

export default Main;
