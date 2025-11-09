import { useEffect, useState } from "react";
import { dashboardApi } from "../../../api/dashboardApi.js";
import leadImage from "../../../assets/images/profile-12.jpg";
import "./index.css";
import { PulseLoader } from "react-spinners";

const TopAgent = () => {
    const [topAgent, setTopAgent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTopAgent = async () => {
        try {
            setLoading(true);

            const payload = {
                client_id: 1,
            };

            const response = await dashboardApi.getTopAgent(payload);

            if (response) {
                setTopAgent(response?.top_agents);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopAgent();
    }, []);

    return (
        <div className="col-span-12 xl:col-span-4 mt-6">
            <div className="intro-y flex items-center h-10">
                <h2 className="text-lg font-semibold truncate mr-5">Top Agents</h2>
            </div>
            {error ? (
                <h4 className="text-slate-400 text-lg font-medium text-center">404 Not Found</h4>
            ) : (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <PulseLoader color="#270038" size={7} />
                        </div>
                    ) : (
                        <div className="mt-5 hide-scroller overflow-y-scroll h-[390px]">
                            {topAgent &&
                                topAgent.map((agent) => (
                                    <div key={agent?.agent_id} className="intro-y">
                                        <div className="box px-4 py-4 mb-3 flex items-center zoom-in">
                                            <div className="w-10 h-10 flex-none image-fit rounded-md overflow-hidden">
                                                <img
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    src={leadImage}
                                                />
                                            </div>
                                            <div className="ml-4 mr-auto">
                                                <div className="font-medium">
                                                    {agent?.agent_name}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-0.5 flex gap-2">
                                                    <p>Closed Leads</p>
                                                    {agent?.closed_leads}
                                                </div>
                                            </div>
                                            <div className="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium">
                                                ₹ {agent?.total_revenue}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TopAgent;
