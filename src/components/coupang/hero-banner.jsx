import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ── Compute card style using ONLY transform for positioning ──────────────────
// Formula: translateX% = (targetCenter - 0.5) / cardWidthFraction - 0.5
// This keeps left:50% fixed, so ONLY transform changes during animation.
function getCardStyle(offset, screenMode) {
  let w = 0.85;
  let targets = { 0: 0.50, '-1': -0.30, 1: 1.30, '-2': -0.90, 2: 1.90 };
  let scale = 1;
  let opacity = 1;
  let zIndex = 1;

  if (screenMode === 'desktop') {
    w = 0.33;
    targets = { 0: 0.50, '-1': 0.26, 1: 0.74, '-2': 0.08, 2: 0.92 };
    scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.88 : 0.72;
    opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.95 : 0.75;
    zIndex = offset === 0 ? 20 : Math.abs(offset) === 1 ? 10 : 1;
  } else if (screenMode === 'tablet') {
    // Tablet (iPad / iPad Pro / 640px - 1199px): 3 prominent, large cards
    w = 0.48;
    targets = { 0: 0.50, '-1': 0.16, 1: 0.84, '-2': -0.35, 2: 1.35 };
    scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.65;
    opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.90 : 0;
    zIndex = offset === 0 ? 20 : Math.abs(offset) === 1 ? 10 : 1;
  } else {
    // Mobile (< 640px): Dominant center card with touch swipe support
    w = 0.85;
    targets = { 0: 0.50, '-1': -0.30, 1: 1.30, '-2': -0.90, 2: 1.90 };
    scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.88 : 0.72;
    opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.35 : 0;
    zIndex = offset === 0 ? 20 : Math.abs(offset) === 1 ? 10 : 1;
  }

  const key = String(offset);
  let tx;

  if (targets[key] !== undefined) {
    tx = ((targets[key] - 0.5) / w - 0.5) * 100;
  } else {
    const hiddenTarget = offset > 0 ? 1.6 : -0.6;
    tx = ((hiddenTarget - 0.5) / w - 0.5) * 100;
    scale = 0.5;
    opacity = 0;
    zIndex = -1;
  }

  return {
    transform: `translate3d(${tx.toFixed(2)}%, -50%, 0) scale(${scale})`,
    opacity,
    zIndex,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    willChange: 'transform, opacity',
    transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  };
}

export function HeroBanner() {
  const [originalBanners, setOriginalBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [screenMode, setScreenMode] = useState('mobile');

  // Detect responsive screen modes (mobile / tablet / desktop)
  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setScreenMode('desktop');
      } else if (width >= 640) {
        setScreenMode('tablet');
      } else {
        setScreenMode('mobile');
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}/banners`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const activeBanners = d.banners.filter(b => b.isActive);
          setOriginalBanners(activeBanners);
        }
      })
      .catch(console.error);
  }, []);

  // Ensure enough elements for a smooth infinite carousel loop
  const displayArray = useMemo(() => {
    if (originalBanners.length === 0) return [];
    let arr = [...originalBanners];
    while (arr.length < 7) arr = [...arr, ...originalBanners];
    return arr.map((b, idx) => ({ ...b, uniqueId: `${b.id}-${idx}` }));
  }, [originalBanners]);

  const nextSlide = useCallback(() => {
    if (displayArray.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % displayArray.length);
  }, [displayArray.length]);

  const prevSlide = useCallback(() => {
    if (displayArray.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + displayArray.length) % displayArray.length);
  }, [displayArray.length]);

  useEffect(() => {
    if (displayArray.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, displayArray.length]);

  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Threshold of 50px for a valid swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (displayArray.length === 0) {
    return <div className="w-full h-[320px] sm:h-[450px] md:h-[560px] lg:h-[600px] bg-slate-100 flex items-center justify-center animate-pulse rounded-[2.5rem] my-6">Loading Banners...</div>;
  }

  const realCurrentIndex = currentSlide % originalBanners.length;

  return (
    <div
      className="relative group w-full bg-[#FFFFFF] pt-0 pb-2 md:py-6 lg:py-10 overflow-hidden px-2 md:px-4"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1400px] mx-auto">
        <div
          className="relative w-full h-[420px] sm:h-[480px] md:h-[560px] xl:h-[600px]"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {displayArray.map((slide, i) => {
            const total = displayArray.length;
            let offset = (i - currentSlide) % total;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            // Performance: Only render slides that are visible or about to be (offset -2 to 2)
            if (Math.abs(offset) > 2) return null;

            const isCenter = offset === 0;
            const cardStyle = getCardStyle(offset, screenMode);

            return (
              // OUTER: fixed at left:50%, width NEVER changes — ONLY transform animates.
              <div
                key={slide.uniqueId}
                className="absolute top-1/2 left-1/2 w-[85%] sm:w-[75%] md:w-[48%] xl:w-[33%] aspect-[4/5] md:aspect-[3/4] cursor-pointer"
                style={cardStyle}
                onClick={() => { if (!isCenter) setCurrentSlide(i); }}
              >
                {/* INNER: static clipping wrapper */}
                <div className="w-full h-full rounded-[2rem] md:rounded-[2.25rem] xl:rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-md md:shadow-xl">
                  <Link
                    to={`/banner/${slide.id}`}
                    className="block w-full h-full group/item relative"
                    onClick={e => { if (!isCenter) e.preventDefault(); }}
                  >
                    <div className={`absolute inset-0 z-10 transition-colors duration-700 ${isCenter ? 'bg-transparent' : 'bg-black/25 group-hover/item:bg-black/10'}`} />

                    <img
                      src={slide.heroImage || slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Shop Now Button */}
                    <div className={`absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 w-full px-4 flex justify-center transition-all duration-[900ms] cubic-bezier(0.22,1,0.36,1) ${isCenter ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                      <div className="px-6 py-2.5 md:px-8 md:py-3.5 lg:px-10 lg:py-4 bg-white text-black font-black rounded-full shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-xs md:text-sm tracking-[0.2em] uppercase border border-white/20">
                          Shop Now
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#111] shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#111] shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Next banner"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {originalBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === realCurrentIndex ? "w-8 bg-black" : "w-2 bg-black/20 hover:bg-black/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
