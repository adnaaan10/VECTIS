
import { NavLink, useNavigate } from "react-router-dom";
import {
    UserRound,
    MapPin,
    Package,
    Wallet,
    Mail,
    LockKeyhole,
    LogOut,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

const navigationItems = [
    {
        label: "My Profile",
        path: "/account/profile",
        icon: UserRound,
    },
    {
        label: "My Addresses",
        path: "/account/addresses",
        icon: MapPin,
    },
    {
        label: "My Orders",
        path: "/account/orders",
        icon: Package,
    },
    {
        label: "My Wallet",
        path: "/account/wallet",
        icon: Wallet,
    },
    {
        label: "Change Email",
        path: "/account/change-email",
        icon: Mail,
    },
    {
        label: "Change Password",
        path: "/account/change-password",
        icon: LockKeyhole,
    },
];

const AccountSidebar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/", { replace: true });
        }
    };

    const initials = `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`.toUpperCase();

    return (
        <aside className="flex h-full flex-col border border-gray-200 bg-white">

            {/* User Summary */}
            <div className="border-b border-gray-200 p-5">

                <div className="flex items-center gap-3">

                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="Profile"
                            className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                        />
                    ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-sm font-semibold text-white">
                            {initials || <UserRound size={20} />}
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                            Welcome back
                        </p>

                        <h3 className="truncate text-sm font-semibold text-black">
                            {user?.first_name} {user?.last_name}
                        </h3>

                        <p className="truncate text-xs text-gray-500">
                            {user?.email}
                        </p>
                    </div>

                </div>

            </div>


            {/* Navigation */}
            <nav className="flex-1">

                {navigationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center justify-between border-b border-gray-100 px-4 py-4 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                }`
                            }
                        >
                            <span className="flex items-center gap-3">
                                <Icon size={16} />
                                {item.label}
                            </span>

                            <span>›</span>
                        </NavLink>
                    );
                })}

            </nav>


            {/* Logout */}
            <div className="border-t border-gray-200 p-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50"
                >
                    <LogOut size={16} />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default AccountSidebar;
