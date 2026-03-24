

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); 

  useEffect(() => {
    fetch(`${backendUrl}/banners`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const activeBanners = d.banners.filter(b => b.isActive);
          setBanners(activeBanners);
          if (activeBanners.length >= 3) {
            setCurrentSlide(Math.floor(activeBanners.length / 2));
          } else {
            setCurrentSlide(0);
          }
        }
      })
      .catch(console.error);
  }, []);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, banners.length])

  // Helper to determine order/display
  const getDisplayIndex = (offset) => {
    if (banners.length === 0) return 0;
    return (currentSlide + offset + banners.length) % banners.length
  }

  if (banners.length === 0) {
    return <div className="w-full h-[300px] md:h-[600px] bg-slate-100 flex items-center justify-center animate-pulse rounded-2xl md:rounded-[2.5rem] my-6">Loading Banners...</div>;
  }


  return (
    <div className="relative group w-full bg-[#f8f9fa] py-6 md:py-10 overflow-hidden px-2 md:px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative flex items-end justify-center gap-1 md:gap-3 h-[300px] md:h-[600px]">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = getDisplayIndex(offset)
            const slide = banners[index]
            const isCenter = offset === 0
            const isNearCenter = Math.abs(offset) === 1

            return (
              <div
                key={slide.id}
                className={`relative transition-all duration-1000 cubic-bezier-[0.22,1,0.36,1] rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer
                  ${isCenter 
                    ? "w-[60%] md:w-[32%] h-full z-20 shadow-2xl" 
                    : isNearCenter 
                      ? "w-[18%] md:w-[27%] h-[85%] md:h-[90%] z-10 opacity-70" 
                      : "w-[2%] md:w-[7%] h-[75%] md:h-[80%] z-0 opacity-30 grayscale"
                  }
                `}
                style={{
                   transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }}
                onClick={() => setCurrentSlide(index)}
              >
                <Link to={`/banner/${slide.id}`} className="block w-full h-full group/item">
                  <div className="absolute inset-0 bg-black/5 group-hover/item:bg-transparent transition-colors duration-300 z-10" />
                  <img
                    src={slide.heroImage || slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-all duration-1000 cubic-bezier-[0.22,1,0.36,1]
                      ${isCenter ? "scale-100 opacity-100" : "scale-110 opacity-90"}
                    `}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  />
                  
                </Link>
              </div>
            )
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
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? "w-8 bg-black" : "w-2 bg-black/20"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
