import api from "./api";

export const registerUser = async (data) => {
    const response = await api.post(
        "/api/v1/auth/register/",
        data
    );

    return response.data;
};