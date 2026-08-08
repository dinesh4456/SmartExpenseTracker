import axios from "../api/axiosConfig";

export const getExpenses = async () => {

    const response = await axios.get("/expense");

    // If backend returns Spring Page
    if (response.data.content) {
        return response.data.content;
    }

    // If backend returns List
    if (Array.isArray(response.data)) {
        return response.data;
    }

    return [];

};

export const getExpenseById = async (id) => {

    const response = await axios.get(`/expense/${id}`);

    return response.data;

};

export const createExpense = async (expense) => {

    const response = await axios.post("/expense", expense);

    return response.data;

};

export const updateExpense = async (id, expense) => {

    const response = await axios.put(`/expense/${id}`, expense);

    return response.data;

};

export const deleteExpense = async (id) => {

    await axios.delete(`/expense/${id}`);

};