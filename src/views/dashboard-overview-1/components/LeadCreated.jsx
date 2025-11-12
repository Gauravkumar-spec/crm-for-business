import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../../../api/dashboardApi.js";
import { startOfISOWeek, endOfISOWeek, parseISO, format } from "date-fns";

import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
} from "@/base-components";
import { PulseLoader } from "react-spinners";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const [leadCreated, setLeadCreated] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState("weekly");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filterWeeklyData = (data) => {
        const labels = data.map((item) => {
            const start = startOfISOWeek(parseISO(item.period));
            const end = endOfISOWeek(parseISO(item.period));

            return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
        });

        const values = data.map((item) => item.total_leads);

        const result = labels.map((lb, idx) => ({
            label: lb,
            value: values[idx],
        }));

        return result;
    };

    // Handle loading and error state

    const filterMonthlyData = (data) => {
        const month = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
        };

        const result = data.map((value) => ({
            label: `${month[value.period_month]}-${value.period_year}`,
            value: value.total_leads,
        }));

        return result;
    };

    const fetchLeadCreated = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                client_id: 1,
                period: type,
                start_date: startDate,
                end_date: endDate,
            };

            const response = await dashboardApi.chartLeadcreated(payload);

            if (response) {
                console.log(response);

                if (response?.period == "weekly") {
                    const data = filterWeeklyData(response?.data);

                    if (data) setLeadCreated(data);
                }

                if (response?.period == "monthly") {
                    const data = filterMonthlyData(response?.data);

                    if (data) setLeadCreated(data);
                }
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const data = useMemo(() => {
        return {
            labels: [...leadCreated.map((data) => data.label)],
            datasets: [
                {
                    label: "Leads Created",
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    data: [...leadCreated.map((data) => data.value)],
                    backgroundColor: colorScheme ? colors.primary() : "",
                },
                // {
                //     label: "Leads Created",
                //     barPercentage: 0.5,
                //     barThickness: 6,
                //     maxBarThickness: 8,
                //     minBarLength: 2,
                //     data: [...leadCreated.map((data) => data.value)],
                //     backgroundColor: colorScheme ? "#FF0000" : "",
                // },
            ],
        };
    });

    const options = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: colors.slate["500"](0.8),
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12,
                        },
                        color: colors.slate["500"](0.8),
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        font: {
                            size: 12,
                        },
                        color: colors.slate["500"](0.8),
                        callback: function (value) {
                            return value;
                        },
                    },
                    grid: {
                        color: darkMode ? colors.slate["500"](0.3) : colors.slate["300"](),
                        borderDash: [2, 2],
                        drawBorder: false,
                    },
                },
            },
        };
    });

    useEffect(() => {
        fetchLeadCreated();
    }, [type]);

    return (
        <div className="intro-y w-full box mt-5 p-10">
            <div className="form-check form-switch flex  justify-end gap-3 w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                <Dropdown className="md:ml-auto mt-5 md:mt-0">
                    <DropdownToggle className="btn btn-outline-secondary font-normal">
                        {type}
                        <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                    </DropdownToggle>
                    <DropdownMenu className="w-40" onClick={(e) => e.stopPropagation()}>
                        <DropdownContent className="overflow-y-auto h-32">
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation(); // stop menu from auto-closing
                                    setType("weekly");
                                }}
                            >
                                Weekly
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setType("monthly");
                                }}
                            >
                                Monthly
                            </DropdownItem>
                        </DropdownContent>
                    </DropdownMenu>
                </Dropdown>
            </div>
            {error ? (
                <p className="text-sm text-slate-500 mt-1">404 Not Found</p>
            ) : (
                <>
                    {!error && loading ? (
                        <PulseLoader color="#270038" size={7} />
                    ) : (
                        <Chart
                            type="bar"
                            width="100%"
                            height={props.height}
                            data={data}
                            options={options}
                            className={props.className}
                        />
                    )}
                </>
            )}
        </div>
    );
}

Main.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
};

Main.defaultProps = {
    width: "auto",
    height: "auto",
    className: "",
};

export default Main;
