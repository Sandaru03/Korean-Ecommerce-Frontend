import { Link } from "react-router-dom"
import { ChevronRight, Heart } from "lucide-react"
import { useState, useEffect } from "react"

import { CommonProductCard } from "./CommonProductCard"

// Removed local resolveImage and GridCard as they're now shared as CommonProductCard

export function BannerTopicSection({ title, products, bannerImage, bannerImages }) {
    // Show only 6 products in a 3x2 grid
    const displayProducts = products.slice(0, 6)
    
    // Normalize images: use bannerImages array, or fallback to bannerImage string
    const images = (Array.isArray(bannerImages) && bannerImages.filter(Boolean).length > 0)
        ? bannerImages.filter(Boolean)
        : (bannerImage ? [bannerImage] : [])

    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-slide every 5 seconds if there's more than 1 image
    useEffect(() => {
        if (images.length <= 1) return
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [images.length])

    const [touchStartX, setTouchStartX] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                setCurrentIndex(prev => (prev + 1) % images.length);
            } else {
                setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
            }
        }
    };

    return (
        <section className="mb-0">
            <div className="flex flex-col md:flex-row border border-[#eee] rounded-md overflow-hidden bg-white shadow-sm">
                {/* Left: Banner Slider */}
                <div 
                    className="w-full md:w-[38%] relative overflow-hidden aspect-[4/5] md:aspect-auto bg-[#fafafa]"
                    style={{ touchAction: 'pan-y' }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {images.length > 0 ? (
                        <div className="absolute inset-0 w-full h-full group">
                            {/* Ambient Blurred Background to Fill Empty Space */}
                            {images.map((img, idx) => (
                                <img 
                                    key={`blur-${idx}`}
                                    src={img} 
                                    alt="" 
                                    className={`absolute inset-0 w-full h-full object-cover blur-2xl transition-all duration-1000 transform-gpu backface-hidden will-change-transform ${
                                        idx === currentIndex ? "opacity-40 scale-110" : "opacity-0 scale-125"
                                    }`}
                                />
                            ))}

                            {/* Main non-cropped Image */}
                            {images.map((img, idx) => (
                                <img 
                                    key={`main-${idx}`}
                                    src={img} 
                                    alt={`${title} banner ${idx + 1}`} 
                                    className={`absolute inset-0 w-full h-full object-contain z-10 transition-all duration-1000 transform-gpu backface-hidden will-change-transform ${
                                        idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                                    }`}
                                />
                            ))}
                            {/* Slide indicators if more than one image */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                                idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Banner
                        </div>
                    )}
                </div>

                {/* Right: Product Grid (3x2) */}
                <div className="flex-1 p-4 bg-white">
                    <div className="flex justify-between items-center mb-4 border-b border-[#f0f0f0] pb-2">
                        <h2 className="text-xl font-bold text-neutral-dark">{title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {displayProducts.map(p => (
                            <CommonProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
