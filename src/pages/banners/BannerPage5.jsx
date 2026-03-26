import { Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

const DATA = {
    title: "Healthy Living & Supplements",
    subtitle: "Fuel your body with the best organic products",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2560&h=660&auto=format&fit=crop",
    accent: "Bio Organic",
    color: "from-[#f0fdf4] to-[#dcfce7]",
    introTitle: "Wellness from Within",
    introText: `True beauty and wellbeing starts on the inside. Korean health and wellness culture emphasises balance — nutritious food, mindful habits, and targeted supplements to support your body's natural rhythms. Whether you're looking for collagen for your skin, probiotics for gut health, or energy-boosting superfoods, this collection has the finest Korean health products to complement your lifestyle.`,
    sections: [
        {
            id: "w1",
            title: "✨ Beauty Supplements",
            badge: "Inner Glow",
            description: "Collagen, ceramides, and biotin from the inside out — because great skin starts with what you eat.",
            products: [
                { id: 501, name: "Neogen Collagen Peptide Ampoule", price: 5400, rating: 4.8, reviews: 9800, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
                { id: 502, name: "Lacto-Fit Slim Probiotics 5X", price: 4800, rating: 4.7, reviews: 13200, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
                { id: 503, name: "Korea Ginseng Corp Red Ginseng Extract", price: 7200, rating: 4.9, reviews: 22000, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" },
                { id: 504, name: "Drinkdrink Collagen Rice Drink", price: 3100, rating: 4.6, reviews: 6700, image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80" },
            ],
        },
    ],
    outroTitle: "A Holistic Approach to Beauty",
    outroText: `The best version of you comes from taking care of your whole self — body, mind, and skin. Combine quality supplements with a consistent skincare routine, adequate hydration, and plenty of sleep to see the most dramatic results. Explore our full wellness range and build habits that last.`,
    outroTip: "💡 Pro Tip: Marine collagen is more bioavailable than bovine collagen — meaning your body absorbs more of it. Look for hydrolysed collagen peptides for faster results.",
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

export default function BannerPage5() {
    return (
        <div className="min-h-screen bg-bg-main font-sans">
            <Header />
            <div className="relative aspect-[2560/660] w-full overflow-hidden">
                <img src={DATA.image} alt={DATA.title} className="absolute inset-0 w-full h-full object-cover" />
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
