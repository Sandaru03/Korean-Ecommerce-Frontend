import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, X, Play } from 'lucide-react';

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
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
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

                {/* Horizontal Scroll Container */}
                <div 
                    ref={scrollRef}
                    className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {reels.map((reel) => (
                        <div 
                            key={reel.id} 
                            className="min-w-[110px] sm:min-w-[140px] md:min-w-[170px] snap-start"
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
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                preload="metadata"
            />
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Play className="text-white/50" size={32} fill="currentColor" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-[10px] font-semibold truncate uppercase tracking-wider">
                    {reel.title}
                </p>
            </div>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>

            <div 
                className="relative max-h-[90vh] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
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

                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                    <p className="text-white font-bold text-lg">{reel.title}</p>
                    <button 
                        onClick={toggleMute}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
