import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdBannerSlider({ slot = 1 }) {
    const [banners, setBanners] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        axios.get(`${backendUrl}/ad-banners/active?slot=${slot}`)
            .then(res => {
                if (res.data.success) {
                    setBanners(res.data.banners || []);
                }
            })
            .catch(console.error);
    }, [backendUrl, slot]);

    // Single banner fallback (no loop or controls needed)
    if (banners.length === 0) return null;

    if (banners.length === 1) {
        const banner = banners[0];
        return (
            <div className="relative w-full overflow-hidden rounded-none aspect-auto md:aspect-[6/1] bg-[#f8f8f8]">
                <div className="w-full h-auto md:h-full flex-none overflow-hidden relative">
                    {banner.link ? (
                        <Link to={banner.link} className="block w-full h-full group/item">
                            <img 
                                src={banner.image} 
                                alt="Ad Banner" 
                                className="w-full h-auto md:h-full object-contain block transition-transform duration-1000 group-hover/item:scale-105" 
                            />
                        </Link>
                    ) : (
                        <img 
                            src={banner.image} 
                            alt="Ad Banner" 
                            className="w-full h-auto md:h-full object-contain block" 
                        />
                    )}
                </div>
            </div>
        );
    }

    return <AdBannerSliderCarousel banners={banners} />;
}

function AdBannerSliderCarousel({ banners }) {
    // Extended array: [Last, ...Originals, First]
    const slides = useMemo(() => {
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    const [currentIndex, setCurrentIndex] = useState(1);
    const [enableTransition, setEnableTransition] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Reset when banners change
    useEffect(() => {
        setCurrentIndex(1);
        setEnableTransition(false);
        setIsAnimating(false);
    }, [banners]);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setEnableTransition(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setEnableTransition(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isAnimating]);

    const handleTransitionEnd = () => {
        setIsAnimating(false);
        if (currentIndex === slides.length - 1) {
            // Reached clone of first slide at end -> silently snap to real first slide (index 1)
            setEnableTransition(false);
            setCurrentIndex(1);
        } else if (currentIndex === 0) {
            // Reached clone of last slide at start -> silently snap to real last slide (index slides.length - 2)
            setEnableTransition(false);
            setCurrentIndex(slides.length - 2);
        }
    };

    // Auto-advance every 4s unless hovered
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused, nextSlide]);

    const [touchStartX, setTouchStartX] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    const activeDot = (currentIndex - 1 + banners.length) % banners.length;

    return (
        <div 
            className="relative w-full overflow-hidden rounded-none group aspect-auto md:aspect-[6/1] transition-all duration-700 isolate bg-[#f8f8f8]"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div 
                className={`flex h-auto md:h-full w-full transform-gpu backface-hidden will-change-transform ${
                    enableTransition 
                        ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                        : ""
                }`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTransitionEnd={handleTransitionEnd}
            >
                {slides.map((banner, idx) => (
                    <div key={`${banner.id || idx}-${idx}`} className="w-full h-auto md:h-full flex-none overflow-hidden relative">
                        {banner.link ? (
                            <Link to={banner.link} className="block w-full h-full group/item">
                                <img 
                                    src={banner.image} 
                                    alt="Ad Banner" 
                                    className="w-full h-auto md:h-full object-contain block transition-transform duration-1000 group-hover/item:scale-105" 
                                />
                            </Link>
                        ) : (
                            <img 
                                src={banner.image} 
                                alt="Ad Banner" 
                                className="w-full h-auto md:h-full object-contain block" 
                            />
                        )}
                    </div>
                ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                aria-label="Previous ad banner"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                aria-label="Next ad banner"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isAnimating) return;
                            setIsAnimating(true);
                            setEnableTransition(true);
                            setCurrentIndex(idx + 1);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            idx === activeDot ? "bg-pink-300 border border-white shadow-sm" : "bg-white/50 border border-slate-300 hover:bg-white/80"
                        }`}
                        aria-label={`Go to ad slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
