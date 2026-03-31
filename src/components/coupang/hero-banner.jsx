import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ── Compute card style using ONLY transform for positioning ──────────────────
// Formula: translateX% = (targetCenter - 0.5) / cardWidthFraction - 0.5
// This keeps left:50% fixed, so ONLY transform changes during animation.
// This eliminates the iOS "jump" bug: WebKit was recalculating -translate-x-1/2
// against a changing width mid-transition, causing wrong intermediate positions.
function getCardStyle(offset, isMd) {
  const w = isMd ? 0.35 : 0.85; // card width as fraction of container

  const targets = isMd
    ? { 0: 0.50, '-1': 0.28, 1: 0.72, '-2': 0.10, 2: 0.90 }
    : { 0: 0.50, '-1': -0.30, 1: 1.30, '-2': -0.90, 2: 1.90 };

  const key = String(offset);
  let tx, scale, opacity, zIndex;

  if (targets[key] !== undefined) {
    tx = ((targets[key] - 0.5) / w - 0.5) * 100;
    scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.88 : 0.72;
    opacity = 1;
    zIndex = offset === 0 ? 20 : Math.abs(offset) === 1 ? 10 : 1;
  } else {
    const hiddenTarget = offset > 0 ? 1.6 : -0.6;
    tx = ((hiddenTarget - 0.5) / w - 0.5) * 100;
    scale = 0.5;
    opacity = 0;
    zIndex = -1;
  }

  return {
    transform: `translateX(${tx.toFixed(2)}%) translateY(-50%) scale(${scale})`,
    opacity,
    zIndex,
    willChange: 'transform, opacity',
    transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  };
}

export function HeroBanner() {
  const [originalBanners, setOriginalBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMd, setIsMd] = useState(false);

  // Detect md breakpoint so getCardStyle uses correct width fraction
  useEffect(() => {
    const check = () => setIsMd(window.innerWidth >= 768);
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

  if (displayArray.length === 0) {
    return <div className="w-full h-[300px] md:h-[600px] bg-slate-100 flex items-center justify-center animate-pulse rounded-[2.5rem] my-6">Loading Banners...</div>;
  }

  const realCurrentIndex = currentSlide % originalBanners.length;

  return (
    <div
      className="relative group w-full bg-[#f8f9fa] py-6 md:py-10 overflow-hidden px-2 md:px-4"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div
          className="relative w-full h-[450px] sm:h-[500px] md:h-[600px]"
          style={{ perspective: '1000px' }}
        >
          {displayArray.map((slide, i) => {
            const total = displayArray.length;
            let offset = (i - currentSlide) % total;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isCenter = offset === 0;
            const cardStyle = getCardStyle(offset, isMd);

            return (
              // OUTER: fixed at left:50%, width NEVER changes — ONLY transform animates.
              // This prevents iOS from recalculating translate-x-1/2 against a stale width.
              <div
                key={slide.uniqueId}
                className="absolute top-1/2 left-1/2 w-[85%] md:w-[35%] aspect-[4/5] md:aspect-[3/4] cursor-pointer"
                style={cardStyle}
                onClick={() => { if (!isCenter) setCurrentSlide(i); }}
              >
                {/* INNER: static clipping wrapper — never moves.
                    Separates overflow+border-radius from the animated element
                    to prevent WebKit from forcing CPU rendering. */}
                <div className="w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-100">
                  <Link
                    to={`/banner/${slide.id}`}
                    className="block w-full h-full group/item relative"
                    onClick={e => { if (!isCenter) e.preventDefault(); }}
                  >
                    <div className={`absolute inset-0 z-10 transition-colors duration-700 ${isCenter ? 'bg-transparent' : 'bg-black/30 group-hover/item:bg-black/10'}`} />


                    <img
                      src={slide.heroImage || slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows — desktop only */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-[#111] shadow-md opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity duration-300"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-[#111] shadow-md opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity duration-300"
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 hidden md:flex gap-2">
        {originalBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              i === realCurrentIndex ? "w-8 bg-black" : "w-2 bg-black/20"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
