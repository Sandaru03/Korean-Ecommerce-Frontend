import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdBannerSlider() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        axios.get(`${backendUrl}/ad-banners/active`)
            .then(res => {
                if (res.data.success) setBanners(res.data.banners);
            })
            .catch(console.error);
    }, [backendUrl]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="relative w-full overflow-hidden rounded-xl mb-14 group bg-slate-100 border border-slate-200 shadow-sm min-h-[180px] md:min-h-0 md:aspect-[8/1]">
            <div 
                className="flex h-full w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="w-full h-full flex-none bg-[#f8f8f8]">
                        {banner.link ? (
                            <Link to={banner.link} className="block w-full h-full">
                                <img src={banner.image} alt="Ad Banner" className="w-full h-full object-contain block" />
                            </Link>
                        ) : (
                            <img src={banner.image} alt="Ad Banner" className="w-full h-full object-contain block" />
                        )}
                    </div>
                ))}
            </div>
            
            {/* Navigation buttons */}
            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                    idx === currentIndex ? "bg-blue-600 border border-white" : "bg-white/50 border border-slate-300 hover:bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
