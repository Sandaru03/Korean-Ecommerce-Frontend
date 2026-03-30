import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function HeroBanner() {
  const [originalBanners, setOriginalBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); 

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
    while (arr.length < 7) {
      arr = [...arr, ...originalBanners];
    }
    return arr.map((b, idx) => ({ ...b, uniqueId: `${b.id}-${idx}` }));
  }, [originalBanners]);

  const nextSlide = useCallback(() => {
    if (displayArray.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % displayArray.length)
  }, [displayArray.length])

  const prevSlide = useCallback(() => {
    if (displayArray.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + displayArray.length) % displayArray.length)
  }, [displayArray.length])

  useEffect(() => {
    if (displayArray.length === 0) return;
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, displayArray.length])

  if (displayArray.length === 0) {
    return <div className="w-full h-[300px] md:h-[600px] bg-slate-100 flex items-center justify-center animate-pulse rounded-[2.5rem] my-6">Loading Banners...</div>;
  }

  // Calculate the actual current banner indicator out of the original set
  const realCurrentIndex = currentSlide % originalBanners.length;

  return (
    <div className="relative group w-full bg-[#f8f9fa] py-6 md:py-10 overflow-hidden px-2 md:px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative w-full h-[380px] sm:h-[450px] md:h-[600px]">
          {displayArray.map((slide, i) => {
            const total = displayArray.length;
            let offset = (i - currentSlide) % total;
            
            // Normalize offset to -Math.floor(total/2) ... Math.floor(total/2)
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isCenter = offset === 0;
            const isNearLeft = offset === -1;
            const isNearRight = offset === 1;
            const isFarLeft = offset === -2;
            const isFarRight = offset === 2;

            let positionClass = "";

            if (isCenter) {
              positionClass = "left-[50%] -translate-x-1/2 w-[65%] sm:w-[50%] md:w-[35%] aspect-[3/4] z-20 shadow-2xl opacity-100";
            } else if (isNearLeft) {
              positionClass = "left-[25%] md:left-[28%] -translate-x-1/2 w-[55%] sm:w-[40%] md:w-[30%] aspect-[3/4] z-10 opacity-100 scale-90 md:scale-95";
            } else if (isNearRight) {
              positionClass = "left-[75%] md:left-[72%] -translate-x-1/2 w-[55%] sm:w-[40%] md:w-[30%] aspect-[3/4] z-10 opacity-100 scale-90 md:scale-95";
            } else if (isFarLeft) {
              positionClass = "left-[5%] md:left-[10%] -translate-x-1/2 w-[45%] sm:w-[35%] md:w-[24%] aspect-[3/4] z-0 opacity-100 scale-75 md:scale-80";
            } else if (isFarRight) {
              positionClass = "left-[95%] md:left-[90%] -translate-x-1/2 w-[45%] sm:w-[35%] md:w-[24%] aspect-[3/4] z-0 opacity-100 scale-75 md:scale-80";
            } else {
              if (offset > 2) {
                positionClass = "left-[130%] -translate-x-1/2 w-[45%] sm:w-[35%] md:w-[24%] aspect-[3/4] z-[-1] opacity-0 scale-50";
              } else {
                positionClass = "left-[-30%] -translate-x-1/2 w-[45%] sm:w-[35%] md:w-[24%] aspect-[3/4] z-[-1] opacity-0 scale-50";
              }
            }

            return (
              <div
                key={slide.uniqueId}
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 rounded-3xl md:rounded-[2.5rem] overflow-hidden cursor-pointer ${positionClass}`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentSlide(i);
                  }
                }}
              >
                <Link
                  to={`/banner/${slide.id}`}
                  className="block w-full h-full group/item"
                  onClick={(e) => {
                    if (!isCenter) e.preventDefault();
                  }}
                >
                  <div className={`absolute inset-0 transition-colors duration-1000 z-10 ${isCenter ? 'bg-transparent' : 'bg-black/30 group-hover/item:bg-black/10'}`} />
                  <img
                    src={slide.heroImage || slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-all duration-1000 cubic-bezier-[0.22,1,0.36,1] ${
                      isCenter ? "scale-100" : "scale-110"
                    }`}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-[#111] shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-[#111] shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300"
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
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
  )
}

