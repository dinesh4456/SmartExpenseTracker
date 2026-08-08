import axios from "../api/axiosConfig";

export const getCategories = async () => {

    const response = await axios.get("/categories");

    return response.data;

};

export const getCategoriesWithStats = async (search = "", sortBy = "az", year = null, month = null) => {

    const params = {};
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await axios.get("/categories/with-stats", { params });

    return response.data;

};

export const getCategoryStats = async () => {

    const response = await axios.get("/categories/stats");

    return response.data;

};

export const getCategoryById = async (id) => {

    const response = await axios.get(`/categories/${id}`);

    return response.data;

};

export const createCategory = async (category) => {

    const response = await axios.post("/categories", category);

    return response.data;

};

export const updateCategory = async (id, category) => {

    const response = await axios.put(`/categories/${id}`, category);

    return response.data;

};

export const deleteCategory = async (id) => {

    const response = await axios.delete(`/categories/${id}`);

    return response.data;

};