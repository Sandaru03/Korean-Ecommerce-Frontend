import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function login(e) {
        e?.preventDefault();
        axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                toast.success("Login Successful");
                if (res.data.role === "admin") navigate("/admin");
                else navigate("/");
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Login Failed");
            });
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="absolute inset-0 bg-black/50 md:bg-black/30" />

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8 text-white">
                    <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>

                    <form onSubmit={login} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 font-semibold text-white transition-all active:scale-[0.98] mt-2"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
