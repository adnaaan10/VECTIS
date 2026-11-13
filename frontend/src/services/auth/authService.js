import api from "../api";
import { useNavigate } from "react-router-dom";

export const registerUser = async (data) => {
    const response = await api.post(
        "/auth/register/",
        data
    );

    return response.data;
};


export const verifyEmailOtp = async (data) => {
    const response = await api.post(
        "/auth/email/verify/",
        data
    );

    return response.data;
}

export const resendEmailOtp = async (data) => {
    const response = await api.post(
        "/auth/email/resend-otp/",
        data
    );

    return response.data;
};



export const loginUser = async (data) => {
    const response = await api.post(
        "/auth/login/",
        data
    );

    return response.data   
};



export const forgotPassword = async (data) => {
    const response = await api.post(
        "/auth/forgot-password/",
        data
    );

    return response.data;
};


export const resetPassword = async (data) => {
    const response = await api.post(
        "/auth/reset-password/",
        data
    );

    return response.data;
};


export const logoutUser = async () => {
    const response = await api.post(
        "/auth/logout/"
    );
    
    return response.data;
};


export const getCurrentUser = async () => {
    const response = await api.get(
        "/auth/me/"
    );

    return response.data;
};