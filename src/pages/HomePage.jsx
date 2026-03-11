import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { Footer } from "@/components/coupang/footer"
import { ChevronRight, Heart, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function resolveImage(p) {
    let imgs = p.images
    if (typeof imgs === "string") {
        try { imgs = JSON.parse(imgs) } catch { imgs = [imgs] }
    }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0]
    return p.image || null
}

// ── Single product card used inside topic strips ────────────────
function OliveCard({ p }) {
    const [wished, setWished] = useState(false)
    const imageUrl = resolveImage(p)
    const rawPrice = Number(p.price) || 0
    const brandName = p.name ? p.name.split(" ")[0] : "Brand"

    return (
        <div className="group flex flex-col relative w-[220px] shrink-0">
            <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] mb-3 border border-[#eee] rounded-[4px]">
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
                    className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
                >
                    <Heart className={`h-4 w-4 ${wished ? "fill-[#ff1268] text-[#ff1268]" : "text-[#999]"}`} strokeWidth={1.5} />
                </button>
            </div>
            <Link to={`/product/${p.id}`} className="flex flex-col flex-1">
                <p className="text-[12px] font-bold text-[#111] mb-0.5">{brandName}</p>
                <p className="text-[13px] text-[#333] line-clamp-2 leading-snug mb-2">{p.name}</p>
                <div className="flex items-baseline gap-1.5 mt-auto">
                    <span className="text-[17px] font-black text-[#111] leading-none">
                        LKR {rawPrice.toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="flex gap-1 mt-2.5 flex-wrap">
                    <span className="bg-[#ffebf0] text-[#ff1268] text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">Today Delivery</span>
                </div>
            </Link>
        </div>
    )
}

// ── Horizontal scrolling topic strip ───────────────────────────
function TopicStrip({ title, products }) {
    return (
        <section className="mb-14">
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-[22px] font-bold text-[#111] tracking-tight">{title}</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
                {products.slice(0, 10).map(p => (
                    <div key={p.id} className="snap-start">
                        <OliveCard p={p} />
                    </div>
                ))}
            </div>
        </section>
    )
}

// ── Empty state ────────────────────────────────────────────────
function EmptyTopics() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-[#eee]" strokeWidth={1} />
            <p className="text-[20px] font-bold text-[#ccc]">No products yet</p>
            <p className="text-[14px] text-[#bbb]">Add topics and products from the Admin panel to display them here.</p>
        </div>
    )
}

// ── Main Page ──────────────────────────────────────────────────
export default function HomePage() {
    const [categories, setCategories] = useState([])
    const [topics, setTopics] = useState([])
    const [topicsLoading, setTopicsLoading] = useState(true)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

    useEffect(() => {
        fetch(`${backendUrl}/categories`)
            .then(r => r.json())
            .then(d => { if (d.categories) setCategories(d.categories) })
            .catch(console.error)

        fetch(`${backendUrl}/homepage-topics`)
            .then(r => r.json())
            .then(d => { if (d.success) setTopics(d.topics) })
            .catch(console.error)
            .finally(() => setTopicsLoading(false))
    }, [backendUrl])

    const rootCategories = categories.filter(c => c.parentId === null)
    const activeTopicsWithProducts = topics.filter(t => t.active && t.products?.length > 0)

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white pb-20">
            <Header />

            {/* Hero Banner */}
            <div className="w-full mb-14">
                <HeroBanner />
            </div>

            {/* Round Icon Categories */}
            {rootCategories.length > 0 && (
                <div className="mx-auto max-w-[1040px] px-4 mb-20">
                    <div className="flex flex-wrap md:grid md:grid-cols-10 gap-y-8 gap-x-2">
                        {rootCategories.map((cat, idx) => (
                            <Link key={cat.id || idx} to={`/super-category/${cat.slug}`} className="flex flex-col items-center gap-3 group w-[20%] md:w-auto">
                                <div className="w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden border border-[#eaeaea] bg-[#f8f8f8] shrink-0">
                                    {cat.image
                                        ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                                        : <div className="w-full h-full bg-gradient-to-br from-[#ffebf0] to-[#ffe0ea]" />
                                    }
                                </div>
                                <span className="text-[12px] md:text-[13px] text-[#333] font-medium text-center leading-tight group-hover:text-[#ff1268] transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Dynamic Topics from Admin */}
            <div className="mx-auto max-w-[1040px] px-4 space-y-4">
                {topicsLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff1268]" />
                    </div>
                ) : activeTopicsWithProducts.length > 0 ? (
                    activeTopicsWithProducts.map(topic => (
                        <TopicStrip key={topic.id} title={topic.title} products={topic.products} />
                    ))
                ) : (
                    <EmptyTopics />
                )}
            </div>

            <Footer />
        </div>
    )
}
