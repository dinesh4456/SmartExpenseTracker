import axios from "../api/axiosConfig";

export const getBudgets = async () => {

    const response = await axios.get("/budgets/all");

    return response.data;

};

export const getBudgetDetails = async (month, year) => {

    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await axios.get("/budget", { params });

    return response.data;

};

export const saveOrUpdateBudget = async (budget) => {

    const response = await axios.post("/budget", budget);

    return response.data;

};

export const createBudget = async (budget) => {

    const response = await axios.post(
        "/budget",
        budget
    );

    return response.data;

};


export const updateBudget = async (id, budget) => {

    const response = await axios.put(
        `/budgets/${id}`,
        budget
    );

    return response.data;

};


export const deleteBudget = async (id) => {

    await axios.delete(
        `/budgets/${id}`
    );

};