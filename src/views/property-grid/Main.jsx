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
import { useState, useEffect } from "react";
import image1 from "../../assets/images/p-1.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { propertyApi } from "../../api/propertyApi";
import { setProperty } from "../../stores/slices/propertySlice";
import LoaderUI from "../../components/loading-ui/Main.jsx";
import ErrorUI from "../../components/error-ui/Main.jsx";

function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            fetchPage({ search: searchQuery });
        }
        // You can access other properties of the event object, like event.keyCode, event.code, etc.
    };

    // Fetch a specific page
    const fetchPage = async (data = {}) => {
        setLoading(true);
        setError(null);

        const payload = {
            filters: { status: null, location: null, type: null, agent_email: null },
            search: null,
            client_id: 1,
            title: null,
            location_search: null,
            last_property_id: null,
            limit: 20,
        };

        const OriginalPayload = { ...payload, ...data };
        console.log(`Original Payload data:-`, OriginalPayload);

        try {
            const result = await propertyApi.propertySearch(OriginalPayload);

            setProperties(result?.data);
            setSearchQuery("");
            dispatch(setProperty(result?.data));

            console.log(`Property fetch Successfully ✅`);
        } catch (err) {
            setError(err);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage();
    }, []);

    const handleEdit = (e, id) => {
        console.log("handle edit run....");
        e.preventDefault();
        navigate(`/dashboard/edit-property/${id}`);
    };
    const handlePreview = (e, id) => {
        console.log("handle preview run....");
        e.preventDefault();
        navigate(`/dashboard/product-preview/${id}`);
    };

    if (error) {
        return <ErrorUI handlerFunc={fetchPage} />;
    }

    return (
        <div>
            {loading ? (
                <LoaderUI message="Loading Property" />
            ) : (
                <>
                    <h2 className="intro-y text-lg font-medium mt-10">Product Grid</h2>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                            <button className="btn btn-primary shadow-md mr-2">
                                Add New Product
                            </button>
                            <Dropdown>
                                <DropdownToggle className="btn px-2 box">
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <Lucide icon="Plus" className="w-4 h-4" />
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu className="w-40">
                                    <DropdownContent>
                                        <DropdownItem>
                                            <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                                            Export to Excel
                                        </DropdownItem>
                                        <DropdownItem>
                                            <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                                            Export to PDF
                                        </DropdownItem>
                                    </DropdownContent>
                                </DropdownMenu>
                            </Dropdown>
                            <div className="hidden md:block mx-auto text-slate-500">
                                Showing 1 to 10 of 150 entries
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
                        {/* BEGIN: Users Layout */}
                        {properties.map((p) => (
                            <div
                                key={p?.property_id}
                                className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                            >
                                <div className="box">
                                    <div className="p-5">
                                        <div className="h-40 2xl:h-56 image-fit rounded-md overflow-hidden before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                            <img
                                                alt="Midone - HTML Admin Template"
                                                className="rounded-md"
                                                src={image1}
                                            />
                                            {/* {faker.trueFalse[0] && (
                                        <span className="absolute top-0 bg-pending/80 text-white text-xs m-5 px-2 py-1 rounded z-10">
                                            Featured
                                        </span>
                                    )} */}
                                            <div className="absolute bottom-0 text-white px-5 pb-6 z-10">
                                                <a href="" className="block font-medium text-base">
                                                    {p?.agent_name}
                                                </a>
                                                <span className="text-white/90 text-xs mt-3">
                                                    {p?.property_category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-500 mt-5">
                                            <div className="flex items-center">
                                                <Lucide icon="Link" className="w-4 h-4 mr-2" />{" "}
                                                Price: ${p?.price}
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <Lucide icon="Layers" className="w-4 h-4 mr-2" />{" "}
                                                <p className="flex items-center gap-2">
                                                    Property-Type:
                                                    <span>{p?.property_type}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-2"
                                                />{" "}
                                                <p className="flex items-center gap-2">
                                                    Availability:
                                                    <span>{p?.availability}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center lg:justify-end items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                        <p
                                            className="flex items-center text-primary mr-auto cursor-pointer"
                                            onClick={(e) => handlePreview(e, p?.property_id)}
                                        >
                                            <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                                        </p>

                                        <p
                                            onClick={(e) => handleEdit(e, p?.property_id)}
                                            className="flex items-center mr-3 cursor-pointer"
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                                            Edit
                                        </p>
                                        <a
                                            className="flex items-center text-danger"
                                            href="#"
                                            onClick={() => {
                                                setDeleteConfirmationModal(true);
                                            }}
                                        >
                                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* END: Users Layout */}
                        {/* BEGIN: Pagination */}
                        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                            <nav className="w-full sm:w-auto sm:mr-auto">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            ...
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            1
                                        </a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="#">
                                            2
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            3
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            ...
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">
                                            <Lucide icon="ChevronsRight" className="w-4 h-4" />
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <select className="w-20 form-select box mt-3 sm:mt-0">
                                <option>10</option>
                                <option>25</option>
                                <option>35</option>
                                <option>50</option>
                            </select>
                        </div>
                        {/* END: Pagination */}
                    </div>
                    {/* BEGIN: Delete Confirmation Modal */}
                    <Modal
                        show={deleteConfirmationModal}
                        onHidden={() => {
                            setDeleteConfirmationModal(false);
                        }}
                    >
                        <ModalBody className="p-0">
                            <div className="p-5 text-center">
                                <Lucide
                                    icon="XCircle"
                                    className="w-16 h-16 text-danger mx-auto mt-3"
                                />
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
                                <button type="button" className="btn btn-danger w-24">
                                    Delete
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>
                    {/* END: Delete Confirmation Modal */}
                </>
            )}
        </div>
    );
}

export default Main;
