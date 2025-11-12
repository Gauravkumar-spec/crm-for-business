import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../../../api/dashboardApi.js";
import { useDispatch } from "react-redux";
import { setRevenueData } from "../../../stores/slices/revenue_graph_das.js";
import { PulseLoader } from "react-spinners";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const dispatch = useDispatch();

    const [revenueTrendData, setRevenueTrendData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const month = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
    };

    const fetchRevenueTrend = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                client_id: 1,
            };

            const response = await dashboardApi.chartRevenuetrend(payload);

            if (response) {
                const fixedArr = response.replace(/'/g, '"');

                const data = JSON.parse(fixedArr);

                setRevenueTrendData(data);
                dispatch(setRevenueData(data));
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueTrend();
    }, []);

    const data = useMemo(() => {
        return {
            labels: [...revenueTrendData.map((data) => month[new Date(data.date).getMonth()])],
            datasets: [
                {
                    label: "revenue",
                    data: [...revenueTrendData.map((data) => data.revenue)],
                    borderWidth: 2,
                    borderColor: colorScheme ? colors.primary() : "",
                    backgroundColor: "transparent",
                    pointBorderColor: "transparent",
                    tension: 0.4,
                },
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
                            return "₹" + value;
                        },
                    },
                    beginAtZero: true,
                    grid: {
                        color: darkMode ? colors.slate["500"](0.3) : colors.slate["300"](),
                        borderDash: [2, 2],
                        drawBorder: false,
                    },
                },
            },
        };
    });

    return (
        <div className={`intro-y box p-5 flex justify-center items-center ${props.className}`}>
            {error ? (
                <p className="text-sm text-slate-500 mt-1">404 Not Found</p>
            ) : (
                <>
                    {!error && loading ? (
                        <PulseLoader color="#270038" size={7} />
                    ) : (
                        <Chart
                            type="line"
                            width="100%"
                            height={220}
                            data={data}
                            options={options}
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
    lineColor: PropTypes.string,
    className: PropTypes.string,
};

Main.defaultProps = {
    width: "auto",
    height: "auto",
    lineColor: "",
    className: "",
};

export default Main;
