import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, X, Play, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ReelsSection() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReel, setSelectedReel] = useState(null);
    const scrollRef = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        axios.get(`${backendUrl}/reels/active`)
            .then(res => {
                if (res.data.success) {
                    setReels(res.data.reels);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [backendUrl]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const cardWidth = clientWidth / 4;
            const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading || reels.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Hot in SNS
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Container — shows exactly 4 reels at once */}
                <div 
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {reels.map((reel) => (
                        <div 
                            key={reel.id} 
                            className="flex-shrink-0 snap-start"
                            style={{ width: 'calc(25% - 9px)' }}
                            onClick={() => setSelectedReel(reel)}
                        >
                            <ReelCard reel={reel} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Reel Popup Modal */}
            {selectedReel && (
                <ReelModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
            )}
            
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}

function ProductOverlay({ product, className = "" }) {
    const navigate = useNavigate();
    
    const resolveImage = (p) => {
        if (!p) return "/defult-product.jpg";
        let imgs = p.images;
        if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
        if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
        return "/defult-product.jpg";
    };

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    };

    return (
        <div 
            onClick={handleClick}
            className={`flex items-center gap-4 p-3 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-black/80 transition-all group/prod ${className}`}
        >
            <div className="relative w-16 h-16 flex-shrink-0">
                <img 
                    src={resolveImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-contain bg-white rounded-xl shadow-lg border border-white/5"
                />
            </div>
            <div className="flex-1 min-w-0 pr-1">
                <p className="text-white text-[13px] font-bold truncate leading-tight mb-1.5">
                    {product.name}
                </p>
                <div className="flex items-center gap-2.5">
                    <span className="text-white text-[13px] font-black">
                        Rs.{product.price.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ReelCard({ reel }) {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div 
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={reel.videoUrl}
                className="w-full h-full object-contain bg-black"
                loop
                playsInline
                muted
                preload="metadata"
            />
            
            {/* Play overlay when not hovered */}
            <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Play className="text-white/40" size={32} fill="currentColor" />
            </div>

            {/* Product Overlay */}
            {reel.product && (
                <div className="absolute inset-x-2 bottom-2 z-10">
                    <ProductOverlay product={reel.product} />
                </div>
            )}

            {/* Title Gradient Background (only if no product or when product is minimal) */}
            {!reel.product && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-[10px] font-semibold truncate uppercase tracking-wider">
                        {reel.title}
                    </p>
                </div>
            )}
        </div>
    );
}

function ReelModal({ reel, onClose }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-[110]"
            >
                <X size={32} />
            </button>

            <div 
                className="relative max-h-[90vh] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 group"
                onClick={(e) => e.stopPropagation()}
            >
                <video
                    ref={videoRef}
                    src={reel.videoUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                />

                {/* Controls Overlay */}
                <div className="absolute top-6 right-6 z-20">
                    <button 
                        onClick={toggleMute}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>

                {/* Product Overlay on Modal */}
                {reel.product && (
                    <div className="absolute inset-x-6 bottom-16 z-20">
                        <ProductOverlay product={reel.product} className="p-3 bg-black/40 border-white/20" />
                    </div>
                )}

                <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between pointer-events-none">
                    <p className="text-white font-bold text-lg drop-shadow-lg">{reel.title}</p>
                </div>
            </div>
        </div>
    );
}
