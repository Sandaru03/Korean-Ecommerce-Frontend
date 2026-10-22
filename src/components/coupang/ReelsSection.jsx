import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, X, Play, Pause, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

export function ReelsSection() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
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
            const cardsToShow = window.innerWidth < 1024 ? 2.2 : 4;
            const cardWidth = clientWidth / cardsToShow;
            const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading || reels.length === 0) return null;

    const currentReel = selectedIndex !== null ? reels[selectedIndex] : null;

    return (
        <section className="mb-0">
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#111] tracking-tight">
                    Featured Videos
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -webkit-overflow-scrolling-touch"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {reels.map((reel, idx) => (
                    <div 
                        key={reel.id} 
                        className="flex-shrink-0 snap-start w-[calc(44%-6px)] md:w-[calc(25%-9px)] lg:w-[calc(25%-9px)]"
                        onClick={() => setSelectedIndex(idx)}
                    >
                        <ReelCard reel={reel} />
                    </div>
                ))}
            </div>

            {/* Reel Popup Modal */}
            {currentReel && (
                <ReelModal 
                    reel={currentReel} 
                    onClose={() => setSelectedIndex(null)} 
                    onNext={() => setSelectedIndex((prev) => (prev + 1) % reels.length)}
                    onPrev={() => setSelectedIndex((prev) => (prev - 1 + reels.length) % reels.length)}
                    hasNext={reels.length > 1}
                    hasPrev={reels.length > 1}
                />
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
    const { formatPrice } = useCurrency();
    
    const resolveImage = (p) => {
        if (!p) return "/default-product.jpg";
        let imgs = p.images;
        if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
        if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]) return imgs[0];
        return "/default-product.jpg";
    };

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    };

    return (
        <div 
            onClick={handleClick}
            className={`flex items-center gap-2 sm:gap-4 p-1.5 sm:p-3 bg-black/70 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 hover:bg-black/80 transition-all group/prod ${className}`}
        >
            <div className="relative w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0">
                <img 
                    src={resolveImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-contain bg-white rounded-lg sm:rounded-xl shadow-lg border border-white/5"
                />
            </div>
            <div className="flex-1 min-w-0 pr-1">
                <p className="text-white text-[10px] sm:text-[13px] font-bold truncate leading-tight mb-0.5 sm:mb-1.5">
                    {product.name}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                    <span className="text-white text-[10px] sm:text-[13px] font-black">
                        {formatPrice(product.price)}
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
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
            style={{
                borderRadius: '16px',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                isolation: 'isolate',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 
              object-contain ensures the video is NEVER zoomed in and the upper section is never cut off.
              No black border or background to prevent any outline on hover.
              pointerEvents: 'none' stops Edge/Chromium hover menu bars.
            */}
            <video
                ref={videoRef}
                src={`${reel.videoUrl}#t=0.001`}
                className="w-full h-full object-contain rounded-2xl pointer-events-none select-none"
                style={{
                    pointerEvents: 'none',
                    borderRadius: '16px',
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
                loop
                playsInline
                muted
                preload="metadata"
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback"
                tabIndex={-1}
            />
            
            {/* Play icon overlay when not hovered */}
            <div className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Play className="text-white/70 drop-shadow-md" size={32} fill="currentColor" />
            </div>

            {/* Product Overlay */}
            {reel.product && (
                <div className="absolute inset-x-2 bottom-2 z-10">
                    <ProductOverlay product={reel.product} />
                </div>
            )}

            {/* Title Gradient Background (when no product is linked) */}
            {!reel.product && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <p className="text-white text-[11px] font-semibold truncate tracking-wide">
                        {reel.title}
                    </p>
                </div>
            )}
        </div>
    );
}

function ReelModal({ reel, onClose, onNext, onPrev, hasNext, hasPrev }) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayStateIcon, setShowPlayStateIcon] = useState(false);
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    useEffect(() => {
        // Prevent body scrolling while modal is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Keyboard navigation (Esc to close, Left/Right/Up/Down to navigate reels, Space/M)
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                if (hasNext && onNext) onNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                if (hasPrev && onPrev) onPrev();
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.key === 'm' || e.key === 'M') {
                setIsMuted(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onNext, onPrev, hasNext, hasPrev]);

    // Handle auto-playback on reel change
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        // If browser blocks unmuted autoplay, mute and retry
                        setIsMuted(true);
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                        }
                    });
            }
        }
    }, [reel.id]);

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        setShowPlayStateIcon(true);
        setTimeout(() => setShowPlayStateIcon(false), 600);
    };

    const resolveProductImage = (p) => {
        if (!p) return "/default-product.jpg";
        let imgs = p.images;
        if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
        if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]) return imgs[0];
        return "/default-product.jpg";
    };

    return (
        <div 
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200 select-none"
            onClick={onClose}
        >
            {/* Desktop Outside Close Button */}
            <button 
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-[110] border border-white/10"
                aria-label="Close reel"
                title="Close (Esc)"
            >
                <X size={26} />
            </button>

            {/* Desktop Previous Reel Button */}
            {hasPrev && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/15 transition-all mr-6 hover:scale-110 active:scale-95 z-[110]"
                    aria-label="Previous reel"
                    title="Previous Reel (Arrow Left)"
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            {/* Phone-styled Reel Container (Edge-to-edge on mobile, 9:16 phone card on desktop) */}
            <div 
                className="relative w-full h-full sm:h-[90vh] sm:max-h-[850px] sm:w-auto sm:aspect-[9/16] sm:rounded-3xl overflow-hidden bg-black shadow-2xl sm:border sm:border-white/15 animate-in zoom-in-95 duration-200 flex flex-col justify-center"
                style={{
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    isolation: 'isolate',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Reel Video Player */}
                <video
                    ref={videoRef}
                    key={reel.id}
                    src={`${reel.videoUrl}#t=0.001`}
                    className="w-full h-full object-contain cursor-pointer bg-black sm:rounded-3xl"
                    style={{
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    }}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload nofullscreen noremoteplayback"
                    onClick={togglePlay}
                />

                {/* Brief Play/Pause Animation Indicator */}
                {showPlayStateIcon && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white animate-in zoom-in-75 fade-out duration-500">
                            {isPlaying ? <Play size={32} fill="white" /> : <Pause size={32} fill="white" />}
                        </div>
                    </div>
                )}

                {/* Top Controls Overlay */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30 pointer-events-none">
                    {/* Sound Mute/Unmute */}
                    <button 
                        onClick={toggleMute}
                        className="p-2.5 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all border border-white/15 pointer-events-auto shadow-lg"
                        title={isMuted ? "Unmute (M)" : "Mute (M)"}
                        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    {/* Mobile Close Button (inside container for instant access on small screens) */}
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all border border-white/15 pointer-events-auto shadow-lg md:hidden"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Bottom Overlay: Title & Linked Product */}
                <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-4 sm:px-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-20 flex flex-col gap-2.5">
                    {/* Reel Title */}
                    {reel.title && (
                        <p className="text-white font-bold text-[14px] sm:text-[16px] drop-shadow-lg leading-snug line-clamp-2">
                            {reel.title}
                        </p>
                    )}

                    {/* Product Card (Shop Call-to-action) */}
                    {reel.product && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                navigate(`/product/${reel.product.id}`);
                            }}
                            className="flex items-center gap-3 p-2.5 sm:p-3 bg-black/65 hover:bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 transition-all pointer-events-auto cursor-pointer group/shop shadow-xl active:scale-[0.99]"
                        >
                            <img 
                                src={resolveProductImage(reel.product)} 
                                alt={reel.product.name} 
                                className="w-11 h-11 sm:w-14 sm:h-14 object-contain bg-white rounded-xl shadow-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 pr-1">
                                <p className="text-white text-[11px] sm:text-[13px] font-bold truncate leading-tight mb-1">
                                    {reel.product.name}
                                </p>
                                <span className="text-[#25D366] font-extrabold text-[12px] sm:text-[14px]">
                                    {formatPrice(reel.product.price)}
                                </span>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-white text-black text-[11px] sm:text-[12px] font-extrabold group-hover/shop:bg-[#25D366] group-hover/shop:text-white transition-colors flex items-center gap-1.5 shrink-0 shadow-md">
                                <ShoppingBag size={14} />
                                <span>Shop</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Next Reel Button */}
            {hasNext && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/15 transition-all ml-6 hover:scale-110 active:scale-95 z-[110]"
                    aria-label="Next reel"
                    title="Next Reel (Arrow Right)"
                >
                    <ChevronRight size={28} />
                </button>
            )}
        </div>
    );
}

