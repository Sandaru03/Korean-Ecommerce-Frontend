import { Link } from "react-router-dom"
import { ChevronRight, Heart } from "lucide-react"
import { useState } from "react"

import { CommonProductCard } from "./CommonProductCard"

// Removed local resolveImage and GridCard as they're now shared as CommonProductCard

export function BannerTopicSection({ title, products, bannerImage }) {
    // Show only 6 products in a 3x2 grid
    const displayProducts = products.slice(0, 6)

    return (
        <section className="mb-12">
            <div className="flex flex-col md:flex-row border border-[#eee] rounded-md overflow-hidden bg-white shadow-sm">
                {/* Left: Banner */}
                <div className="w-full md:w-[32%] relative overflow-hidden bg-accent min-h-[300px]">
                    <img 
                        src={bannerImage} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                </div>

                {/* Right: Product Grid (3x2) */}
                <div className="flex-1 p-4 bg-white">
                    <div className="flex justify-between items-center mb-4 border-b border-[#f0f0f0] pb-2">
                        <h2 className="text-xl font-bold text-neutral-dark">{title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {displayProducts.map(p => (
                            <CommonProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
