import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import {
    Star, Rocket, ShoppingCart, Heart, ChevronRight,
    Shield, RotateCcw, Truck, PackageCheck,
    Minus, Plus, Share2,
} from "lucide-react"
import { ALL_PRODUCTS } from "@/lib/product-data"

// Sample extended details keyed by product id (enriches the base product data)
const DETAILS = {
    default: {
        description: "Experience the best of Korean beauty and wellness. This premium product is crafted with high-quality ingredients, dermatologist-tested, and perfect for everyday use. Free from harmful chemicals and suitable for all skin types.",
        highlights: [
            "Dermatologist tested & approved",
            "Free from parabens, sulfates & artificial fragrances",
            "Cruelty-free & vegan formulation",
            "Suitable for all skin types",
            "Made in Korea — authentic K-beauty",
        ],
        howToUse: "Apply a small amount to clean skin and massage gently until fully absorbed. Use morning and/or evening as part of your skincare routine. Follow with sunscreen during the day.",
        ingredients: "Water, Glycerin, Niacinamide, Hyaluronic Acid, Centella Asiatica Extract, Allantoin, Panthenol, Tocopherol, Fragrance-free formula.",
        volume: ["30ml", "50ml", "100ml"],
        shades: [],
    },
}

function getDetails(id) {
    return DETAILS[id] || DETAILS["default"]
}

function StarBar({ rating, reviews }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
            </div>
            <span className="text-sm font-semibold text-amber-600">{rating}</span>
            <span className="text-sm text-gray-400">({reviews?.toLocaleString()} reviews)</span>
        </div>
    )
}

export default function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const product = ALL_PRODUCTS[id]
    const details = getDetails(id)

    const [qty, setQty] = useState(1)
    const [wished, setWished] = useState(false)
    const [selectedImg, setSelectedImg] = useState(0)
    const [selectedVolume, setSelectedVolume] = useState(details?.volume?.[0] || null)
    const [activeTab, setActiveTab] = useState("description")

    // Thumbnail images: same seed with slight variation for demo
    const images = product
        ? [
            product.image,
            product.image.replace("/400/400", "/401/401"),
            product.image.replace("/400/400", "/402/402"),
            product.image.replace("/400/400", "/403/403"),
        ]
        : []

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f5f5f5]">
                <Header />
                <div className="flex flex-col items-center justify-center py-40">
                    <p className="text-6xl mb-4">📦</p>
                    <p className="text-2xl font-bold text-gray-500">Product not found</p>
                    <Link to="/" className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
                        ← Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const discountPct = product.discount?.replace("%", "") || ""

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-[#eee]">
                <div className="mx-auto max-w-[1280px] px-4 py-2.5 flex items-center gap-1 text-xs text-gray-400">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <button onClick={() => navigate(-1)} className="hover:text-blue-600 transition">Back</button>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-600 truncate max-w-[300px]">{product.name}</span>
                </div>
            </div>

            <div className="mx-auto max-w-[1280px] px-4 py-6">

                {/* ── Top section: image + info ── */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Image gallery */}
                    <div className="lg:w-[440px] shrink-0">
                        <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
                            {/* Main image */}
                            <div className="relative aspect-square bg-[#f8f8f8]">
                                <img
                                    src={images[selectedImg]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                                {product.badge && (
                                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">
                                        {product.badge}
                                    </span>
                                )}
                                {discountPct && (
                                    <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-sm font-black px-2.5 py-1 rounded-xl border border-red-200">
                                        -{discountPct}%
                                    </span>
                                )}
                                <button
                                    onClick={() => setWished(w => !w)}
                                    className="absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                                >
                                    <Heart className={`h-5 w-5 ${wished ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 p-3 border-t border-[#eee] bg-white">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImg(i)}
                                        className={`h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? "border-blue-500 scale-105" : "border-transparent"}`}
                                    >
                                        <img src={img} alt={`view ${i + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl border border-[#eee] p-6 h-full">

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {product.rocketDelivery && (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-100">
                                        <Rocket className="h-3 w-3" /> Fast Delivery
                                    </span>
                                )}
                                {product.freeShipping && (
                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-green-100">
                                        <Truck className="h-3 w-3" /> Free Shipping
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="text-xl md:text-2xl font-bold text-[#111] leading-snug mb-3">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <StarBar rating={product.rating} reviews={product.reviews} />

                            <div className="border-t border-[#f0f0f0] mt-4 pt-4">
                                {/* Price */}
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-black text-[#111]">{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                                    )}
                                    {discountPct && (
                                        <span className="text-lg font-black text-red-500">-{discountPct}%</span>
                                    )}
                                </div>
                                {product.originalPrice && (
                                    <p className="text-xs text-green-600 font-medium mt-0.5">
                                        You save {product.originalPrice} → {product.price}
                                    </p>
                                )}
                            </div>

                            {/* Volume selector */}
                            {details.volume?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-[13px] font-semibold text-[#444] mb-2">Size / Volume</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {details.volume.map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setSelectedVolume(v)}
                                                className={`px-4 py-1.5 rounded-lg border text-[13px] font-medium transition-all ${selectedVolume === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-[#ddd] text-[#555] hover:border-blue-300"}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity + actions */}
                            <div className="mt-5 flex items-center gap-3 flex-wrap">
                                {/* Qty picker */}
                                <div className="flex items-center border border-[#ddd] rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="px-3 py-2.5 hover:bg-gray-50 text-[#444] transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 py-2.5 text-sm font-bold min-w-[40px] text-center border-x border-[#ddd]">{qty}</span>
                                    <button
                                        onClick={() => setQty(q => q + 1)}
                                        className="px-3 py-2.5 hover:bg-gray-50 text-[#444] transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Add to cart */}
                                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </button>

                                {/* Buy now */}
                                <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                                    Buy Now
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { icon: Shield, label: "100% Authentic" },
                                    { icon: RotateCcw, label: "30-Day Returns" },
                                    { icon: Truck, label: "Free Shipping" },
                                    { icon: PackageCheck, label: "Secure Checkout" },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1 p-2 bg-[#f8f8f8] rounded-xl text-center">
                                        <Icon className="h-4 w-4 text-blue-600" />
                                        <span className="text-[10px] font-medium text-[#555]">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs: Description / How to Use / Ingredients ── */}
                <div className="mt-6 bg-white rounded-2xl border border-[#eee] overflow-hidden">
                    {/* Tab headers */}
                    <div className="flex border-b border-[#eee]">
                        {["description", "how-to-use", "ingredients"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3.5 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                            >
                                {tab.replace("-", " ")}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-6">
                        {activeTab === "description" && (
                            <div className="space-y-4">
                                <p className="text-sm text-[#555] leading-relaxed">{details.description}</p>
                                <ul className="space-y-2">
                                    {details.highlights?.map(h => (
                                        <li key={h} className="flex items-start gap-2 text-sm text-[#444]">
                                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === "how-to-use" && (
                            <p className="text-sm text-[#555] leading-relaxed">{details.howToUse}</p>
                        )}
                        {activeTab === "ingredients" && (
                            <p className="text-sm text-[#555] leading-relaxed font-mono">{details.ingredients}</p>
                        )}
                    </div>
                </div>

                {/* ── Related products ── */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-[#111]">You May Also Like</h2>
                        <Link to="/" className="text-sm text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {Object.values(ALL_PRODUCTS)
                            .filter(p => p.id !== product.id)
                            .slice(0, 6)
                            .map(p => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.id}`}
                                    className="group bg-white rounded-xl border border-[#eee] overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="aspect-square overflow-hidden bg-[#f8f8f8]">
                                        <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                    </div>
                                    <div className="p-2">
                                        <p className="text-[12px] text-[#333] line-clamp-2 leading-tight">{p.name}</p>
                                        <p className="text-[13px] font-bold text-[#111] mt-1">{p.price}</p>
                                        {p.originalPrice && <p className="text-[10px] text-gray-400 line-through">{p.originalPrice}</p>}
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
