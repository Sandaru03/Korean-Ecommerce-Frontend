import { Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

const DATA = {
    title: "The Best of K-Beauty",
    subtitle: "Global favorites delivered to your door",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop",
    accent: "Bestsellers",
    color: "from-[#fff8f0] to-[#ffe8cc]",
    introTitle: "Why the World Loves K-Beauty",
    introText: `Korean beauty has become a global phenomenon for good reason — it works. Decades of dermatological research, a culture obsessed with skincare, and an innovative approach to ingredients have produced a catalogue of products that genuinely deliver results. From the 10-step routine that revolutionised skincare to single-ingredient heroes like snail mucin and propolis, K-beauty is endlessly fascinating and deeply effective.`,
    sections: [
        {
            id: "k1",
            title: "⭐ Global Bestsellers",
            badge: "Most Loved Worldwide",
            description: "Products that have earned cult status across the globe. Tried, tested, and trusted by millions.",
            products: [
                { id: 301, name: "COSRX Snail 96 Mucin Power Essence", price: 4100, rating: 4.9, reviews: 42000, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80" },
                { id: 302, name: "Laneige Lip Sleeping Mask", price: 3200, rating: 4.9, reviews: 38500, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80" },
                { id: 303, name: "Beauty of Joseon Relief Sun SPF50+", price: 3800, rating: 4.9, reviews: 35000, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80" },
                { id: 304, name: "Innisfree Green Tea Seed Serum", price: 4600, rating: 4.8, reviews: 27000, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
            ],
        },
    ],
    outroTitle: "Join the K-Beauty Movement",
    outroText: `With millions of devotees worldwide and a growing scientific backing, K-beauty isn't a trend — it's a lifestyle. Explore our full catalogue, read reviews from real customers, and find the products that will transform your routine.`,
    outroTip: "💡 Pro Tip: New to K-beauty? Start with a simple 3-step routine: cleanser, moisturiser, SPF. Build from there as you understand your skin's needs.",
}

function StarRating({ rating, reviews }) {
    return (
        <div className="flex items-center gap-1 mt-1">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`} />
                ))}
            </div>
            <span className="text-[11px] text-[#888]">({reviews?.toLocaleString()})</span>
        </div>
    )
}

function ProductCard({ p }) {
    const { addToCart } = useCart()
    const [wished, setWished] = useState(false)

    return (
        <div className="group bg-white border border-[#eee] rounded-xl overflow-hidden hover:shadow-lg transition-shadow shrink-0 w-[220px]">
            <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                    onClick={() => setWished(w => !w)}
                    className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md"
                >
                    <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-[#bbb]"}`} strokeWidth={1.5} />
                </button>
            </div>
            <div className="p-4">
                <p className="text-[13px] font-semibold text-[#111] line-clamp-2 leading-snug mb-1">{p.name}</p>
                <StarRating rating={p.rating} reviews={p.reviews} />
                <p className="text-[17px] font-black text-[#111] mt-2">LKR {p.price.toLocaleString("en-IN")}</p>
                <button
                    onClick={() => { addToCart(p, 1); toast.success("Added to cart!", { icon: "🛒" }) }}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-red-800 text-white text-[12px] font-bold rounded-lg transition-colors"
                >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                </button>
            </div>
        </div>
    )
}

function SubTopicSection({ section }) {
    return (
        <div className="mb-16">
            <div className="flex items-center gap-4 mb-3">
                <div>
                    <span className="text-[11px] font-bold text-primary bg-accent/50 px-2 py-0.5 rounded-full">{section.badge}</span>
                    <h2 className="text-[24px] font-black text-[#111] mt-1">{section.title}</h2>
                    <p className="text-[15px] text-[#666] mt-1 max-w-[600px]">{section.description}</p>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                {section.products.map(p => (
                    <ProductCard key={p.id} p={p} />
                ))}
            </div>
        </div>
    )
}

export default function BannerPage3() {
    return (
        <div className="min-h-screen bg-bg-main font-sans">
            <Header />
            <div className="relative h-[320px] md:h-[500px] w-full overflow-hidden">
                <img src={DATA.image} alt={DATA.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-14">
                <div className={`bg-gradient-to-br ${DATA.color} rounded-2xl p-8 md:p-12 mb-16`}>
                    <h2 className="text-[26px] font-black text-[#111] mb-4">{DATA.introTitle}</h2>
                    <p className="text-[16px] text-[#444] leading-relaxed max-w-[720px]">{DATA.introText}</p>
                </div>
                {DATA.sections.map(section => (
                    <SubTopicSection key={section.id} section={section} />
                ))}
                <div className="bg-[#111] rounded-2xl p-8 md:p-12 text-white">
                    <h2 className="text-[24px] font-black mb-4">{DATA.outroTitle}</h2>
                    <p className="text-[15px] text-white/80 leading-relaxed mb-6 max-w-[720px]">{DATA.outroText}</p>
                    <p className="text-[14px] font-bold text-primary">{DATA.outroTip}</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
