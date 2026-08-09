import axios from "../api/axiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const BACKEND_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getProfileImageUrl = (imagePath, fullName = "User") => {
    if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "User")}&background=2563EB&color=fff&size=150`;
    }

    const trimmed = imagePath.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
        return trimmed;
    }

    if (trimmed.startsWith("/")) {
        return `${BACKEND_ROOT_URL}${trimmed}`;
    }

    return `${BACKEND_ROOT_URL}/uploads/${trimmed}`;
};

export const getProfile = async () => {
    const response = await axios.get("/profile");
    return response.data;
};

export const updateProfile = async (profile) => {
    const response = await axios.put("/profile", profile);
    return response.data;
};

export const uploadProfileImageFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/users/profile-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};