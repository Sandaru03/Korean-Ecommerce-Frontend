import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import {
    Star, Rocket, ShoppingCart, ChevronRight,
    Shield, RotateCcw, Truck, PackageCheck,
    Minus, Plus, Share2, Grid3x3, Flame
} from "lucide-react"
import axios from "axios"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

// Product details are now fetched directly from the database description field.

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
                                src={images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover transition-all duration-300"
                            />
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
                                    <span className="text-primary font-bold">{discountPct}%</span>
                                )}
                                <span className="text-neutral-dark text-2xl font-bold">
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



                        {/* Bottom Action Area */}
                        <button
                            onClick={() => {
                                addToCart(product, 1)
                                toast.success(`"${product.name}" added to cart!`, { icon: '🛒' })
                            }}
                            className="w-full h-[56px] bg-primary text-white font-semibold transition-all hover:opacity-90 rounded-[4px] flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </button>

                    </div>
                </div>

                {/* ── Product Description Section ── */}
                <div className="mt-20 border-t border-[#eee]">
                    <div className="flex bg-white z-20 border-b border-[#111]">
                        <div className="py-4 px-8 text-[15px] font-bold text-[#111] border-b-[3px] border-[#111] -mb-[1px]">
                            Product Description
                        </div>
                    </div>

                    <div className="py-16 max-w-[800px] mx-auto">
                        <div className="space-y-12">
                            <h3 className="text-[24px] font-black text-[#111] leading-snug tracking-tight text-center">
                                {product.name}
                            </h3>
                            
                            <div className="text-[16px] text-[#555] leading-[1.8] whitespace-pre-line">
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
