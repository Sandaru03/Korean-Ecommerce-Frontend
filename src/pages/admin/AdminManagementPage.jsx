import { useEffect, useState, useMemo } from "react";
import { HiMiniPlusCircle, HiTrash } from "react-icons/hi2";
import { HiX } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: ""
    });

    const fetchAdmins = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/users/admins", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setAdmins(res.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load admins");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return admins;
        const q = query.toLowerCase();
        return admins.filter(
            (a) =>
                a.firstName?.toLowerCase().includes(q) ||
                a.lastName?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q)
        );
    }, [admins, query]);

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        axios.post(import.meta.env.VITE_BACKEND_URL + "/users/admins", formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            toast.success(res.data.message || "Admin created successfully");
            setShowModal(false);
            setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "" });
            fetchAdmins();
        })
        .catch(err => {
            toast.error(err.response?.data?.message || "Failed to create admin");
        });
    };

    const handleDeleteAdmin = (id) => {
        if (!window.confirm("Are you sure you want to remove this admin?")) return;
        
        const token = localStorage.getItem("token");
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/admins/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            toast.success(res.data.message || "Admin removed");
            fetchAdmins();
        })
        .catch(err => {
            toast.error(err.response?.data?.message || "Failed to remove admin");
        });
    };

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage users with administrative privileges</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-11 w-full max-w-xs rounded-xl border border-slate-200 px-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Search admins..."
                    />
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-md whitespace-nowrap"
                    >
                        <HiMiniPlusCircle className="text-xl" />
                        <span>Add Admin</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20"><Loader /></div>
            ) : (
                <div className="overflow-hidden shadow-sm ring-1 ring-slate-200 rounded-2xl bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-5">Name</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Phone</th>
                                <th className="p-5">Joined Date</th>
                                <th className="p-5 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {admin.firstName[0]}
                                            </div>
                                            <div className="font-medium text-slate-900">
                                                {admin.firstName} {admin.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-slate-600">{admin.email}</td>
                                    <td className="p-5 text-slate-600">{admin.phone || "N/A"}</td>
                                    <td className="p-5 text-slate-500 text-sm">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Admin"
                                            >
                                                <HiTrash className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td className="p-10 text-center text-slate-500" colSpan={5}>
                                        No administrators found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="text-lg font-bold">Register New Admin</h3>
                            <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded-lg">
                                <HiX className="text-2xl" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">First Name</label>
                                    <input 
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Samee"
                                        value={formData.firstName}
                                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Last Name</label>
                                    <input 
                                        required
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Sandu"
                                        value={formData.lastName}
                                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                                <input 
                                    required
                                    type="email"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                                <input 
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="+82 10-xxxx-xxxx"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                                <input 
                                    required
                                    type="password"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                                <p className="text-[10px] text-slate-400">Must be at least 6 characters.</p>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <button 
                                    type="submit"
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                                >
                                    Create Admin Account
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
