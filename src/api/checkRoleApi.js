import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ROLECHECK_URI,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosRetry(axiosInstance, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay, // 1s, 2s, 4s
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
    },
});

export const checkRoleApi = {
    checkRole: async (data) => {
        try {
            const response = await axiosInstance.post("/agentCheck", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
};
