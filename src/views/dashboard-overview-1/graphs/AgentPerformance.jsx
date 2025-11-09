import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { useMemo, useState, useEffect } from "react";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { dashboardApi } from "../../../api/dashboardApi.js";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const [agentPerformance, setAgentPerformance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Remaining loading and error handling

    const fetchAgentPerformance = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                client_id: 1,
            };

            const response = await dashboardApi.chartAgentperformance(payload);

            if (response) {
                const fixedArr = response.replace(/'/g, '"');

                const data = JSON.parse(fixedArr);

                setAgentPerformance(data);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentPerformance();
    }, []);

    const data = useMemo(() => {
        return {
            labels: [...agentPerformance?.map((data) => data.agent_name)],
            datasets: [
                {
                    label: "Closed Leads",
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    data: [...agentPerformance?.map((data) => data.closed_leads)],
                    backgroundColor: colorScheme ? colors.primary() : "",
                },
            ],
        };
    }, [agentPerformance]);

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
                    min: 0,
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

    return (
        <div className="intro-y box mt-5 p-10">
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
