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
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const payload = {
        property_id: id,
        client_id: 1,
      };

      const response = await propertyApi.deleteProperty(payload);

      console.log(response);
      if (response) {
        toast.success("Property deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });

        await fetchPage();
      }
    } catch (error) {
      if (error.toString().includes("FK__Invoice__propert__151B244E")) {
        toast.error("First settle the generated invoice then you can delete", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirmationModal(false);
    }
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
          <h2 className="intro-y text-lg font-medium mt-10">Property Inventory</h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 gap-5">
              {/* <button className="btn btn-primary shadow-md mr-2">
                Add New Product
              </button> */}
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

              {/* <Dropdown>
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
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                      to Excel
                    </DropdownItem>
                    <DropdownItem>
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                      to PDF
                    </DropdownItem>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
              <div className="hidden md:block mx-auto text-slate-500">
                Showing 1 to 10 of 150 entries
              </div> */}
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
                            We couldn’t find any results for your search. Try
                            different keywords or filters.
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
                          <td className="text-center">{p?.property_type}</td>
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
                                onClick={(e) => handleEdit(e, p?.property_id)}
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
          </div>
          {/* BEGIN: Delete Confirmation Modal -*/}
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
                  className="btn btn-outline-secondary w-24 mr-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(6)}
                  type="button"
                  className="btn btn-danger w-24 cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </ModalBody>
          </Modal>
          {/* END: Delete Confirmation Modal -*/}
        </>
      )}

      <ToastContainer />
    </div>
  );
}

export default Main;
