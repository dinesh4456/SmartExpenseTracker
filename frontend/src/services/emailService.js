import axios from "../api/axiosConfig";

export const sendMonthlyReport = async (year = "", month = "") => {

    let url = "/email/monthly-report";
    const params = [];

    if (year !== "") {
        params.push(`year=${year}`);
    }

    if (month !== "") {
        params.push(`month=${month}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await axios.get(url);

    return response.data;

};