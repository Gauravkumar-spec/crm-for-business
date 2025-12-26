import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import dom from "@left4code/tw-starter/dist/js/dom";
import { FullCalendar } from "@/base-components";
import { useEffect, useState } from "react";
import { Client } from "@microsoft/microsoft-graph-client";
import Loader from "../loading-ui/Main.jsx";
import { useSelector } from "react-redux";
import tippy from "tippy.js";

function Main(props) {
    const [events, setEvents] = useState([]);

    const { authProvider } = useSelector((state) => state.auth);

    const client = Client.initWithMiddleware({ authProvider });

    const [loading, setLoading] = useState(false);

    function formatDateToYYYYMMDD(date) {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
        const day = String(date?.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }



    async function fetchEvents() {
        setLoading(true);
        const resultArr = [];
        try {
            const res = await client.api("/me/events").get();

            if (res) {
                
                res?.value.map((v) => {
                    resultArr.push({
                        title: v.subject,
                        start: v.start?.dateTime.split("T")[0],
                        end: v.end?.dateTime.split("T")[0],
                        description: v?.bodyPreview || "No Description",
                    });
                });
            }

            setEvents(resultArr);
        } catch (error) {
            console.log("Error fetching events", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEventDidMount = (info) => {
        const event = info.event;

        const title = event._def?.title || "No title";

        const matchedEvent = events.find(
            (event) => event.start === formatDateToYYYYMMDD(info.event.start)
        );

        const description = matchedEvent?.description || "No Description";

        const start = info.event.start
            ? new Date(info.event.start).toLocaleString()
            : "No start date";

        const content = `
    <div class="w-60 rounded-xl shadow-2xl bg-white p-3 text-xs text-gray-800 font-medium">
      <h5 class="text-sm font-medium mb-1.5">${title}</h5>
      <p class="text-xs text-gray-500 mb-2">${description}</p>
      <p class="text-xs text-gray-400 mb-2"><strong>Date:</strong> ${start}</p>
    </div>
  `;

        // ✅ Ensure info.el is a real DOM element before passing it to tippy
        if (info.el instanceof HTMLElement) {
            tippy(info.el, {
                content,
                allowHTML: true,
                interactive: true,
                placement: "top",
                trigger: "mouseenter",
                theme: "custom",
                animation: "shift-away",
            });
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [props.trigger]);

    // if (loading) {
    //     return <Loader message="Loading Events" />;
    // }

    const options = {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        droppable: true,
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        initialDate: new Date(),
        navLinks: true,
        editable: true,
        dayMaxEvents: true,
        events: events,
        drop: function (info) {
            if (dom("#checkbox-events").length && dom("#checkbox-events")[0].checked) {
                dom(info.draggedEl).parent().remove();

                if (dom("#calendar-events").children().length == 1) {
                    dom("#calendar-no-events").removeClass("hidden");
                }
            }
        },
        eventDidMount: handleEventDidMount,
    };

    return <FullCalendar options={options} />;
}

export default Main;
