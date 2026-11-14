
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);

    const closeSidebar = () => {
        setOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-neutral-50">

            {/* Mobile sidebar overlay */}
            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-30 cursor-default bg-black/40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar
                open={open}
                onClose={closeSidebar}
            />

            {/* Main content area */}
            <div className="flex min-w-0 flex-1 flex-col">

                {/* Header */}
                <AdminHeader
                    onMenuClick={() => setOpen(true)}
                />

                {/* Current admin page */}
                <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;
