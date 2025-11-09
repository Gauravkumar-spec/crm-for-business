import { RefreshCcw } from "lucide-react"; // if using Lucide icons like in the dashboard
import AgentPerformance from "../graphs/AgentPerformance.jsx";
import ChartLeadFollowUp from "../graphs/ChartLeadFollowUp.jsx";
import LeadConverion from "../graphs/LeadConverion.jsx";

const Graphs = () => {
    return (
        <div className="col-span-12 2xl:col-span-9">
            <div className="grid grid-cols-12 gap-6">
                {/* ====== GRAPH 1: AgentPerformance ====== */}
                <div className="col-span-12 mt-8">
                    <div className="intro-y box p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Agent Performance Report</h2>
                        </div>

                        <AgentPerformance height={320} />
                    </div>
                </div>

                {/* ====== GRAPH 3: LeadConverion ====== */}
                <div className="col-span-12 mt-8">
                    <div className="intro-y box p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Lead Converion Report</h2>
                        </div>

                        <LeadConverion height={320} />
                    </div>
                </div>

                {/* ====== GRAPH 2: ChartLeadFollowUp ====== */}
                <div className="col-span-12 mt-8">
                    <div className="intro-y box p-6 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Lead FollowUp Report</h2>
                        </div>

                        <ChartLeadFollowUp height={320} />
                    </div>
                </div>

                {/* ====== BLANK SECTIONS FOR FUTURE GRAPHS ======
                <div className="col-span-12 mt-8">
                    <div className="intro-y box p-6 h-[300px] flex items-center justify-center text-slate-400">
                        + Add another graph here
                    </div>
                </div>

                <div className="col-span-12 mt-8">
                    <div className="intro-y box p-6 h-[300px] flex items-center justify-center text-slate-400">
                        + Add another graph here
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Graphs;
