import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { useEffect, useMemo, useState } from "react";
import { dashboardApi } from "../../../api/dashboardApi.js";
import { PulseLoader } from "react-spinners";

function Main(props) {
    const darkMode = useRecoilValue(darkModeStore);
    const colorScheme = useRecoilValue(colorSchemeStore);

    const [leadSource, setLeadSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Remaining loading and error handling

    const fetchLeadSource = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                client_id: 1,
            };

            const response = await dashboardApi.chartLeadsource(payload);

            if (response) {
                const fixedArr = response.replace(/'/g, '"');

                const data = JSON.parse(fixedArr);

                setLeadSource(data);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadSource();
    }, []);

    const chartData = [...leadSource?.map((data) => data.total_leads)];
    const chartColors = () => [colors.pending(0.9), colors.warning(0.9), colors.primary(0.9)];
    const data = useMemo(() => {
        return {
            labels: [...leadSource?.map((data) => data.source)],
            datasets: [
                {
                    data: chartData,
                    backgroundColor: colorScheme ? chartColors() : "",
                    hoverBackgroundColor: colorScheme ? chartColors() : "",
                    borderWidth: 5,
                    borderColor: darkMode ? colors.darkmode[700]() : colors.white,
                },
            ],
        };
    }, [leadSource]);

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
        };
    });

    return (
        <>
            {error ? (
                <p className="text-sm text-slate-500 mt-1">404 Not Found</p>
            ) : (
                <>
                    {!error && loading ? (
                        <PulseLoader color="#270038" size={7} />
                    ) : (
                        <Chart
                            type="pie"
                            width={props.width}
                            height={props.height}
                            data={data}
                            options={options}
                            className={props.className}
                        />
                    )}
                </>
            )}
        </>
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
