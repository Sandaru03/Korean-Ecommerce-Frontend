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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

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
                            <p className="text-sm text-gray-500 capitalize mb-4">{user.role}</p>
                            
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
                            <MenuLink icon={<User className="h-4 w-4" />} label="Account Information" active />
                            <MenuLink icon={<Package className="h-4 w-4" />} label="My Orders" />
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
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
                                <InfoItem label="Role" value={user.role} className="capitalize" />
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

                        {/* Placeholder for recent orders */}
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Yet</h3>
                            <p className="text-sm text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                            <button 
                                onClick={() => navigate("/")}
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                            >
                                Browse Products <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
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

function MenuLink({ icon, label, active = false }) {
    return (
        <button className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${active ? "bg-primary/5 text-primary border-primary" : "text-gray-600 border-transparent hover:bg-gray-50"}`}>
            {icon}
            {label}
        </button>
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
