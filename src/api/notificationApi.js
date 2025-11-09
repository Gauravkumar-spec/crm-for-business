import { axiosInstance } from "../context/AuthContext.jsx";

export const notificationApi = {
    getAgentNotification: async (data) => {
        try {
            const response = await axiosInstance.post("agentNotification", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    getAgentNotificationOnRead: async (data) => {
        try {
            const response = await axiosInstance.post("agentNotificationread", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
};
