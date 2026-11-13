import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfToken = null;

const getCsrfToken = async () => {
    const response = await api.get("/auth/csrf/");

    csrfToken = response.data.csrfToken;

    return csrfToken;
};

api.interceptors.request.use(async (config) => {

    const method = config.method?.toLowerCase();

    const unsafeMethods = ["post", "put", "patch", "delete"];

    if (unsafeMethods.includes(method)) {

        if (!csrfToken) {
            await getCsrfToken();
        }

        config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
});

// Handle expired access tokens
let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {

            if (!refreshPromise) {
                refreshPromise = api.post(
                    "/auth/token/refresh/",
                    null
                ).finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;

            return api(originalRequest);

        } catch (refreshError) {

            window.dispatchEvent(
                new Event("auth:session-expired")
            );

            return Promise.reject(refreshError);
        }
    }
);

export default api;
