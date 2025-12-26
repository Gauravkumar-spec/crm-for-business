import { Lucide, Tippy } from "@/base-components";
import { useEffect, useState } from "react";
import { leadApi } from "../../../api/leadApi.js";
import { PulseLoader } from "react-spinners";

// temporary imports
import image1 from "../../../assets/images/p-1.jpg";
import image2 from "../../../assets/images/p-2.jpg";
import image3 from "../../../assets/images/p-3.jpg";
import { useNavigate } from "react-router-dom";

const TopLeads = () => {

    const [topLead, setTopLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchTopLead = async () => {
        setLoading(true);
        try {
            const payload = {
                search: "",
                client_id: 1,
                lead_id: null,
                name: "First lead",
                mobile: null,
                email: null,
                budget_min: null,
                budget_max: null,
                preferred_location: null,
                property_type: null,
                status: null,
                assigned_agent: null,
                source: null,
                last_lead_id: null,
                limit: 5,
                sort_by: "created_at",
                sort_order: "ASC",
            };

            const response = await leadApi.leadSearch(payload);

            if (response) {
                setTopLead(response);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopLead();
    }, []);

    return (
        <div className="col-span-12 mt-6">
            <div className="intro-y block sm:flex items-center h-10">
                <h2 className="text-lg font-semibold truncate mr-5">Top Leads</h2>
                <div className="flex items-center sm:ml-auto mt-3 sm:mt-0">
                    <button className="btn box flex items-center text-slate-600 dark:text-slate-300">
                        <Lucide icon="FileText" className="hidden sm:block w-4 h-4 mr-2" />
                        Export to Excel
                    </button>
                    <button className="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300">
                        <Lucide icon="FileText" className="hidden sm:block w-4 h-4 mr-2" />
                        Export to PDF
                    </button>
                </div>
            </div>
            <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                <table className="table table-report sm:mt-2">
                    <thead>
                        <tr>
                            <th className="whitespace-nowrap">IMAGES</th>
                            <th className="whitespace-nowrap">LEAD NAME</th>
                            <th className="text-center whitespace-nowrap">REQUIREMENT</th>
                            <th className="text-center whitespace-nowrap">STATUS</th>
                            <th className="text-center whitespace-nowrap">ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {error ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center text-slate-400 text-lg font-medium"
                                >
                                    404 Not Found
                                </td>
                            </tr>
                        ) : loading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <PulseLoader color="#270038" size={7} />
                                </td>
                            </tr>
                        ) : (
                            topLead &&
                            topLead.data.map((lead) => (
                                <tr key={lead?.lead_id} className="intro-x">
                                    <td className="w-40">
                                        <div className="flex">
                                            {[image1, image2, image3].map((img, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-10 h-10 image-fit zoom-in ${
                                                        i > 0 ? "-ml-5" : ""
                                                    }`}
                                                >
                                                    <Tippy
                                                        tag="img"
                                                        alt="Midone Tailwind HTML Admin Template"
                                                        className="rounded-full"
                                                        src={img}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <h4 className="font-medium whitespace-nowrap">
                                            {lead?.name}
                                        </h4>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {lead?.email}
                                        </div>
                                    </td>
                                    <td className="text-center">{lead?.requirement}</td>
                                    <td className="w-40 text-center">{lead?.status}</td>
                                    <td className="table-report__action w-56">
                                        <div className="flex justify-center items-center">
                                            <p
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/lead-preview/${lead?.lead_id}`
                                                    )
                                                }
                                                className="flex items-center mr-3 cursor-pointer"
                                            >
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Preview
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* <div className="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
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
            </div> */}
        </div>
    );
};

export default TopLeads;
