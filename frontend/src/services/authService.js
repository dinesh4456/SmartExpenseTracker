import axios from "../api/axiosConfig";

export const login = async (email, password) => {

    const response = await axios.post(
        "/auth/login",
        {
            email,
            password
        }
    );

    return response.data;
};

export const register = async (user) => {

    const response = await axios.post(
        "/auth/register",
        user
    );

    return response.data;
};