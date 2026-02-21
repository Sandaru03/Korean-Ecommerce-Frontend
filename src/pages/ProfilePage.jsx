import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    User, Mail, Phone, ShieldCheck, ShieldOff,
    LogOut, ArrowLeft, BadgeCheck, Clock
} from "lucide-react";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load profile");
                setLoading(false);
            });
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
    const joinDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "—";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col">

            {/* Top nav */}
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/10 hover:bg-red-500/30 text-white px-4 py-2 rounded-full text-sm transition"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>

            <div className="flex-1 flex items-start justify-center px-4 py-8">
                <div className="w-full max-w-2xl space-y-5">

                    {/* Avatar Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl p-8 text-center shadow-2xl">
                        {/* Background glow */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

                        {/* Avatar */}
                        {user.image ? (
                            <img
                                src={user.image}
                                alt="Profile"
                                className="relative z-10 mx-auto w-24 h-24 rounded-full object-cover ring-4 ring-purple-500/50 shadow-xl"
                            />
                        ) : (
                            <div className="relative z-10 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-purple-500/50">
                                {initials}
                            </div>
                        )}

                        <h1 className="relative z-10 mt-4 text-2xl font-bold text-white">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="relative z-10 text-sm text-white/50 mt-1 capitalize">{user.role}</p>

                        {/* Badges */}
                        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.isBlock ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                                {user.isBlock ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                                {user.isBlock ? "Account Blocked" : "Account Active"}
                            </span>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl space-y-1">
                        <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 px-1">Account Details</h2>

                        <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                        <Divider />
                        <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || "Not provided"} />
                        <Divider />
                        <DetailRow icon={<User className="h-4 w-4" />} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                        <Divider />
                        <DetailRow icon={<Clock className="h-4 w-4" />} label="Member since" value={joinDate} />
                    </div>

                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 px-1 py-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/60 shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-white truncate">{value}</p>
            </div>
        </div>
    );
}

function Divider() {
    return <div className="border-t border-white/5 mx-1" />;
}
