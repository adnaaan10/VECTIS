
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    Package,
    Layers,
    Tag,
    Boxes,
    ShoppingCart,
    Undo2,
    Ticket,
    Users,
    BarChart3,
    LogOut,
    ShieldCheck,
} from "lucide-react";

import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";


const NAV = [
    { label: "Products", to: "/admin/products", icon: Package, enabled: false },
    { label: "Categories", to: "/admin/categories", icon: Layers, enabled: false },
    { label: "Brands", to: "/admin/brands", icon: Tag, enabled: false },
    { label: "Variants", to: "/admin/variants", icon: Boxes, enabled: false },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart, enabled: false },
    { label: "Returns & Refunds", to: "/admin/returns", icon: Undo2, enabled: false },
    { label: "Coupons", to: "/admin/coupons", icon: Ticket, enabled: false },
    { label: "Customers", to: "/admin/customers", icon: Users, enabled: true },
    { label: "Sales Analytics", to: "/admin/analytics", icon: BarChart3, enabled: false },
];


const getInitials = (user) => {
    const firstName = user?.first_name || "";
    const lastName = user?.last_name || "";

    if (firstName || lastName) {
        return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    }

    return (user?.email || "A")[0].toUpperCase();
};


const AdminSidebar = ({ open, onClose }) => {

    const { user, logout } = useAuth();

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [busy, setBusy] = useState(false);


    // Logout
    const handleLogout = async () => {

        if (busy) return;

        setBusy(true);

        try {
            await logout();
        } catch (error) {
            toast.error("Logout request failed.");
        } finally {
            navigate("/login", { replace: true });
            setBusy(false);
        }
    };


    // Admin name
    const name = user?.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user?.email || "Administrator";


    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-40
                flex w-72 flex-col
                border-r border-gray-200 bg-white
                transition-transform duration-300
                lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}
        >

            {/* Brand */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                <div className="flex items-center gap-2">

                    <span className="font-heading text-lg font-bold tracking-widest">
                        VECTIS
                    </span>

                    <span className="flex items-center gap-1 rounded-sm bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                        <ShieldCheck className="h-3 w-3" />
                        Admin
                    </span>

                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:text-black lg:hidden"
                    aria-label="Close sidebar"
                >
                    ✕
                </button>

            </div>


            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">

                {NAV.map(({ label, to, icon: Icon, enabled }) => {

                    const active =
                        pathname === to ||
                        pathname.startsWith(`${to}/`);

                    const className = `
                        flex w-full items-center gap-3
                        rounded-sm px-3 py-2.5
                        text-[12px] font-semibold uppercase tracking-widest
                        transition-colors
                        ${
                            active
                                ? "bg-black text-white"
                                : enabled
                                    ? "text-gray-600 hover:bg-gray-100 hover:text-black"
                                    : "text-gray-400 hover:bg-gray-50"
                        }
                    `;

                    const content = (
                        <>
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                        </>
                    );

                    return enabled ? (

                        <Link
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={className}
                            aria-current={active ? "page" : undefined}
                        >
                            {content}
                        </Link>

                    ) : (

                        <button
                            key={to}
                            type="button"
                            className={className}
                            onClick={() =>
                                toast.info(`${label} module is coming soon.`)
                            }
                        >
                            {content}
                        </button>

                    );

                })}

            </nav>


            {/* Admin profile and logout */}
            <div className="border-t border-gray-200 p-4">

                <div className="flex items-center gap-3 rounded-sm bg-gray-50 p-3">

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {getInitials(user)}
                    </div>


                    {/* Admin details */}
                    <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-900">
                            {name}
                        </p>

                        <p className="text-[10px] uppercase tracking-widest text-gray-500">
                            Administrator
                        </p>

                    </div>


                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={busy}
                        aria-label="Logout"
                        title="Logout"
                        className="text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>

                </div>

            </div>

        </aside>
    );
};

export default AdminSidebar;
