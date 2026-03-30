import { Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

const DATA = {
    title: "Essential Hair Care",
    subtitle: "Revitalize your hair with premium nutrients",
    image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?q=80&w=2560&h=660&auto=format&fit=crop",
    accent: "Daily Essentials",
    color: "from-[#f0fff4] to-[#d4f5e1]",
    introTitle: "Healthy Hair, Happy You",
    introText: `Korean hair care applies the same ingredient-forward, skin-first philosophy to your hair. Rich fermented extracts, peptides, and botanical oils nourish the scalp — the foundation of healthy hair — while strengthening each strand from root to tip. Whether your goal is shine, volume, moisture, or scalp health, the right K-beauty hair routine can transform your hair completely.`,
    sections: [
        {
            id: "h1",
            title: "🌿 Shampoo & Conditioner",
            badge: "The Foundation",
            description: "Gentle yet powerful cleansing and conditioning for all hair types.",
            products: [
                { id: 401, name: "Aromatica Tea Tree Balancing Shampoo", price: 3600, rating: 4.7, reviews: 8900, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
                { id: 402, name: "MASIL 8 Seconds Salon Hair Mask", price: 4200, rating: 4.8, reviews: 12400, image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?w=400&q=80" },
                { id: 403, name: "Amos Professional Perfume Therapy Conditioner", price: 3900, rating: 4.6, reviews: 7200, image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80" },
                { id: 404, name: "Mise en Scène Perfect Serum Original", price: 2800, rating: 4.7, reviews: 15600, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
            ],
        },
    ],
    outroTitle: "Invest in Your Hair",
    outroText: `Consistency is key with hair care. A weekly deep conditioning treatment, daily scalp massage, and the right shampoo for your hair type are the foundations of a great routine. Browse our full hair care range for scalp treatments, styling products, and premium korean tools.`,
    outroTip: "💡 Pro Tip: Massage your scalp for 3-5 minutes before shampooing to boost circulation and promote healthier hair growth.",
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
                <img src={p.image} alt={p.name} className="w-full h-full object-contain bg-[#f8f8f8] group-hover:scale-105 transition-transform duration-300" />
                <button
                    onClick={() => setWished(w => !w)}
                    className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md"
                >
                    <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-[#bbb]"}`} strokeWidth={1.5} />
                </button>
            </div>
            <div className="p-4">
                <p className="text-[13px] font-semibold text-[#111] line-clamp-2 leading-snug mb-1">{p.name}</p>
                {p.miniDescription && (
                    <p className="text-[11px] text-[#888] line-clamp-1 mt-1 font-medium">
                        {p.miniDescription}
                    </p>
                )}
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

export default function BannerPage4() {
    return (
        <div className="min-h-screen bg-bg-main font-sans">
            <Header />
            <div className="relative aspect-[2560/660] w-full overflow-hidden">
                <img src={DATA.image} alt={DATA.title} className="absolute inset-0 w-full h-full object-contain bg-[#f8f8f8]" />
            </div>
            <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-14">
                <div className={`bg-gradient-to-br ${DATA.color} rounded-2xl p-8 md:p-12 mb-16`}>
                    <p className="text-[16px] text-[#444] leading-relaxed max-w-[720px]">{DATA.introText}</p>
                </div>
                {DATA.sections.map(section => (
                    <SubTopicSection key={section.id} section={section} />
                ))}

                <div className="bg-[#111] rounded-2xl p-8 md:p-12 text-white">
                    <h2 className="text-[24px] font-black mb-4">{DATA.outroTitle}</h2>
                    <p className="text-[15px] text-white/80 leading-relaxed max-w-[720px]">{DATA.outroText}</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
