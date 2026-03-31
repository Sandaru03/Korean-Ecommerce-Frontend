import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    User, Mail, Phone, ShieldCheck, ShieldOff,
    LogOut, ChevronRight, Clock, Package, X, Save
} from "lucide-react";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
        if (activeTab === "orders") {
            fetchOrders();
        }
    }, [navigate, activeTab]);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setOrdersLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(res.data.orders || []);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchProfile = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { state: { from: "/profile" } });
            return;
        }

        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data);
                setEditForm({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    phone: res.data.phone || ""
                });
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load profile");
                setLoading(false);
            });
    };

    function handleLogout() {
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/");
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/users`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data.user);
            toast.success("Profile updated successfully");
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
    const joinDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "—";

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans">
            <Header />

            <div className="mx-auto max-w-[1040px] px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Sidebar / Profile Summary */}
                    <div className="w-full md:w-80 shrink-0 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                            <div className="relative inline-block mb-4">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
                                        {initials}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                                    {user.isBlock ? <ShieldOff className="h-4 w-4 text-red-500" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>

                            
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <MenuLink 
                                icon={<User className="h-4 w-4" />} 
                                label="Account Information" 
                                active={activeTab === "profile"} 
                                onClick={() => setActiveTab("profile")}
                            />
                            <MenuLink 
                                icon={<Package className="h-4 w-4" />} 
                                label="My Orders" 
                                active={activeTab === "orders"}
                                onClick={() => setActiveTab("orders")}
                            />
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === "profile" ? (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h1 className="text-xl font-bold text-gray-900">Account Details</h1>
                                    <p className="text-sm text-gray-500">Manage your personal information and account settings.</p>
                                </div>
                                
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <InfoItem label="First Name" value={user.firstName} />
                                    <InfoItem label="Last Name" value={user.lastName} />
                                    <InfoItem label="Email Address" value={user.email} />
                                    <InfoItem label="Phone Number" value={user.phone || "Not provided"} />

                                    <InfoItem label="Member Since" value={joinDate} />
                                    <InfoItem label="Account Status" value={user.isBlock ? "Blocked" : "Active"} 
                                        valueColor={user.isBlock ? "text-red-600" : "text-emerald-600"} 
                                    />
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-lg">
                                    <button 
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <OrdersListView 
                                orders={orders} 
                                loading={ordersLoading} 
                                onBrowse={() => navigate("/")} 
                            />
                        )}
                    </div>

                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    ) : (
                                        <><Save className="h-4 w-4" /> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

function MenuLink({ icon, label, active = false, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${active ? "bg-primary/5 text-primary border-primary font-bold" : "text-gray-600 border-transparent hover:bg-gray-50 font-normal"}`}
        >
            {icon}
            {label}
        </button>
    );
}

function OrdersListView({ orders, loading, onBrowse }) {
    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-sm text-gray-500">Loading your orders...</p>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't placed any orders with us yet. Start exploring our collection!</p>
                <button 
                    onClick={onBrowse}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-900 px-1">Order History ({orders.length})</h2>
            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-gray-300 transition-colors">
                    <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                        <div className="space-y-1">
                            <p className="text-xs font-black text-gray-400 tracking-wider uppercase">Order ID</p>
                            <p className="text-sm font-bold text-gray-900">#{order.orderId}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-gray-400 tracking-wider uppercase">Date Placed</p>
                            <p className="text-sm font-medium text-gray-700">
                                {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-gray-400 tracking-wider uppercase">Total Amount</p>
                            <p className="text-sm font-black text-primary">LKR {Number(order.total).toLocaleString()}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                    <div className="p-5">
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {(() => {
                                let items = order.items;
                                if (typeof items === "string") {
                                    try { items = JSON.parse(items); } catch { items = []; }
                                }
                                if (!Array.isArray(items)) items = [];
                                
                                return items.map((item, idx) => (
                                    <div key={idx} className="shrink-0 flex items-center gap-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
                                        <div className="w-14 h-14 rounded-md bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="min-w-[120px] max-w-[200px]">
                                            <p className="text-[12px] font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                                            <p className="text-[11px] text-gray-500">Qty: {item.qty} × LKR {Number(item.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        pending: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            icon: <Clock className="h-3 w-3" />
        },
        shipped: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            icon: <Package className="h-3 w-3" />
        },
        delivered: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            icon: <ShieldCheck className="h-3 w-3" />
        },
        cancelled: {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-200",
            icon: <ShieldOff className="h-3 w-3" />
        }
    };

    const config = configs[status.toLowerCase()] || configs.pending;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} text-[11px] font-black uppercase tracking-tight`}>
            {config.icon}
            {status}
        </div>
    );
}

function InfoItem({ label, value, className = "", valueColor = "text-gray-900" }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className={`text-base font-medium ${valueColor} ${className}`}>{value}</p>
        </div>
    );
}
