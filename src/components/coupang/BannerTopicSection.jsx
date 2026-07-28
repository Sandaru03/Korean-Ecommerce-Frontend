import { Link } from "react-router-dom"
import { ChevronRight, Heart } from "lucide-react"
import { useState, useEffect } from "react"

import { CommonProductCard } from "./CommonProductCard"

// Removed local resolveImage and GridCard as they're now shared as CommonProductCard

export function BannerTopicSection({ title, products, bannerImage, bannerImages }) {
    // Distribute products into multiple rows for horizontal scrolling
    const distributeProducts = (arr, numRows) => {
        if (!arr || !Array.isArray(arr)) return Array.from({ length: numRows }, () => []);
        const rows = Array.from({ length: numRows }, () => []);
        arr.forEach((item, idx) => {
            rows[idx % numRows].push(item);
        });
        return rows;
    };

    const mobileRows = distributeProducts(products, 3);
    const desktopRows = distributeProducts(products, 2);
    
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

    // Smooth Desktop Drag-to-Scroll Logic
    const onMouseDown = (e) => {
        const slider = e.currentTarget;
        slider.isDown = true;
        slider.didDrag = false; 
        slider.startX = e.pageX - slider.offsetLeft;
        slider.scrollLeftStart = slider.scrollLeft;
        slider.style.scrollSnapType = 'none'; // Temporarily disable snap for buttery smooth drag
    };
    const onMouseMove = (e) => {
        const slider = e.currentTarget;
        if (!slider.isDown) return;
        
        // If the user released the mouse outside the container, cancel the drag
        if (e.buttons !== 1) {
            slider.isDown = false;
            slider.style.scrollSnapType = 'x mandatory';
            return;
        }

        e.preventDefault(); // Stop text/image highlighting
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - slider.startX) * 1.5; // Scroll speed multiplier
        if (Math.abs(walk) > 5) {
            slider.didDrag = true; // Mark as dragged to prevent accidental clicks
        }
        slider.scrollLeft = slider.scrollLeftStart - walk;
    };
    const onMouseUpOrLeave = (e) => {
        const slider = e.currentTarget;
        slider.isDown = false;
        slider.style.scrollSnapType = 'x mandatory'; // Restore snapping
    };
    const onClickCapture = (e) => {
        if (e.currentTarget.didDrag) {
            e.stopPropagation();
            e.preventDefault();
            e.currentTarget.didDrag = false;
        }
    };

    const dragEvents = {
        onMouseDown,
        onMouseLeave: onMouseUpOrLeave,
        onMouseUp: onMouseUpOrLeave,
        onMouseMove,
        onClickCapture,
        onDragStart: (e) => e.preventDefault() // Stop native browser image dragging
    };

    return (
        <section className="mb-0">
            <div className="flex flex-col md:flex-row border border-[#eee] rounded-md overflow-hidden bg-white shadow-sm">
                {/* Left: Banner Slider */}
                <div 
                    className="w-full md:w-[38%] relative overflow-hidden aspect-[3/5] md:aspect-auto bg-[#fafafa]"
                    style={{ touchAction: 'pan-y' }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {images.length > 0 ? (
                        <div className="absolute inset-0 w-full h-full group">
                            {/* Main image */}
                            {images.map((img, idx) => (
                                <img 
                                    key={`main-${idx}`}
                                    src={img} 
                                    alt={`${title} banner ${idx + 1}`} 
                                    className={`absolute inset-0 w-full h-full object-cover md:object-contain z-10 transition-all duration-1000 transform-gpu backface-hidden will-change-transform ${
                                        idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                                    }`}
                                />
                            ))}
                            {/* Slide indicators if more than one image */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
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

                {/* Right: Scrollable Product Rows */}
                <div className="flex-1 p-4 bg-white overflow-hidden min-w-0">
                    <div className="flex justify-between items-center mb-4 border-b border-[#f0f0f0] pb-2">
                        <h2 className="text-xl font-bold text-neutral-dark">{title}</h2>
                    </div>
                    
                    {/* Mobile View (3 rows) */}
                    <div className="md:hidden flex flex-col gap-4">
                        {mobileRows.map((row, i) => (
                            <div key={`mobile-row-${i}`} {...dragEvents} className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2 cursor-grab select-none">
                                {row.map(p => (
                                    <div key={p.id} className="snap-start w-[140px] shrink-0">
                                        <CommonProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Desktop View (2 rows) */}
                    <div className="hidden md:flex flex-col gap-5">
                        {desktopRows.map((row, i) => (
                            <div key={`desktop-row-${i}`} {...dragEvents} className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2 cursor-grab select-none">
                                {row.map(p => (
                                    <div key={p.id} className="snap-start w-[180px] lg:w-[200px] xl:w-[220px] shrink-0">
                                        <CommonProductCard product={p} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
