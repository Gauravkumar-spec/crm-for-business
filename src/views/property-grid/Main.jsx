import { Lucide, Modal, ModalBody } from "@/base-components";
import { useState, useEffect } from "react";
import image1 from "../../assets/images/p-1.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../../api/propertyApi";
import { setProperty } from "../../stores/slices/propertySlice";
import LoaderUI from "../../components/loading-ui/Main.jsx";
import ErrorUI from "../../components/error-ui/Main.jsx";

function Main() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    // 🔁 Pagination
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
            last_property_id: isLoadMore ? lastPropertyId : null,
            ...data,
        };

        try {
            const result = await propertyApi.propertySearch(payload);

            setProperties((prev) => (isLoadMore ? [...prev, ...result.data] : result.data));

            setLastPropertyId(result.next_last_property_id);
            setHasMore(result.has_more);

            dispatch(setProperty(result.data));
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            isLoadMore ? setIsLoadingMore(false) : setLoading(false);
        }
    };

    // Initial load
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

    const handlePreview = (e, id) => {
        e.preventDefault();
        navigate(`/dashboard/product-preview/${id}`);
    };

    // 🗑 Delete
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await propertyApi.deleteProperty({
                property_id: deletePropertyId,
                client_id: 1,
            });

            setDeleteConfirmationModal(false);
            setDeletePropertyId(null);

            setLastPropertyId(null);
            setHasMore(true);
            fetchPage({}, false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (error && properties.length === 0) {
        return <ErrorUI handlerFunc={() => fetchPage({}, false)} />;
    }

    return (
        <div>
            {loading && properties.length === 0 ? (
                <LoaderUI message="Loading Property" />
            ) : (
                <>
                    <h2 className="intro-y text-lg font-medium mt-10">Property Inventory</h2>

                    {/* Search */}
                    <div className="w-56 relative text-slate-500 mt-5 ml-auto">
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

                    {/* Grid */}
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        {properties.length === 0 ? (
                            <div className="col-span-12 text-center py-16 text-gray-500">
                                Nothing Found
                            </div>
                        ) : (
                            properties.map((p) => (
                                <div
                                    key={p.property_id}
                                    className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                                >
                                    <div className="box">
                                        <div className="p-5">
                                            <div className="h-40 image-fit rounded-md overflow-hidden relative">
                                                <img
                                                    src={image1}
                                                    className="rounded-md"
                                                    alt="property"
                                                />
                                                <div className="absolute bottom-0 text-white px-5 pb-4">
                                                    <p className="font-medium">{p.agent_name}</p>
                                                    <span className="text-xs">
                                                        {p.property_category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-sm text-slate-600">
                                                <p>💰 Price: ${p.price}</p>
                                                <p>🏠 Type: {p.property_type}</p>
                                                <p>✅ {p.availability}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center p-5 border-t">
                                            <button
                                                onClick={(e) => handlePreview(e, p.property_id)}
                                                className="text-primary flex items-center"
                                            >
                                                <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                                                Preview
                                            </button>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => handleEdit(e, p.property_id)}
                                                >
                                                    <Lucide icon="CheckSquare" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeletePropertyId(p.property_id);
                                                        setDeleteConfirmationModal(true);
                                                    }}
                                                    className="text-danger"
                                                >
                                                    <Lucide icon="Trash2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                disabled={isLoadingMore}
                                onClick={() => fetchPage({}, true)}
                                className="btn btn-outline-primary"
                            >
                                {isLoadingMore ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}

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
        </div>
    );
}

export default Main;
