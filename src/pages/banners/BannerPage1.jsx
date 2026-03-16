import { Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"
import axios from "axios"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const DATA = {
    title: "Premium Skincare Collection",
    subtitle: "Hydrate and glow with our curated selections",
    image: "https://res.cloudinary.com/dchwarwua/image/upload/v1773636886/Gemini_Generated_Image_4tkdlb4tkdlb4tkd_vxbhlc.png",
    accent: "New Season Drops",
    color: "from-[#fff0f4] to-[#ffe0ea]",
    introTitle: "Your Glow Starts Here",
    introText: `ලංකාවේ පවතින රස්නය, අධික දාඩිය සහ දූවිල්ල නිසා ඇතිවන Acne (කුරුලෑ) පාලනය කරන්න කොරියානු නිෂ්පාදන ඉතාමත් සාර්ථකයි. විශේෂයෙන්ම කුරුලෑ නිසා ඇතිවන තුවාල සුව කිරීමටත්, ලප මැකීමටත් (Acne Scars) මේවා උදව් වෙනවා.`,
    outroTitle: "⚠️ වැදගත් උපදෙස්:",
    outroText: `Double Cleansing: ඔබ සන්ස්ක්රීන් හෝ මේකප් පාවිච්චි කරන්නේ නම්, රාත්රියට මුලින්ම Anua Cleansing Oil වැනි එකකින් මුහුණ පිරිසිදු කර පසුව ෆේස් වොෂ් පාවිච්චි කරන්න.
    
අභ්යන්තර පෝෂණය: කුරුලෑ නිතරම එන්නේ නම්, සම ඇතුළතින් සුවපත් කිරීමට Ever Collagen වැනි කොලජන් එකක් පාවිච්චි කිරීමත් ඉතා ගුණදායකයි.`,
    outroTip: "💡 Pro Tip: Apply products from thinnest to thickest consistency and wait 30 seconds between layers for maximum absorption.",
}

function resolveImage(p) {
    if (p.images && Array.isArray(p.images) && p.images.length > 0) return p.images[0];
    if (p.images && typeof p.images === 'string') {
        try {
            const parsed = JSON.parse(p.images);
            return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch { return p.images; }
    }
    return p.image || "/defult-product.jpg";
}

function StarRating({ rating, reviews }) {
    return (
        <div className="flex items-center gap-1 mt-1">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating || 5) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"}`} />
                ))}
            </div>
            <span className="text-[11px] text-[#888]">({(reviews || 0).toLocaleString()})</span>
        </div>
    )
}

function ProductCard({ p }) {
    const { addToCart } = useCart()
    const [wished, setWished] = useState(false)
    const productImage = resolveImage(p);

    return (
        <div className="group bg-white border border-[#eee] rounded-xl overflow-hidden hover:shadow-lg transition-shadow shrink-0 w-[220px]">
            <Link to={`/product/${p.productId}`} className="block relative aspect-square overflow-hidden bg-[#f8f8f8]">
                <img src={productImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                    onClick={(e) => { e.preventDefault(); setWished(w => !w); }}
                    className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md z-10"
                >
                    <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-[#bbb]"}`} strokeWidth={1.5} />
                </button>
            </Link>
            <div className="p-4">
                <Link to={`/product/${p.productId}`}>
                    <p className="text-[13px] font-semibold text-[#111] line-clamp-2 leading-snug mb-1 hover:text-primary transition-colors">{p.name}</p>
                </Link>
                <StarRating rating={p.rating} reviews={p.reviews} />
                <p className="text-[17px] font-black text-[#111] mt-2">LKR {Number(p.price).toLocaleString("en-IN")}</p>
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
    if (!section.products || section.products.length === 0) return null;

    return (
        <div className="mb-16">
            <div className="flex items-center gap-4 mb-3">
                <div>
                    {section.badge && <span className="text-[11px] font-bold text-primary bg-accent/50 px-2 py-0.5 rounded-full">{section.badge}</span>}
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

export default function BannerPage1() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/banner-sections?bannerId=1`);
                if (data.success) {
                    setSections(data.sections);
                }
            } catch (err) {
                console.error("Error fetching banner sections:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

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

                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading recommendations...</p>
                    </div>
                ) : sections.length > 0 ? (
                    sections.map(section => (
                        <SubTopicSection key={section.id} section={section} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 mb-16">
                        <p className="text-gray-400">Add products to this banner in the Admin Panel to see them here.</p>
                    </div>
                )}

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
