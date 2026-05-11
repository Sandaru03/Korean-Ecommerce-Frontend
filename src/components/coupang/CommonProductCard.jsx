// CommonProductCard updated to Olive Young premium style
import { Link } from "react-router-dom"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import toast from "react-hot-toast"

/* eslint-disable react/prop-types */
export function CommonProductCard({ product }) {
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()
    const brandName = product.name ? product.name.split(" ")[0] : "Brand"

    // Robust image handling
    let imageUrl = "/default-product.jpg"
    let images = product.images || product.image
    if (typeof images === 'string') {
        const trimmed = images.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed)
                images = Array.isArray(parsed) ? parsed : [parsed]
            } catch (e) {
                images = [trimmed]
            }
        } else if (trimmed.includes(',')) {
            images = trimmed.split(',').map(s => s.trim()).filter(Boolean)
        } else {
            images = [trimmed]
        }
    }
    
    if (Array.isArray(images) && images.length > 0) {
        imageUrl = images[0] || "/default-product.jpg"
    } else if (typeof images === 'string' && images.trim()) {
        imageUrl = images.trim()
    }
    
    if (!imageUrl || imageUrl === "undefined" || imageUrl === "null" || imageUrl === "/defult-product.jpg") {
        imageUrl = "/default-product.jpg"
    }

    const price = Number(product.price) || 0
    const labellPrice = Number(product.labellPrice) || 0
    const hasDiscount = labellPrice > price

    const handleQuickAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, 1)
        toast.success(`"${product.name}" added to cart!`, { icon: '🛒' })
    }

    return (
        <Link to={`/product/${product.id}`} className="group block w-full">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden rounded-md bg-[#f5f5f5] mb-3 transition-colors border border-[#eee] group-hover:border-[#ddd]">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
            </div>

            {/* Info Section */}
            <div className="px-0.5 space-y-1">
                {/* Brand Row */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-black text-[#111] leading-tight truncate flex-1 uppercase tracking-tight">
                        {brandName}
                    </p>
                    <button 
                        onClick={handleQuickAdd}
                        className="p-1 px-1.5 -mt-0.5 text-[#999] hover:text-[#ff1268] transition-colors rounded-full hover:bg-red-50"
                        title="Add to cart"
                    >
                        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Product Name */}
                <p className="text-[13px] text-[#333] leading-[1.4] line-clamp-2 min-h-[36px] font-medium">
                    {product.name}
                </p>

                {product.miniDescription && (
                    <p className="text-[11px] text-[#888] line-clamp-1 mt-1 font-medium italic">
                        {product.miniDescription}
                    </p>
                )}

                {/* Price Section */}
                <div className="flex flex-col pt-1">
                    <div className="flex items-center gap-2">
                        <p className="text-[17px] font-black text-[#111] leading-none">
                            {formatPrice(price)}
                        </p>
                        {hasDiscount && (
                            <span className="text-[14px] font-bold text-[#ff1268]">
                                {Math.round(((labellPrice - price) / labellPrice) * 100)}%
                            </span>
                        )}
                    </div>
                    {hasDiscount && (
                        <p className="text-[11px] text-[#999] line-through font-medium mt-0.5 decoration-[#bbb]">
                            {formatPrice(labellPrice)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
