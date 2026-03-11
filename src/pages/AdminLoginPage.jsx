import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    function login(e) {
        e?.preventDefault();
        // Send 'username' as 'email' since the backend handles authentication through the email column
        axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email: username, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                toast.success("Admin Login Successful");
                if (res.data.role === "admin") {
                    navigate("/admin");
                } else {
                    toast.error("You are not an Admin");
                    localStorage.removeItem("token");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Admin Login Failed");
            });
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-8 text-white">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-3xl font-bold text-white">A</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-2">Admin Portal</h1>
                    <p className="text-center text-slate-400 mb-8">Secure login for administrators</p>

                    <form onSubmit={login} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="Enter admin username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="Enter admin password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] mt-4"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
