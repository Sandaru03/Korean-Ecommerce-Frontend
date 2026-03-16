

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const banners = [
  {
    id: 1,
    title: "Premium Skincare Collection",
    subtitle: "Hydrate and glow with our curated selections",
    image: "https://res.cloudinary.com/dchwarwua/image/upload/v1773578772/upscale_bmtvrk.png",
    accent: "New Season Drops",
    href: "/banner/1",
  },
  {
    id: 2,
    title: "Vibrant Makeup & Nails",
    subtitle: "Express yourself with bold colors",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    accent: "Limited Edition",
    href: "/banner/2",
  },
  {
    id: 3,
    title: "The Best of K-Beauty",
    subtitle: "Global favorites delivered to your door",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop",
    accent: "Bestsellers",
    href: "/banner/3",
  },
  {
    id: 4,
    title: "Essential Hair Care",
    subtitle: "Revitalize your hair with premium nutrients",
    image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?q=80&w=1200&auto=format&fit=crop",
    accent: "Daily Essentials",
    href: "/banner/4",
  },
  {
    id: 5,
    title: "Healthy Living & Supplements",
    subtitle: "Fuel your body with the best organic products",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    accent: "Bio Organic",
    href: "/banner/5",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(2) // Start with middle item centered

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  // Helper to determine order/display
  const getDisplayIndex = (offset) => {
    return (currentSlide + offset + banners.length) % banners.length
  }

  return (
    <div className="relative group w-full bg-[#f8f9fa] py-8 md:py-12 overflow-hidden px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative flex items-center justify-center gap-2 md:gap-4 h-[300px] md:h-[550px]">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = getDisplayIndex(offset)
            const slide = banners[index]
            const isCenter = offset === 0
            const isNearCenter = Math.abs(offset) === 1

            return (
              <div
                key={`${slide.id}-${offset}`}
                className={`relative transition-all duration-700 ease-out rounded-[2rem] overflow-hidden cursor-pointer
                  ${isCenter 
                    ? "w-[35%] md:w-[45%] h-full z-20 shadow-2xl" 
                    : isNearCenter 
                      ? "w-[20%] md:w-[20%] h-[85%] md:h-[90%] z-10 opacity-80" 
                      : "w-[10%] md:w-[7%] h-[75%] md:h-[80%] z-0 opacity-40 grayscale-[50%]"
                  }
                `}
                onClick={() => setCurrentSlide(index)}
              >
                <Link to={slide.href} className="block w-full h-full group/item">
                  <div className="absolute inset-0 bg-black/10 group-hover/item:bg-transparent transition-colors duration-300 z-10" />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-700 
                      ${isCenter ? "scale-105 group-hover/item:scale-110" : "scale-100 group-hover/item:scale-105"}
                    `}
                  />
                  
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 transition-opacity duration-300">
                      <span className="inline-block px-3 py-1 bg-white text-black text-[10px] md:text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                        {slide.accent}
                      </span>
                      <h2 className="text-white text-xl md:text-4xl font-bold mb-2 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-white/80 text-sm md:text-lg line-clamp-1">
                        {slide.subtitle}
                      </p>
                    </div>
                  )}
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
