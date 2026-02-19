"use client"

import { Clock, Zap, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

const deals = [
  { name: "Smart Air Purifier HEPA Filter", price: "$79.99", originalPrice: "$159.99", discount: "50%", image: "https://picsum.photos/seed/deal1/200/200", soldPercent: 78 },
  { name: "Wireless Charging Pad Fast 15W", price: "$12.99", originalPrice: "$29.99", discount: "57%", image: "https://picsum.photos/seed/deal2/200/200", soldPercent: 62 },
  { name: "Electric Kettle Temperature Control", price: "$34.99", originalPrice: "$69.99", discount: "50%", image: "https://picsum.photos/seed/deal3/200/200", soldPercent: 85 },
  { name: "Noise Cancelling Headphones Pro", price: "$59.99", originalPrice: "$129.99", discount: "54%", image: "https://picsum.photos/seed/deal4/200/200", soldPercent: 45 },
]

export function QuickDealBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 47 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds =
          prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        if (totalSeconds <= 0) return { hours: 23, minutes: 59, seconds: 59 }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#fff] py-6">
      <div className="mx-auto max-w-[1280px] px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Zap className="h-5 w-5 text-coupang-red" />
              <h2 className="text-lg font-bold text-[#111]">Lightning Deals</h2>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-[#111] px-2 py-1">
              <Clock className="h-3.5 w-3.5 text-coupang-red" />
              <span className="font-mono text-sm font-bold text-[#fff]">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-0.5 text-sm text-[#666] hover:text-coupang-blue transition-colors"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {deals.map((deal) => (
            <a
              key={deal.name}
              href="#"
              className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fff] hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${deal.image})` }}
                />
                <span className="absolute left-2 top-2 rounded bg-coupang-red px-2 py-0.5 text-xs font-bold text-[#fff]">
                  {deal.discount} OFF
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-3">
                <h3 className="line-clamp-1 text-sm text-[#333]">{deal.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-coupang-red">{deal.discount}</span>
                  <span className="text-base font-bold text-[#111]">{deal.price}</span>
                </div>
                <span className="text-xs text-[#999] line-through">{deal.originalPrice}</span>
                {/* Progress Bar */}
                <div className="mt-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
                    <div
                      className="h-full rounded-full bg-coupang-red transition-all"
                      style={{ width: `${deal.soldPercent}%` }}
                    />
                  </div>
                  <span className="mt-0.5 text-[10px] text-coupang-red font-medium">
                    {deal.soldPercent}% claimed
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
