import { NavLink, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { FaBoxArchive } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDashboard } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";

// Pages
import ProductAdminPage from "./admin/productAdminPage";
import AddProductPage from "./admin/addProductAdminPage";
import UpdateProductPage from "./admin/updateProduct";
import OrdersPageAdmin from "./admin/ordersPageAdmin";
import Loader from "../components/admin-utils/loader";
import ReviewsAdminPage from "./admin/reviewAdminPage";
import CustomerAdminPage from "./admin/customerAdminPage";

// Sidebar link
function SidebarLink({ to, icon: Icon, label, onClick }) {
    return (
        <NavLink
            to={to}
            end
            onClick={onClick}
            className={({ isActive }) =>
                [
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-sm font-medium",
                    "text-slate-300 hover:text-white",
                    "hover:bg-white/5",
                    isActive ? "text-white bg-white/10 shadow-inner ring-1 ring-white/10" : "",
                ].join(" ")
            }
        >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-500 opacity-0 transition-opacity group-[.active]:opacity-100" />
            <Icon className="text-xl shrink-0" />
            <span className="truncate">{label}</span>
        </NavLink>
    );
}

function DashboardHero() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-[1px] shadow-lg">
                <div className="rounded-2xl bg-slate-900/90 text-slate-100 p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Welcome back! detailed analytics and management tools are ready for you.
                    </p>
                </div>
            </div>

            {/* Quick actions */}
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 px-1">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                    { label: "Products", to: "/admin/product", icon: HiShoppingBag, color: "bg-blue-500" },
                    { label: "Orders", to: "/admin/order", icon: FaBoxArchive, color: "bg-emerald-500" },
                    { label: "Customers", to: "/admin/customers", icon: FaUser, color: "bg-orange-500" },
                    { label: "Reviews", to: "/admin/reviews", icon: FaFilePen, color: "bg-yellow-500" },
                ].map((c) => (
                    <NavLink
                        key={c.label}
                        to={c.to}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-lg transition-all hover:-translate-y-1 shadow-sm"
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <c.icon className="text-8xl" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${c.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                                <c.icon className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Manage</p>
                                <p className="font-bold text-slate-900 text-lg">{c.label}</p>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [status, setStatus] = useState("admin"); // "loading" | "admin" | "not-admin"
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Auth check - DISABLED for development
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         setStatus("not-admin");
    //         return;
    //     }
    //     axios
    //         .get(import.meta.env.VITE_BACKEND_URL + "/users/profile", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //         .then((res) => {
    //             if (res.data.role === "admin") setStatus("admin");
    //             else setStatus("not-admin");
    //         })
    //         .catch(() => setStatus("not-admin"));
    // }, []);

    // // Toast when not-admin
    // useEffect(() => {
    //     if (status === "not-admin") {
    //         toast.error("You must be logged in as admin to access this page");
    //     }
    // }, [status]);

    // if (status === "loading") return <Loader />;
    // if (status === "not-admin") return <Navigate to="/login" replace />;

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/login");
    };

    const handleGoToShop = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10 bg-slate-950">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <RiAdminFill className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Admin Panel</span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-auto md:hidden text-slate-400 hover:text-white"
                        >
                            <HiX className="text-2xl" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Overview
                        </div>
                        <SidebarLink to="/admin" icon={MdDashboard} label="Dashboard" onClick={() => setSidebarOpen(false)} />

                        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Management
                        </div>
                        <SidebarLink to="/admin/product" icon={HiShoppingBag} label="Products" onClick={() => setSidebarOpen(false)} />
                        <SidebarLink to="/admin/order" icon={FaBoxArchive} label="Orders" onClick={() => setSidebarOpen(false)} />
                        <SidebarLink to="/admin/customers" icon={FaUser} label="Customers" onClick={() => setSidebarOpen(false)} />
                        <SidebarLink to="/admin/reviews" icon={FaFilePen} label="Reviews" onClick={() => setSidebarOpen(false)} />
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/10 bg-slate-950/50">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <HiMenu className="text-xl" />
                        </button>
                        <div className="hidden md:block text-sm text-gray-500">
                            <span className="font-semibold text-gray-900">Korea Lock</span> &gt; Administration
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleGoToShop}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <IoMdHome className="text-lg" />
                            Visit Shop
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                        <Routes>
                            <Route index element={<DashboardHero />} />
                            <Route path="product" element={<ProductAdminPage />} />
                            <Route path="order" element={<OrdersPageAdmin />} />
                            <Route path="newproduct" element={<AddProductPage />} />
                            <Route path="updateproduct" element={<UpdateProductPage />} />
                            <Route path="reviews" element={<ReviewsAdminPage />} />
                            <Route path="customers" element={<CustomerAdminPage />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
