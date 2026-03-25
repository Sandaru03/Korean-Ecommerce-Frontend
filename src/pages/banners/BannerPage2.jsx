import { Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

const DATA = {
    title: "Vibrant Makeup & Nails",
    subtitle: "Express yourself with bold colors",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2560&h=660&auto=format&fit=crop",
    accent: "Limited Edition",
    color: "from-[#fdf0ff] to-[#f5e0ff]",
    introTitle: "Bold, Beautiful, K-Beauty Makeup",
    introText: `K-beauty makeup is all about enhancing your natural features while having fun with color. From glass-skin bases to gradient lip looks and doll-like lashes — Korean makeup trends have taken the world by storm. Whether you prefer a natural GRWM or a full glam moment, you'll find everything here. Mix and match products to create your signature look, and don't be afraid to experiment.`,
    sections: [
        {
            id: "m1",
            title: "💄 Base & Foundation",
            badge: "Flawless Start",
            description: "Lightweight, skin-caring bases that give you a natural radiance without looking cakey.",
            products: [
                { id: 201, name: "Missha Magic Cushion Cover Lasting SPF50", price: 3800, rating: 4.8, reviews: 18900, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80" },
                { id: 202, name: "Laneige Neo Cushion Matte Foundation", price: 5200, rating: 4.7, reviews: 9100, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
                { id: 203, name: "Clio Kill Cover Fixer Cushion SPF50+", price: 4700, rating: 4.6, reviews: 12300, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
                { id: 204, name: "3CE Smoothing Face Primer", price: 3200, rating: 4.5, reviews: 7800, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
            ],
        },
        {
            id: "m2",
            title: "💅 Lip & Eye Colors",
            badge: "Statement Looks",
            description: "Vibrant lip tints, velvety mattes, and eye palettes that stay put all day.",
            products: [
                { id: 205, name: "ROM&ND Blur Fudge Tint", price: 2400, rating: 4.9, reviews: 24000, image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=400&q=80" },
                { id: 206, name: "3CE Soft Lip Lacquer", price: 2800, rating: 4.8, reviews: 19500, image: "https://images.unsplash.com/photo-1599733594230-6b823276c1e5?w=400&q=80" },
                { id: 207, name: "Etude House Play Color Eyes Mini Palette", price: 3100, rating: 4.7, reviews: 14200, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
                { id: 208, name: "Clio Pro Eye Palette No.6 Cherry Bomb", price: 4800, rating: 4.6, reviews: 8900, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
            ],
        },
    ],
    outroTitle: "Your Canvas, Your Rules",
    outroText: `Korean makeup philosophy is rooted in self-expression and skin-first beauty. Many K-beauty makeup products contain skincare ingredients so you're treating your skin while you wear it. Start with a good base, add color where you like it, and finish with a setting spray for all-day wear. Explore our full makeup range and find your favorite products.`,
    outroTip: "💡 Pro Tip: Korean gradient lips (ombré lips) are easy to achieve — just apply your lip tint to the center of your lips and blend outward with your finger.",
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

export default function BannerPage2() {
    return (
        <div className="min-h-screen bg-bg-main font-sans">
            <Header />
            <div className="relative aspect-[2560/660] w-full overflow-hidden">
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
