"use client"

import { ChevronRight } from "lucide-react"

const recommendations = [
  { id: 1, name: "Wireless Earbuds Pro Max", price: "LKR 29", image: "https://picsum.photos/seed/rec1/300/300", tag: "Popular" },
  { id: 2, name: "Silk Pillowcase 100% Mulberry", price: "LKR 19", image: "https://picsum.photos/seed/rec2/300/300", tag: "New" },
  { id: 3, name: "Stainless Steel Tumbler 900ml", price: "LKR 14", image: "https://picsum.photos/seed/rec3/300/300", tag: "Best Seller" },
  { id: 4, name: "Aroma Diffuser LED Ultrasonic", price: "LKR 24", image: "https://picsum.photos/seed/rec4/300/300", tag: "Trending" },
  { id: 5, name: "Portable Mini Projector HD", price: "LKR 89", image: "https://picsum.photos/seed/rec5/300/300", tag: "Hot Deal" },
  { id: 6, name: "Travel Makeup Organizer Bag", price: "LKR 12", image: "https://picsum.photos/seed/rec6/300/300", tag: "Popular" },
  { id: 7, name: "Bamboo Desktop Organizer Shelf", price: "LKR 22", image: "https://picsum.photos/seed/rec7/300/300", tag: "New" },
  { id: 8, name: "Smart Scale Body Composition", price: "LKR 34", image: "https://picsum.photos/seed/rec8/300/300", tag: "Best Seller" },
]

export function RecommendationSection() {
  return (
    <section className="bg-gradient-to-b from-accent to-bg-main py-8">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111]">Picked Just For You</h2>
            <p className="mt-0.5 text-sm text-[#666]">Personalized recommendations based on your interests</p>
          </div>
          <a
            href="#"
            className="flex items-center gap-0.5 text-sm text-[#666] hover:text-primary transition-colors"
          >
            See More
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          {recommendations.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group relative flex flex-col overflow-hidden rounded-lg bg-[#fff] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-[#fff]">
                  {item.tag}
                </span>
              </div>
              <div className="p-2">
                <h3 className="line-clamp-2 text-[11px] text-[#333] leading-snug">{item.name}</h3>
                <p className="mt-1 text-sm font-bold text-[#111]">{item.price}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
