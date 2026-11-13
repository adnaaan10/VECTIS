import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../services/auth/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(user);

    // Restore authentication when React starts
    const initializeAuth = async () => {

        try {
            const userData = await getCurrentUser();
            setUser(userData);

        } catch (error) {
            setUser(null);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    // Login
    const login = async (credentials) => {

        const response = await loginUser(credentials);

        setUser(response.user);

        return response;
    };

    // Logout
    const logout = async () => {

        try {
            await logoutUser();

        } finally {
            setUser(null);
        }
    };

    // Handle expired session when refresh fails
    useEffect(() => {

        const handleSessionExpired = () => {
            setUser(null);
        };

        window.addEventListener(
            "auth:session-expired",
            handleSessionExpired
        );

        return () => {
            window.removeEventListener(
                "auth:session-expired",
                handleSessionExpired
            );
        };

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                initializeAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
