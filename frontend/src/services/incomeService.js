import axios from "../api/axiosConfig";

export const getIncome = async () => {

    const response = await axios.get("/income");

    return response.data;

};

export const getIncomeById = async (id) => {

    const response = await axios.get(`/income/${id}`);

    return response.data;

};

export const createIncome = async (income) => {

    const response = await axios.post("/income", income);

    return response.data;

};

export const updateIncome = async (id, income) => {

    const response = await axios.put(`/income/${id}`, income);

    return response.data;

};

export const deleteIncome = async (id) => {

    await axios.delete(`/income/${id}`);

};