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

    console.log("Events", events);

    async function fetchEvents() {
        setLoading(true);
        const resultArr = [];
        try {
            const res = await client.api("/me/events").get();

            if (res) {
                console.log(res.value);
                res?.value.map((v) => {
                    resultArr.push({
                        title: v.subject,
                        start: formatDateToYYYYMMDD(new Date(v.start?.dateTime)),
                        end: formatDateToYYYYMMDD(new Date(v.end?.dateTime)),
                    });
                });
            }

            setEvents(resultArr)
        } catch (error) {
            console.log("Error fetching events", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [props.trigger]);

    if (loading) {
        return <Loader message="Loading Events" />;
    }

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
        // events: [
        //     {
        //         title: "Vue Vixens Day",
        //         start: "2021-01-05",
        //         end: "2021-01-08",
        //     },
        //     {
        //         title: "VueConfUS",
        //         start: "2021-01-11",
        //         end: "2021-01-15",
        //     },
        //     {
        //         title: "VueJS Amsterdam",
        //         start: "2021-01-17",
        //         end: "2021-01-21",
        //     },
        //     {
        //         title: "Vue Fes Japan 2019",
        //         start: "2021-01-21",
        //         end: "2021-01-24",
        //     },
        //     {
        //         title: "Laracon 2021",
        //         start: "2021-01-24",
        //         end: "2021-01-27",
        //     },
        // ],
        drop: function (info) {
            if (dom("#checkbox-events").length && dom("#checkbox-events")[0].checked) {
                dom(info.draggedEl).parent().remove();

                if (dom("#calendar-events").children().length == 1) {
                    dom("#calendar-no-events").removeClass("hidden");
                }
            }
        },

        // Pending Task....
        dateClick: function (event) {
            console.log("Calendar event:- ", event.dateStr);
            const title = window.prompt("Enter event title");
            setEvent((prev) => [
                ...prev,
                {
                    title,
                    start: event.dateStr,
                    end: event.dateStr,
                },
            ]);
        },
    };

    return <FullCalendar options={options} />;
}

export default Main;
