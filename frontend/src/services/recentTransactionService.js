import api from "./api";

export const getRecentTransactions = async (limit = 5, days = null) => {

    let url = "/dashboard/recent-transactions";
    const params = [];

    if (limit) {
        params.push(`limit=${limit}`);
    }

    if (days) {
        params.push(`days=${days}`);
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await api.get(url);

    return response.data;

};