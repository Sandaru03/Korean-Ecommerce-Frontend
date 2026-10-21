import { Link } from "react-router-dom"
import { ChevronRight, Heart } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { CommonProductCard } from "./CommonProductCard"

// Removed local resolveImage and GridCard as they're now shared as CommonProductCard

export function BannerTopicSection({ title, products, bannerImage, bannerImages, mobileBannerImages }) {
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
    
    // Normalize unified images (supports bannerImages, fallback to mobileBannerImages or legacy bannerImage)
    const images = (Array.isArray(bannerImages) && bannerImages.filter(Boolean).length > 0)
        ? bannerImages.filter(Boolean)
        : (Array.isArray(mobileBannerImages) && mobileBannerImages.filter(Boolean).length > 0)
            ? mobileBannerImages.filter(Boolean)
            : (bannerImage ? [bannerImage] : []);

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 5 seconds if there's more than 1 image
    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    // Measure right column height to ensure ALL desktop topic banners match Today's Deals 3:5 ratio
    const rightColRef = useRef(null);
    const [desktopBannerWidth, setDesktopBannerWidth] = useState(null);

    useEffect(() => {
        if (!rightColRef.current) return;
        const updateWidth = () => {
            if (window.innerWidth >= 768 && rightColRef.current) {
                const h = Math.max(rightColRef.current.offsetHeight, 520);
                setDesktopBannerWidth(Math.round(h * (3 / 5)));
            } else {
                setDesktopBannerWidth(null);
            }
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(rightColRef.current);
        window.addEventListener('resize', updateWidth);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

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
        <section className="w-full">
            <div className="flex flex-col md:flex-row border border-[#eee] rounded-md overflow-hidden bg-white shadow-sm items-stretch md:min-h-[520px]">
                {/* Left: Banner Slider (Standard 3:5 Ratio for 100% Zero Crop & Standard Dimensions) */}
                <div 
                    className="w-full shrink-0 relative overflow-hidden aspect-[3/5] md:aspect-auto bg-[#fafafa] md:min-h-[520px]"
                    style={{ 
                        ...(desktopBannerWidth ? { width: `${desktopBannerWidth}px` } : {}),
                        touchAction: 'pan-y' 
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {images.length > 0 ? (
                        <div className="absolute inset-0 w-full h-full group">
                            {/* Unified edge-to-edge fit without crop or distortion */}
                            {images.map((img, idx) => (
                                <img 
                                    key={`banner-${idx}`}
                                    src={img} 
                                    alt={`${title} banner ${idx + 1}`} 
                                    className={`absolute inset-0 w-full h-full object-cover object-center z-10 transition-opacity duration-700 ${
                                        idx === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
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
                                                idx === currentIndex ? "w-4 bg-white shadow-sm" : "w-1.5 bg-white/60"
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
                <div ref={rightColRef} className="flex-1 p-4 bg-white overflow-hidden min-w-0 flex flex-col justify-between md:min-h-[520px]">
                    <div className="flex justify-between items-center mb-4 border-b border-[#f0f0f0] pb-2">
                        <h2 className="text-xl font-bold text-neutral-dark">{title}</h2>
                    </div>
                    
                    {/* Mobile View (3 rows) */}
                    {products && products.length > 0 ? (
                        <div className="md:hidden flex flex-col gap-3.5">
                            {mobileRows.map((row, i) => (
                                <div key={`mobile-row-${i}`} {...dragEvents} className="flex gap-2.5 overflow-x-auto snap-x scrollbar-hide pb-2 cursor-grab select-none">
                                    {row.map(p => (
                                        <div key={p.id} className="snap-start w-[calc((100%-20px)/2.35)] min-w-[112px] max-w-[136px] shrink-0">
                                            <CommonProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="md:hidden flex items-center justify-center text-gray-400 py-8">
                            <p className="text-xs font-medium">Products coming soon</p>
                        </div>
                    )}

                    {/* Desktop View (2 rows) */}
                    {products && products.length > 0 ? (
                        <div className="hidden md:flex flex-col gap-4 flex-1 justify-center">
                            {desktopRows.map((row, i) => (
                                <div key={`desktop-row-${i}`} {...dragEvents} className="flex gap-3.5 overflow-x-auto snap-x scrollbar-hide pb-2 cursor-grab select-none">
                                    {row.map(p => (
                                        <div key={p.id} className="snap-start w-[150px] lg:w-[165px] xl:w-[178px] shrink-0">
                                            <CommonProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 py-20">
                            <p className="text-sm font-medium">Products coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
