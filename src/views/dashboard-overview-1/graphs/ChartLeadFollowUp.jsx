import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { dashboardApi } from "../../../api/dashboardApi.js";
import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
} from "@/base-components";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const [followUpData, setFollowUpData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filterType, setFilterType] = useState("all");

    function filterData(arr) {
        const result = {};
        for (let i = 0; i < arr.length; i++) {
            const date = arr[i].follow_up_date;
            if (!result[date]) {
                result[date] = 1;
            } else {
                result[date]++;
            }
        }

        return result;
    }

    function modifyYearFormat(obj) {
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

        const result = [];

        for (const key in obj) {
            const date = new Date(key);
            const actualDate = date.getDate();
            const actualMonth = month[date.getMonth()];
            const actualYear = date.getFullYear();

            const todayDate = new Date(Date.now()).toLocaleDateString();
            // Just for debugging purpose
            if (date.toLocaleDateString() === todayDate) {
                console.log("Today Value : ", date.toLocaleDateString());
            }

            result.push({
                date:
                    date.toLocaleDateString() === todayDate
                        ? "Today"
                        : `${actualDate} ${actualMonth} ${actualYear}`,
                totalLeads: obj[key],
            });
        }

        return result;
    }

    const fetchLeadFollowUp = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                client_id: 1,
            };

            const response = await dashboardApi.chartLeadfollowup(payload);

            if (response) {
                if (response.data) {
                    const filteredData = filterData([
                        ...response.data.last_7_days,
                        ...response.data.today,
                        ...response.data.next_7_days,
                    ]);

                    if (filteredData) {
                        const modifiedData = modifyYearFormat(filteredData);
                        if (modifiedData) setFollowUpData(modifiedData);
                    }
                }
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // filter by type - Pending
    const filterDataByType = useMemo(() => {
        if (filterType === "last") {
        }
    }, [filterType]);

    const data = useMemo(() => {
        return {
            labels: [...followUpData.map((data) => data.date)],
            datasets: [
                {
                    label: "Leads Created",
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    data: [...followUpData.map((data) => data.totalLeads)],
                    backgroundColor: colorScheme ? colors.primary() : "",
                },
            ],
        };
    });

    const options = useMemo(() => {
        return {
            indexAxis: "y",
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
                        stepSize: 1, // ✅ Control tick interval
                        beginAtZero: true,
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
        fetchLeadFollowUp();
    }, []);

    return (
        <div className="intro-y box mt-5 p-10">
            <div className="form-check form-switch flex  justify-end gap-3 w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                <Dropdown className="md:ml-auto mt-5 md:mt-0">
                    <DropdownToggle className="btn btn-outline-secondary font-normal">
                        {filterType}
                        <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                    </DropdownToggle>
                    <DropdownMenu className="w-40" onClick={(e) => e.stopPropagation()}>
                        <DropdownContent className="overflow-y-auto h-32">
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation(); // stop menu from auto-closing
                                    setFilterType("all");
                                }}
                            >
                                All
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterType("today");
                                }}
                            >
                                Today
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterType("next");
                                }}
                            >
                                Next_7_Days
                            </DropdownItem>
                            <DropdownItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterType("last");
                                }}
                            >
                                Last_7_Days
                            </DropdownItem>
                        </DropdownContent>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Chart
                type="bar"
                width={props.width}
                height={props.height}
                data={data}
                options={options}
                className={props.className}
            />
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
