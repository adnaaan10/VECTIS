import { BrowserRouter,Routes,Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/user/HomePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";


function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route element={<UserLayout/>}>
                    <Route path="/" element={<HomePage/>}/>
                </Route>

                <Route path="/admin" element={<AdminLayout/>}>
                    <Route path="dashboard" element={<AdminDashboardPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;