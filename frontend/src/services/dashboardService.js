import axios from "../api/axiosConfig";

export const getDashboardSummary = async () => {

    const response = await axios.get("/dashboard");

    return response.data;
};