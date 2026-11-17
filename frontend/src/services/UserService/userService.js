
import api from "../api";

// Update profile information
export const updateUserProfile = async (data) => {
    const response = await api.patch(
        "/auth/me/",
        data
    );

    return response.data;
};


// Upload or replace profile avatar
export const uploadUserAvatar = async (image) => {

    const formData = new FormData();

    formData.append("avatar", image);

    const response = await api.put(
        "/auth/me/avatar/",
        formData
    );

    return response.data;
};


// Remove profile avatar
export const removeUserAvatar = async () => {
    const response = await api.delete(
        "/auth/me/avatar/"
    );

    return response.data;
};
