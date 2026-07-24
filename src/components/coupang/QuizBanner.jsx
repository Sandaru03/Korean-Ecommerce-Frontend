import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function QuizBanner() {
    const [bannerData, setBannerData] = useState({
        image: "/Skin.jpg.jpeg",
        link: "/quiz",
        isActive: true
    });

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/quiz-banner`);
                if (data.success && data.banner) {
                    setBannerData({
                        image: data.banner.image || "/Skin.jpg.jpeg",
                        link: data.banner.link || "/quiz",
                        isActive: data.banner.isActive ?? true
                    });
                }
            } catch (err) {
                console.error("Error fetching quiz banner:", err);
            }
        };
        fetchBanner();
    }, []);

    if (!bannerData.isActive) {
        return null; // Don't render if hidden
    }

    return (
        <section className="mb-0 relative group overflow-hidden">
            <div className="min-w-full shrink-0 relative">
                <Link to={bannerData.link} className="block w-full h-full group/item overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
                    <img 
                        src={bannerData.image} 
                        alt="Skin Type Quiz" 
                        className="w-full h-auto block bg-[#f8f8f8] transition-transform duration-1000 group-hover/item:scale-105" 
                    />
                    <div className="absolute bottom-10 left-10 z-20 transition-all duration-500 transform translate-y-2 group-hover/item:translate-y-0 opacity-0 group-hover/item:opacity-100 hidden md:block">
                        <span className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-lg text-sm uppercase tracking-wider">Take the Quiz</span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
