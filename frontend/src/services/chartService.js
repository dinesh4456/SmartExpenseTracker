import axios from "../api/axiosConfig";

export const getCategoryExpenseChart = async () => {

    const response = await axios.get("/charts/category-expense");

    return response.data;
};

export const getMonthlyExpenseChart = async () => {

    const response = await axios.get("/charts/monthly-expense");

    return response.data;
};