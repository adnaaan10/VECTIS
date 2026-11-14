
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/user/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmail from "../pages/auth/VerifyEmail";

import ProtectedAdminRoute from "../components/common/ProtectedAdminRoute";
import Customers from "../pages/admin/Customers";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Authentication routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Customer routes */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<HomePage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<ProtectedAdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            index
                            element={<Navigate to="customers" replace />}
                        />
                        <Route path="customers" element={<Customers />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
