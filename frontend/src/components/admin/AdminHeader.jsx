
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    Menu,
    ChevronDown,
    LogOut,
} from "lucide-react";

import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";


const AdminHeader = ({ onMenuClick }) => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const menuRef = useRef(null);


    // Admin details
    const name = user?.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user?.email || "Administrator";

    const initial = (
        user?.first_name?.[0] ||
        user?.email?.[0] ||
        "A"
    ).toUpperCase();


    // Close dropdown when clicking outside
    useEffect(() => {

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    // Logout
    const handleLogout = async () => {

        if (busy) return;

        setBusy(true);
        setMenuOpen(false);

        try {
            await logout();
        } catch (error) {
            toast.error("Logout request failed.");
        } finally {
            navigate("/login", { replace: true });
            setBusy(false);
        }
    };


    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 lg:px-8">

            {/* Left section */}
            <div className="flex min-w-0 items-center gap-3">

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="text-gray-600 hover:text-black lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>


                {/* Global search placeholder */}
                <div className="relative hidden md:block">

                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search products, orders, customers..."
                        aria-label="Global search"
                        className="w-72 rounded-sm border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-black focus:outline-none"
                    />

                </div>

            </div>


            {/* Right section */}
            <div className="flex items-center gap-4 text-gray-600">


                {/* Notifications placeholder */}
                <button
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                    onClick={() =>
                        toast.info("Notifications are coming soon.")
                    }
                    className="relative hover:text-black"
                >
                    <Bell className="h-5 w-5" />

                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-600" />
                </button>


                {/* Admin profile dropdown */}
                <div className="relative" ref={menuRef}>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-expanded={menuOpen}
                        aria-haspopup="true"
                        className="flex items-center gap-2 rounded-sm border border-gray-200 py-1.5 pl-1.5 pr-2 hover:border-gray-300"
                    >

                        {/* Avatar */}
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                            {initial}
                        </span>

                        {/* Admin name */}
                        <span className="hidden text-sm font-medium text-gray-800 sm:block">
                            {name}
                        </span>

                        <ChevronDown className="h-4 w-4" />

                    </button>


                    {/* Dropdown menu */}
                    {menuOpen && (

                        <div className="absolute right-0 mt-2 w-56 rounded-sm border border-gray-200 bg-white py-1 shadow-sm">

                            {/* Profile information */}
                            <div className="border-b border-gray-100 px-4 py-3">

                                <p className="text-sm font-semibold text-gray-900">
                                    {name}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                    {user?.email}
                                </p>

                            </div>


                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={busy}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
};

export default AdminHeader;
