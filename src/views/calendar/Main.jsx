import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    FullCalendarDraggable,
} from "@/base-components";
import Calendar from "@/components/calendar/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import { Client } from "@microsoft/microsoft-graph-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Main() {
    const dragableOptions = {
        itemSelector: ".event",
        eventData(eventEl) {
            return {
                title: dom(eventEl).find(".event__title").html(),
                duration: {
                    days: parseInt(dom(eventEl).find(".event__days").text()),
                },
            };
        },
    };

    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => {
        setIsOpen(false);
    };

    const { authProvider } = useSelector((state) => state.auth);
    const [isLoggedIn, setIsLoggedIn] = useState(!!authProvider);

    const navigate = useNavigate()

    const client = Client.initWithMiddleware({ authProvider });
    const [loading, setLoading] = useState(false);

    async function createEvent(eventData) {
        const payload = {
            subject: eventData.taskName,
            body: {
                contentType: "Text",
                content: eventData.description || "No description provided",
            },
            start: {
                dateTime: new Date(eventData.startDate).toISOString(), // always UTC
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: new Date(eventData.endDate).toISOString(),
                timeZone: "Asia/Kolkata",
            },
        };

        setLoading(true);
        try {
            await client.api("/me/events").post(payload);
        } catch (error) {
            console.log("Error while creating event on calendar", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* ⚠️ Warning Banner */}
            {!isLoggedIn && (
                <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800">
                    <Lucide icon="AlertTriangle" className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">
                        You are not signed in. Please sign in with your Outlook account.
                    </span>
                    <button className="hover:bg-yellow-500 font-semibold hover:cursor-pointer px-3 py-1 bg-yellow-300 rounded-md" onClick={()=> navigate(`/dashboard/inbox`)}>Sign In</button>
                </div>
            )}
            <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
                <h2 className="text-lg font-medium mr-auto">Calendar</h2>
            </div>

            <div className="w-full">
                <div className="w-full mb-5 flex items-center justify-end">
                    <button
                        onClick={() => setIsOpen(true)}
                        type="button"
                        className="btn btn-primary cursor-pointer"
                    >
                        <Lucide icon="Edit3" className="w-4 h-4 mr-2" />{" "}
                        {loading ? "Creating..." : "Add New Schedule"}
                    </button>
                </div>
                <div className="box p-5">
                    <Calendar trigger={createEvent} />
                </div>
            </div>

            <TaskModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={createEvent}
                isLoading={loading}
            />
        </>
    );
}

export default Main;

// {/* <div className="grid grid-cols-12 gap-5 mt-5">
//     {/* BEGIN: Calendar Side Menu */}
//     {/* <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
//                     <div className="box p-5 intro-y">
//                         <button type="button" className="btn btn-primary w-full mt-2">
//                             <Lucide icon="Edit3" className="w-4 h-4 mr-2" /> Add New Schedule
//                         </button>
//                         <FullCalendarDraggable
//                             id="calendar-events"
//                             options={dragableOptions}
//                             className="border-t border-b border-slate-200/60 dark:border-darkmode-400 mt-6 mb-5 py-3"
//                         >
//                             <div className="relative">
//                                 <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center">
//                                     <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
//                                     <div className="pr-10">
//                                         <div className="event__title truncate">VueJS Amsterdam</div>
//                                         <div className="text-slate-500 text-xs mt-0.5">
//                                             <span className="event__days">2</span> Days{" "}
//                                             <span className="mx-1">•</span> 10:00 AM
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <a
//                                     className="flex items-center absolute top-0 bottom-0 my-auto right-0"
//                                     href=""
//                                 >
//                                     <Lucide icon="Edit" className="w-4 h-4 text-slate-500" />
//                                 </a>
//                             </div>
//                             <div className="relative">
//                                 <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center">
//                                     <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
//                                     <div className="pr-10">
//                                         <div className="event__title truncate">
//                                             Vue Fes Japan 2019
//                                         </div>
//                                         <div className="text-slate-500 text-xs mt-0.5">
//                                             <span className="event__days">3</span> Days{" "}
//                                             <span className="mx-1">•</span> 07:00 AM
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <a
//                                     className="flex items-center absolute top-0 bottom-0 my-auto right-0"
//                                     href=""
//                                 >
//                                     <Lucide icon="Edit" className="w-4 h-4 text-slate-500" />
//                                 </a>
//                             </div>
//                             <div className="relative">
//                                 <div className="event p-3 -mx-3 cursor-pointer transition duration-300 ease-in-out hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md flex items-center">
//                                     <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
//                                     <div className="pr-10">
//                                         <div className="event__title truncate">Laracon 2021</div>
//                                         <div className="text-slate-500 text-xs mt-0.5">
//                                             <span className="event__days">4</span> Days{" "}
//                                             <span className="mx-1">•</span> 11:00 AM
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <a
//                                     className="flex items-center absolute top-0 bottom-0 my-auto right-0"
//                                     href=""
//                                 >
//                                     <Lucide icon="Edit" className="w-4 h-4 text-slate-500" />
//                                 </a>
//                             </div>
//                             <div
//                                 className="text-slate-500 p-3 text-center hidden"
//                                 id="calendar-no-events"
//                             >
//                                 No events yet
//                             </div>
//                         </FullCalendarDraggable>
//                         <div className="form-check form-switch flex">
//                             <label className="form-check-label" htmlFor="checkbox-events">
//                                 Remove after drop
//                             </label>
//                             <input
//                                 className="show-code form-check-input ml-auto"
//                                 type="checkbox"
//                                 id="checkbox-events"
//                             />
//                         </div>
//                     </div>
//                     <div className="box p-5 intro-y mt-5">
//                         <div className="flex">
//                             <Lucide icon="ChevronLeft" className="w-5 h-5 text-slate-500" />
//                             <div className="font-medium text-base mx-auto">April</div>
//                             <Lucide icon="ChevronRight" className="w-5 h-5 text-slate-500" />
//                         </div>
//                         <div className="grid grid-cols-7 gap-4 mt-5 text-center">
//                             <div className="font-medium">Su</div>
//                             <div className="font-medium">Mo</div>
//                             <div className="font-medium">Tu</div>
//                             <div className="font-medium">We</div>
//                             <div className="font-medium">Th</div>
//                             <div className="font-medium">Fr</div>
//                             <div className="font-medium">Sa</div>
//                             <div className="py-0.5 rounded relative text-slate-500">29</div>
//                             <div className="py-0.5 rounded relative text-slate-500">30</div>
//                             <div className="py-0.5 rounded relative text-slate-500">31</div>
//                             <div className="py-0.5 rounded relative">1</div>
//                             <div className="py-0.5 rounded relative">2</div>
//                             <div className="py-0.5 rounded relative">3</div>
//                             <div className="py-0.5 rounded relative">4</div>
//                             <div className="py-0.5 rounded relative">5</div>
//                             <div className="py-0.5 bg-success/20 dark:bg-success/30 rounded relative">
//                                 6
//                             </div>
//                             <div className="py-0.5 rounded relative">7</div>
//                             <div className="py-0.5 bg-primary text-white rounded relative">8</div>
//                             <div className="py-0.5 rounded relative">9</div>
//                             <div className="py-0.5 rounded relative">10</div>
//                             <div className="py-0.5 rounded relative">11</div>
//                             <div className="py-0.5 rounded relative">12</div>
//                             <div className="py-0.5 rounded relative">13</div>
//                             <div className="py-0.5 rounded relative">14</div>
//                             <div className="py-0.5 rounded relative">15</div>
//                             <div className="py-0.5 rounded relative">16</div>
//                             <div className="py-0.5 rounded relative">17</div>
//                             <div className="py-0.5 rounded relative">18</div>
//                             <div className="py-0.5 rounded relative">19</div>
//                             <div className="py-0.5 rounded relative">20</div>
//                             <div className="py-0.5 rounded relative">21</div>
//                             <div className="py-0.5 rounded relative">22</div>
//                             <div className="py-0.5 bg-pending/20 dark:bg-pending/30 rounded relative">
//                                 23
//                             </div>
//                             <div className="py-0.5 rounded relative">24</div>
//                             <div className="py-0.5 rounded relative">25</div>
//                             <div className="py-0.5 rounded relative">26</div>
//                             <div className="py-0.5 bg-primary/10 dark:bg-primary/50 rounded relative">
//                                 27
//                             </div>
//                             <div className="py-0.5 rounded relative">28</div>
//                             <div className="py-0.5 rounded relative">29</div>
//                             <div className="py-0.5 rounded relative">30</div>
//                             <div className="py-0.5 rounded relative text-slate-500">1</div>
//                             <div className="py-0.5 rounded relative text-slate-500">2</div>
//                             <div className="py-0.5 rounded relative text-slate-500">3</div>
//                             <div className="py-0.5 rounded relative text-slate-500">4</div>
//                             <div className="py-0.5 rounded relative text-slate-500">5</div>
//                             <div className="py-0.5 rounded relative text-slate-500">6</div>
//                             <div className="py-0.5 rounded relative text-slate-500">7</div>
//                             <div className="py-0.5 rounded relative text-slate-500">8</div>
//                             <div className="py-0.5 rounded relative text-slate-500">9</div>
//                         </div>
//                         <div className="border-t border-slate-200/60 dark:border-darkmode-400 pt-5 mt-5">
//                             <div className="flex items-center">
//                                 <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
//                                 <span className="truncate">Independence Day</span>
//                                 <div className="h-px flex-1 border border-r border-dashed border-slate-200 mx-3 xl:hidden"></div>
//                                 <span className="font-medium xl:ml-auto">23th</span>
//                             </div>
//                             <div className="flex items-center mt-4">
//                                 <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
//                                 <span className="truncate">Memorial Day</span>
//                                 <div className="h-px flex-1 border border-r border-dashed border-slate-200 mx-3 xl:hidden"></div>
//                                 <span className="font-medium xl:ml-auto">10th</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}
//     {/* END: Calendar Side Menu */}
//     {/* BEGIN: Calendar Content */}
//     {/* <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
//         <div className="box p-5">
//             <Calendar />
//         </div>
//     </div> */}
//     {/* END: Calendar Content */}
// </div>; */}

const TaskModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskName) return; // Simple validation

        onSubmit({ taskName, description, startDate, endDate });

        // Reset form after submission and close modal
        setTaskName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        onClose();
    };

    return (
        // Modal Overlay: Fixed position, dark backdrop, centers content
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            {/* Modal Container: Dark background, padding, rounded corners, max width */}
            <div
                className="bg-[#2B2C37] text-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Create New Task</h2>
                    <button
                        className="text-[#828FA3] hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        {/* Simple 'X' icon or you can use a library like Heroicons/Lucide */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Task Name Field */}
                    <div className="mb-5">
                        <label
                            htmlFor="taskName"
                            className="block text-xs font-bold mb-2 text-[#828FA3]"
                        >
                            Event Title
                        </label>
                        <input
                            id="taskName"
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="e.g., Design Landing Page"
                            required
                            className="w-full p-2.5 rounded border border-[#37394D] bg-[#37394D] text-white placeholder-[#828FA3] focus:outline-none focus:ring-1 focus:ring-[#635FC7]"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="mb-5">
                        <label
                            htmlFor="description"
                            className="block text-xs font-bold mb-2 text-[#828FA3]"
                        >
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A brief detail about the task..."
                            className="w-full p-2.5 rounded border border-[#37394D] bg-[#37394D] text-white placeholder-[#828FA3] focus:outline-none focus:ring-1 focus:ring-[#635FC7] min-h-[100px] resize-y"
                        ></textarea>
                    </div>

                    {/*  Start Date Field */}
                    <div className="mb-8">
                        <label
                            htmlFor="startDate"
                            className="block text-xs font-bold mb-2 text-[#828FA3]"
                        >
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 rounded border border-[#37394D] bg-[#37394D] text-white placeholder-[#828FA3] focus:outline-none focus:ring-1 focus:ring-[#635FC7]"
                        />
                    </div>

                    {/* End Date Field */}
                    <div className="mb-8">
                        <label
                            htmlFor="endDate"
                            className="block text-xs font-bold mb-2 text-[#828FA3]"
                        >
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2.5 rounded border border-[#37394D] bg-[#37394D] text-white placeholder-[#828FA3] focus:outline-none focus:ring-1 focus:ring-[#635FC7]"
                        />
                    </div>

                    {/* Modal Footer: Buttons */}
                    <div className="flex justify-between space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-full font-bold text-white bg-[#EA5555] hover:bg-[#FF9898] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 rounded-full font-bold text-white bg-[#635FC7] hover:bg-[#A8A4FF] transition-colors"
                        >
                            {isLoading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
