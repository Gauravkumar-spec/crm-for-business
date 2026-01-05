import { axiosInstance } from "../context/AuthContext.jsx";

export const leadApi = {
    createLead: async (data) => {
        try {
            const response = await axiosInstance.post("setLead", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    updateLead: async (data) => {
        try {
            const response = await axiosInstance.post("leadUpdate", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    deleteLead: async (data) => {
        try {
            const response = await axiosInstance.post("leadDelete", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    leadSearch: async (data) => {
        try {
            const response = await axiosInstance.post("leadSearch", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    leadPreview: async (data) => {
        try {
            const response = await axiosInstance.post("leadPreview", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
    leadAssign: async (data) => {
        try {
            const response = await axiosInstance.post("leadAssign", data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || error;
        }
    },
};
