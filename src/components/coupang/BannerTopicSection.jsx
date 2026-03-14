import { Link } from "react-router-dom"
import { ChevronRight, Heart } from "lucide-react"
import { useState } from "react"

function resolveImage(p) {
    let imgs = p.images
    if (typeof imgs === "string") {
        try { imgs = JSON.parse(imgs) } catch { imgs = [p.image || ""] }
    }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0]
    return p.image || null
}

function GridCard({ p }) {
    const [wished, setWished] = useState(false)
    const imageUrl = resolveImage(p)
    const rawPrice = Number(p.price) || 0
    const brandName = p.name ? p.name.split(" ")[0] : "Brand"

    return (
        <div className="group flex flex-col relative w-full border border-[#f0f0f0] rounded-sm p-2 hover:shadow-sm transition-shadow">
            <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] mb-2 rounded-[2px]">
                <Link to={`/product/${p.id}`}>
                    <img
                        src={imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </Link>
                <button
                    onClick={(e) => { e.preventDefault(); setWished(w => !w) }}
                    className="absolute bottom-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-white/80 shadow-sm hover:scale-110 transition-transform"
                >
                    <Heart className={`h-3 w-3 ${wished ? "fill-primary text-primary" : "text-[#ccc]"}`} strokeWidth={1.5} />
                </button>
            </div>
            <Link to={`/product/${p.id}`} className="flex flex-col flex-1">
                <p className="text-[10px] font-bold text-[#999] mb-0.5">{brandName}</p>
                <p className="text-[12px] text-[#333] line-clamp-2 leading-tight mb-1 h-[32px]">{p.name}</p>
                <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-[14px] font-black text-[#111]">
                        Rs. {rawPrice.toLocaleString("en-US")}
                    </span>
                </div>
                <div className="flex gap-1 mt-1.5 items-center">
                   <img src="https://image6.coupangcdn.com/image/badges/rocket/rocket_logo.png" alt="rocket" className="h-2.5 object-contain" />
                </div>
            </Link>
        </div>
    )
}

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
                            <GridCard key={p.id} p={p} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
