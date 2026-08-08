import axios from "../api/axiosConfig";

export const getProfile = async () => {

    const response = await axios.get("/profile");

    return response.data;

};

export const updateProfile = async (profile) => {

    const response = await axios.put("/profile", profile);

    return response.data;

};