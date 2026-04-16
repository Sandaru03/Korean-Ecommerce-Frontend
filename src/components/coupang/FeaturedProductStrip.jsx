import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { CommonProductCard } from "@/components/coupang/CommonProductCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export function FeaturedProductStrip() {
    const [strip, setStrip] = useState(null)
    const scrollRef = useRef(null)

    useEffect(() => {
        fetch(`${backendUrl}/featured-strip`)
            .then(r => r.json())
            .then(d => { if (d.success && d.strip.active) setStrip(d.strip) })
            .catch(console.error)
    }, [])

    if (!strip || !strip.products || strip.products.length === 0) return null

    const scrollBy = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" })
        }
    }

    return (
        <section className="mb-0">
            {/* Title bar */}
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#111] tracking-tight">
                    {strip.title}
                </h2>
                {/* Desktop arrows */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={() => scrollBy(-1)}
                        className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scrollBy(1)}
                        className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scrollable strip */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {strip.products.map(product => (
                    <div
                        key={product.id}
                        className="snap-start shrink-0 w-[155px] sm:w-[175px] md:w-[200px]"
                    >
                        <CommonProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    )
}
