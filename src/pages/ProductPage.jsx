import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import {
    Star, Rocket, ShoppingCart, Heart, ChevronRight,
    Shield, RotateCcw, Truck, PackageCheck,
    Minus, Plus, Share2, Grid3x3, Flame
} from "lucide-react"
import axios from "axios"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

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
    const defaultDetails = {
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
    }
    return DETAILS[id] || defaultDetails
}

function StarBar({ rating, reviews }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "fill-[#ff1268] text-[#ff1268]" : "fill-gray-200 text-gray-200"}`} />
                ))}
            </div>
            <span className="text-[13px] font-bold text-[#111] leading-none ml-1">{rating}</span>
            <span className="text-[13px] text-[#888] underline underline-offset-2 ml-1 cursor-pointer hover:text-[#111]">
                ({reviews?.toLocaleString()}건)
            </span>
        </div>
    )
}

export default function ProductPage() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const details = getDetails(id)

    const [wished, setWished] = useState(false)
    const [selectedImg, setSelectedImg] = useState(0)
    const [activeTab, setActiveTab] = useState("description")

    // Options selector state
    const [showOptions, setShowOptions] = useState(false)
    const [selectedItems, setSelectedItems] = useState([]) // Array of { id, name, qty, price }
    const [isTodayDream, setIsTodayDream] = useState(false)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`)
            .then(res => {
                setProduct(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id])

    // Thumbnail images: Use real DB product images
    let parsedImages = ["https://picsum.photos/seed/korea/400/400"];
    if (product?.images) {
        if (Array.isArray(product.images) && product.images.length > 0) {
            parsedImages = product.images;
        } else if (typeof product.images === "string") {
            try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed) && parsed.length > 0) parsedImages = parsed;
                else parsedImages = [product.images];
            } catch {
                parsedImages = [product.images];
            }
        }
    }
    const images = parsedImages;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <p className="text-xl font-bold">Loading product details...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f5f5f5]">
                <Header />
                <div className="flex flex-col items-center justify-center py-40">
                    <p className="text-6xl mb-4">📦</p>
                    <p className="text-2xl font-bold text-gray-500">Product not found</p>
                    <Link to="/" className="mt-6 bg-[#ff1268] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#e00d59] transition">
                        ← Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const discountPct = (product.labellPrice && product.price < product.labellPrice)
        ? Math.round(((product.labellPrice - product.price) / product.labellPrice) * 100)
        : null;
    const brandName = product?.name?.split(" ")[0] || "Brand"; // Extract first word as brand for UI

    // Parse numeric price for calculation (assuming LKR or raw DB number)
    const rawPrice = Number(product.price || 0);
    const totalPrice = selectedItems.reduce((acc, item) => acc + (rawPrice * item.qty), 0);
    const formattedTotal = new Intl.NumberFormat('en-IN').format(totalPrice);

    const handleAddOption = (vol) => {
        const existing = selectedItems.find(item => item.name === vol);
        if (existing) {
            setSelectedItems(selectedItems.map(item =>
                item.name === vol ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setSelectedItems([...selectedItems, { id: vol, name: vol, qty: 1, price: rawPrice }]);
        }
        setShowOptions(false);
    };

    const handleUpdateQty = (vol, newQty) => {
        if (newQty < 1) return;
        setSelectedItems(selectedItems.map(item =>
            item.name === vol ? { ...item, qty: newQty } : item
        ));
    };

    const handleRemoveItem = (vol) => {
        setSelectedItems(selectedItems.filter(item => item.name !== vol));
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-[#eee]">
                <div className="mx-auto max-w-[1040px] px-4 py-3 flex items-center gap-2 text-[12px] text-[#777]">
                    <Link to="/" className="hover:text-[#111] transition">Home</Link>
                    <ChevronRight className="h-3 w-3 text-[#ccc]" />
                    <button onClick={() => navigate(-1)} className="hover:text-[#111] transition">Category</button>
                    <ChevronRight className="h-3 w-3 text-[#ccc]" />
                    <span className="text-[#333] font-medium truncate">{brandName}</span>
                </div>
            </div>

            <div className="mx-auto max-w-[1040px] px-4 py-10 relative">

                {/* ── Top section: image (left) + sticky info (right) ── */}
                <div className="flex flex-col lg:flex-row gap-12 items-start relative">

                    {/* Left: Image gallery */}
                    <div className="w-full lg:w-[460px] shrink-0">
                        {/* Main image */}
                        <div className="relative aspect-square w-full bg-[#f8f8f8] mb-4 overflow-hidden border border-[#eee]">
                            <img
                                src={images[selectedImg]}
                                alt={product.name}
                                className="h-full w-full object-cover transition-all duration-300"
                            />
                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-widest">
                                {selectedImg + 1} | {images.length}
                            </div>
                        </div>

                        {/* Thumbnails + Compare Button */}
                        <div className="flex gap-2.5 items-center">
                            <button className="h-[64px] shrink-0 flex flex-col items-center justify-center border border-[#ddd] bg-[#fdfdfd] text-[#555] px-3 font-semibold text-[11px] hover:border-[#111] transition-colors gap-1">
                                <Grid3x3 className="h-4 w-4" />
                                색상비교
                            </button>
                            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImg(i)}
                                        className={`h-[64px] w-[64px] shrink-0 border relative transition-all ${i === selectedImg ? "border-[#111]" : "border-transparent hover:border-[#ddd]"}`}
                                    >
                                        <img src={img} alt={`view ${i + 1}`} className="h-full w-full object-cover" />
                                        {i === selectedImg && <div className="absolute inset-0 ring-1 ring-inset ring-[#111]"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sticky Product info */}
                    <div className="flex-1 min-w-0 lg:sticky lg:top-10">

                        {/* Header Row: Brand & Actions */}
                        <div className="flex justify-between items-center mb-4">
                            <Link to="#" className="text-[14px] font-bold text-[#111] hover:underline flex items-center gap-0.5">
                                {brandName} <ChevronRight className="h-4 w-4" />
                            </Link>
                            <div className="flex gap-3">
                                <button className="text-[#999] hover:text-[#111] transition-colors"><Share2 className="h-6 w-6" strokeWidth={1.5} /></button>
                                <button onClick={() => setWished(w => !w)} className="transition-colors">
                                    <Heart className={`h-6 w-6 ${wished ? "fill-[#ff1268] text-[#ff1268]" : "text-[#999] hover:text-[#111]"}`} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-[26px] font-black text-[#111] leading-[1.3] tracking-tight mb-2">
                            {product.name}
                        </h1>



                        {/* Price Area */}
                        <div className="flex flex-col mb-6">
                            {product.labellPrice && product.labellPrice > product.price && (
                                <span className="text-[14px] text-[#999] line-through font-medium leading-none mb-2">Rs. {Number(product.labellPrice).toLocaleString('en-IN')}</span>
                            )}
                            <div className="flex items-baseline gap-2 leading-none">
                                {discountPct && (
                                    <span className="text-[32px] font-black text-[#e2211c]">{discountPct}%</span>
                                )}
                                <span className="text-[32px] font-black text-[#111]">
                                    <span className="text-[22px] font-bold mr-0.5">Rs. </span>
                                    {Number(product.price).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-1.5 mb-6 flex-wrap">

                            <span className="bg-[#f0f0f0] text-[#555] text-[11px] font-bold px-2 py-1 rounded-[4px] tracking-wide">
                                BEST
                            </span>
                            {product.freeShipping && (
                                <span className="bg-[#fff0f0] text-[#e2211c] text-[11px] font-bold px-2 py-1 rounded-[4px] tracking-wide">
                                    Free Shipping
                                </span>
                            )}
                            {product.badge && (
                                <span className="border border-[#ddd] text-[#777] text-[11px] font-bold px-2 py-[3px] rounded-[4px] tracking-wide">
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        <hr className="border-[#eee] my-6" />


                        {/* Total Checkout Area */}
                        <div className="flex justify-between items-end mb-6 py-4 border-t-2 border-[#111]">
                            <span className="text-[14px] font-semibold text-[#555]">Total Product Price</span>
                            <div className="flex items-end gap-1">
                                <span className="text-[14px] text-[#ff1268] font-semibold mb-1">Total {selectedItems.reduce((acc, item) => acc + item.qty, 0)} Items</span>
                                <span className="text-[16px] font-bold text-[#111] leading-none mb-1">Rs. </span>
                                <span className="text-[28px] font-black text-[#111] leading-none ml-0">{formattedTotal}</span>
                            </div>
                        </div>

                        {/* Bottom Action Area */}
                        <button
                            onClick={() => {
                                addToCart(product, 1)
                                toast.success(`"${product.name}" added to cart!`, { icon: '🛒' })
                            }}
                            className="w-full h-[56px] bg-[#ff1268] text-white font-bold text-[16px] rounded-[4px] hover:bg-[#e00d59] transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </button>

                    </div>
                </div>

                {/* ── Tabs: Description / Reviews / Q&A ── */}
                <div className="mt-20 border-t border-[#eee]">
                    {/* Sticky Tab headers */}
                    <div className="flex sticky top-[10px] bg-white z-20 border-b border-[#111] shadow-sm">
                        {["Description", "Purchase Info", "Reviews", "Q&A"].map((tab, idx) => {
                            const tabKeys = ["description", "info", "reviews", "qa"];
                            const current = tabKeys[idx];
                            return (
                                <button
                                    key={current}
                                    onClick={() => setActiveTab(current)}
                                    className={`flex-1 py-4 text-[15px] font-bold transition-colors ${activeTab === current ? "text-[#111] border-b-[3px] border-[#111] -mb-[1px]" : "text-[#777] hover:text-[#111]"}`}
                                >
                                    {tab} {current === 'reviews' && <span className="text-[#999] font-normal ml-0.5">({product.reviews?.toLocaleString()})</span>}
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab content area */}
                    <div className="py-16 max-w-[800px] mx-auto text-center">
                        {activeTab === "description" && (
                            <div className="space-y-8">
                                <h3 className="text-[24px] font-black text-[#111] leading-snug tracking-tight mb-8">
                                    {product.name}
                                </h3>
                                <p className="text-[15px] text-[#555] leading-[1.8] text-left">
                                    {details.description}
                                </p>
                                <div className="text-left bg-[#f8f8f8] p-8 mt-8 border border-[#eee]">
                                    <h4 className="font-bold text-[#111] mb-4 text-[16px]">Check Points</h4>
                                    <ul className="space-y-3">
                                        {details.highlights?.map(h => (
                                            <li key={h} className="flex items-start gap-2 text-[14px] text-[#555]">
                                                <span className="text-[#ff1268] font-bold mt-0.5">✓</span>
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-12 text-left">
                                    <h4 className="font-bold text-[#111] mb-3 text-[16px]">How to Use</h4>
                                    <p className="text-[14px] text-[#666] leading-[1.8]">{details.howToUse}</p>
                                </div>

                                <div className="mt-12 text-left">
                                    <h4 className="font-bold text-[#111] mb-3 text-[16px]">Full Ingredients</h4>
                                    <p className="text-[13px] text-[#888] leading-[1.8] font-mono p-4 bg-[#fcfcfc] border border-[#f0f0f0]">{details.ingredients}</p>
                                </div>
                            </div>
                        )}
                        {activeTab !== "description" && (
                            <div className="py-32 text-[#999]">
                                <p className="text-[15px]">This content is being prepared.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
