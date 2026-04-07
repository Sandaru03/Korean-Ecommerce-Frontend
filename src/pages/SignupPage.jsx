import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users`,
                formData
            );
            toast.success(res.data.message || "Account created successfully!");
            navigate("/login"); // go to login so they can sign in
        } catch (error) {
            toast.error(
                error.response?.data?.message || 
                "We couldn't create your account right now. Please check your details and try again!"
            );
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            {/* Subtle background circles for a premium feel */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse delay-1000" />

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 py-12">
                {/* Logo Section */}
                <Link to="/" className="mb-8 transition-transform hover:scale-105 active:scale-95 duration-300">
                    <img src="/logo-crop.png" alt="Samee and Sandu" className="h-12 w-auto object-contain" />
                </Link>

                <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-[#111] tracking-tight mb-2">Create Account</h1>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">Join us and start shopping quality products</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-[#111] ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                    placeholder="Samee"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-[#111] ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                    placeholder="Sandu"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-[#111] ml-1">Email address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-[#111] ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-[#111] ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-[#111] ml-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                placeholder="Repeat your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-50 pt-6">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-[#2a55ce] font-bold hover:underline transition-colors decoration-2 underline-offset-4">
                                Sign In Now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>© 2024 Samee and Sandu. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
