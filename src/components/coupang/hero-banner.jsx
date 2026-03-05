

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const banners = [
  {
    id: 1,
    title: "Premium Skincare Collection",
    subtitle: "Hydrate and glow with our curated selections",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    bgColor: "from-[#fdfcfb] to-[#e2d1c3]",
    textColor: "text-[#4a342e]",
    accent: "New Season Drops",
    href: "/category/skin-care",
  },
  {
    id: 2,
    title: "Vibrant Makeup & Nails",
    subtitle: "Express yourself with bold colors",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    bgColor: "from-[#fff1eb] to-[#ace0f9]",
    textColor: "text-[#2c3e50]",
    accent: "Limited Edition",
    href: "/category/makeup",
  },
  {
    id: 3,
    title: "The Best of K-Beauty",
    subtitle: "Global favorites delivered to your door",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop",
    bgColor: "from-[#a1c4fd] to-[#c2e9fb]",
    textColor: "text-[#1e3a8a]",
    accent: "Bestsellers",
    href: "/category/k-beauty",
  },
  {
    id: 4,
    title: "Essential Hair Care",
    subtitle: "Revitalize your hair with premium nutrients",
    image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?q=80&w=1200&auto=format&fit=crop",
    bgColor: "from-[#ff9a9e] to-[#fecfef]",
    textColor: "text-[#5d1719]",
    accent: "Daily Essentials",
    href: "/category/hair-care",
  },
  {
    id: 5,
    title: "Healthy Living & Supplements",
    subtitle: "Fuel your body with the best organic products",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    bgColor: "from-[#84fab0] to-[#8fd3f4]",
    textColor: "text-[#064e3b]",
    accent: "Bio Organic",
    href: "/category/health",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

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

  return (
    <div className="relative group w-full overflow-hidden">
      <div className="relative h-[280px] md:h-[480px] w-full">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Link to={slide.href} className="flex h-full w-full items-center">
              <div className={`flex h-full w-full items-center bg-gradient-to-r ${slide.bgColor} px-8 md:px-16`}>
                <div className="w-full md:w-1/2 z-10">
                  <span className={`text-[12px] md:text-[14px] font-bold ${slide.textColor} opacity-80 mb-2 block tracking-wider uppercase`}>
                    {slide.accent}
                  </span>
                  <h2 className={`text-[28px] md:text-[44px] font-black ${slide.textColor} leading-tight mb-4 tracking-tight`}>
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i}>{word} </span>
                    ))}
                  </h2>
                  <p className={`text-[14px] md:text-[17px] ${slide.textColor} opacity-90 mb-8 max-w-[400px]`}>
                    {slide.subtitle}
                  </p>
                  <button className="inline-flex items-center gap-2 rounded-full border-2 border-current px-8 py-3 text-[14px] font-bold hover:bg-current hover:text-white transition-all duration-300">
                    Discover More
                  </button>
                </div>

                <div className="hidden md:flex absolute right-0 bottom-0 top-0 w-[55%] items-center justify-center p-8">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform scale-75 opacity-60"></div>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative z-10 w-[85%] h-[85%] object-cover rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-[#111] shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-[#111] shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300"
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Counter & Indicators */}
      <div className="absolute bottom-8 left-8 md:left-16 z-20 flex items-center gap-6">
        <div className="flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? "w-8 bg-current" : "w-2 bg-current/30"
                }`}
              style={{ color: banners[currentSlide].textColor }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[14px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full" style={{ color: banners[currentSlide].textColor }}>
          {currentSlide + 1} / {banners.length}
        </span>
      </div>
    </div>
  )
}
