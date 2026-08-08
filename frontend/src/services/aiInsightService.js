import axios from "../api/axiosConfig";

export const getAIInsights = async () => {
    
    const response = await axios.get("/insights");

    return response.data;

};