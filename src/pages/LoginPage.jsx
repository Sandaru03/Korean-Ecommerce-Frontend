import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    function login(e) {
        e?.preventDefault();
        axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                toast.success("Login Successful");
                if (res.data.role === "admin") {
                    navigate("/admin");
                } else {
                    // If they came from a specific page (e.g. cart), go back — otherwise homepage
                    navigate(location.state?.from || "/");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Login Failed");
            });
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* Subtle background circles for a premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse delay-1000" />

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                {/* Logo Section */}
                <Link to="/" className="mb-8 transition-transform hover:scale-105 active:scale-95 duration-300">
                    <img src="/logo-crop.png" alt="Samee and Sandu" className="h-12 w-auto object-contain" />
                </Link>

                <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-[#111] tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={login} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-[#111] ml-1">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[13px] font-bold text-[#111]">Password</label>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-primary hover:text-[#2a55ce] font-bold hover:underline transition-colors decoration-2 underline-offset-4">
                                Sign Up Now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} Samee and Sandu. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
