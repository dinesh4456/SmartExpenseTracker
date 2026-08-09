import axios from "axios";

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    url = url.trim().replace(/\/+$/, "");
    if (!url.endsWith("/api")) {
        url = `${url}/api`;
    }
    return url;
};

const API_BASE_URL = getBaseUrl();

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        console.log("========== AXIOS REQUEST ==========");
        console.log("URL:", config.baseURL + config.url);
        console.log("Token exists:", !!token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userName");

            const currentPath = window.location.pathname;
            if (currentPath !== "/" && currentPath !== "/register" && currentPath !== "/forgot-password") {
                alert("Session expired. Please login again.");
                window.location.href = "/";
            }

        } else if (!error.response) {

            error.message = "Failed to connect to server.";

        }

        return Promise.reject(error);
    }

);

export default axiosInstance;