import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import "./index.css";
import { useState } from "react";
import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css"; // Optional: for default styling

const Schedules = () => {
    const [events, setEvents] = useState([
        { title: "Team Sync", date: "2025-11-05", backgroundColor: "#3498db", allDay: false },
        { title: "Design Review", date: "2025-11-09", backgroundColor: "#2ecc71", allDay: false },
        { title: "Client Meeting", date: "2025-11-14", backgroundColor: "#e74c3c", allDay: false },
        { title: "Sprint Planning", date: "2025-11-20", backgroundColor: "#f39c12", allDay: false },
        { title: "Project Demo", date: "2025-11-25", backgroundColor: "#9b59b6", allDay: false },
    ]);

    const renderEventContent = (eventInfo) => {
        return (
            <div
                style={{
                    backgroundColor: eventInfo.event.backgroundColor || "#3788d8",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    display: "inline-block",
                    margin: "0 auto",
                }}
            />
        );
    };

    const handleEventDidMount = (info) => {
        const content = `
      <div class="w-60 rounded-xl shadow-2xl bg-white p-3 text-xs text-gray-800 font-medium">
        <h5 class="text-sm font-medium mb-1.5">${info.event.title}</h5>
        <p class="text-xs text-gray-500 mb-2">Description</p>
        <img src="https://pagedone.io/asset/uploads/1711965129.png" alt="image" class="w-full rounded"/>
        <span class="absolute -bottom-1.5 left-1/2 h-3 w-3 border-b border-r border-gray-300 -translate-x-1/2 rotate-45 bg-white"></span>
      </div>
    `;

        tippy(info.el, {
            content: content,
            allowHTML: true,
            interactive: true,
            placement: "top",
            trigger: "mouseenter",
            theme: "custom",
            animation: "shift-away",
        });
    };

    return (
        <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto mt-3">
            <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Schedules</h2>
            </div>
            <div className="mt-5">
                <div className="intro-x box">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        height="auto"
                        contentHeight="auto"
                        expandRows={true}
                        aspectRatio={1.3}
                        headerToolbar={{
                            left: "prev,next today",
                            right: "title",
                        }}
                        titleFormat={{ month: "short", year: "numeric" }}
                        events={events}
                        eventContent={renderEventContent}
                        eventDidMount={handleEventDidMount}
                    />

                    <div className="border-t border-slate-200/60 p-5">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
                            <span className="truncate">UI/UX Workshop</span>
                            <span className="font-medium xl:ml-auto">23th</span>
                        </div>
                        <div className="flex items-center mt-4">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            <span className="truncate">VueJs Frontend Development</span>
                            <span className="font-medium xl:ml-auto">10th</span>
                        </div>
                        <div className="flex items-center mt-4">
                            <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                            <span className="truncate">Laravel Rest API</span>
                            <span className="font-medium xl:ml-auto">31th</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedules;
