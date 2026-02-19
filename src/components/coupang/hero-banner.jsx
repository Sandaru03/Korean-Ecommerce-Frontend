

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Korea's No. 1 Health & Beauty Store",
    subtitle: "Discover all things K-Beauty at Samee and Sandu",
    bgColor: "bg-[#5B3F8C]",
    textColor: "text-[#fff]",
    accent: "Welcome to Samee and Sandu",
  },
  {
    id: 2,
    title: "New Arrivals 20% Off",
    subtitle: "Spring collection now available",
    bgColor: "bg-[#2E7D32]",
    textColor: "text-[#fff]",
    accent: "Limited Time Offer",
  },
  {
    id: 3,
    title: "Rocket Fresh Deals",
    subtitle: "Fresh groceries delivered by dawn",
    bgColor: "bg-[#1565C0]",
    textColor: "text-[#fff]",
    accent: "Free delivery on orders $30+",
  },
  {
    id: 4,
    title: "Electronics Festival",
    subtitle: "Up to 50% off on top brands",
    bgColor: "bg-[#E65100]",
    textColor: "text-[#fff]",
    accent: "Best prices guaranteed",
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
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const banner = banners[currentSlide]

  return (
    <div className="relative overflow-hidden">
      <div
        className={`relative flex h-[280px] items-center justify-center ${banner.bgColor} transition-colors duration-500 md:h-[340px]`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-8 w-full">
          <div className="flex-1">
            <p className={`text-sm font-medium ${banner.textColor} mb-2 opacity-80`}>
              {banner.accent}
            </p>
            <h2 className={`text-3xl font-bold ${banner.textColor} mb-3 md:text-4xl text-balance`}>
              {banner.title}
            </h2>
            <p className={`text-lg ${banner.textColor} opacity-90`}>
              {banner.subtitle}
            </p>
            <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#333] shadow-md hover:shadow-lg transition-shadow">
              Shop Now
            </button>
          </div>
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-24 w-28 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
                >
                  <div className="h-16 w-16 rounded-md bg-white/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#333] shadow hover:bg-white transition-colors"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#333] shadow hover:bg-white transition-colors"
        aria-label="Next banner"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all ${i === currentSlide
                ? "w-6 bg-white"
                : "w-2 bg-white/50"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
