// Product cards now focused on selection and purchase.
import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
export function CommonProductCard({ product }) {
    const brandName = product.name ? product.name.split(" ")[0] : "Brand"

    // Robust image handling
    let imageUrl = "https://via.placeholder.com/300"
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
        imageUrl = images[0] || "https://via.placeholder.com/300"
    } else if (typeof images === 'string' && images.trim()) {
        imageUrl = images.trim()
    }
    
    // Final safety check
    if (!imageUrl || imageUrl === "undefined" || imageUrl === "null") {
        imageUrl = "https://via.placeholder.com/300"
    }

    const price = Number(product.price) || 0

    return (
        <Link to={`/product/${product.id}`} className="group relative bg-white block">
            <div className="relative aspect-square overflow-hidden border border-[#eee] rounded-sm mb-3">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            <div className="px-0.5 text-left">
                <p className="text-[12px] font-bold text-[#111] mb-1 leading-none truncate">{brandName}</p>
                <p className="text-[13px] text-[#555] leading-[1.3] line-clamp-2 min-h-[34px] group-hover:underline decoration-1 underline-offset-2">
                    {product.name}
                </p>
                {product.miniDescription && (
                    <p className="text-[11px] text-[#888] line-clamp-1 mt-1 font-medium">
                        {product.miniDescription}
                    </p>
                )}

                <div className="mt-2.5 flex flex-col gap-0.5">
                    {product.originalPrice && (
                        <p className="text-[12px] text-[#999] line-through font-medium leading-none">{product.originalPrice}</p>
                    )}
                    <div className="flex items-baseline gap-1.5 leading-none mt-1">
                        {product.discount && (
                            <span className="text-[16px] font-bold text-[#ff4040]">{product.discount}</span>
                        )}
                        <span className="text-[16px] font-bold text-[#111]">
                            LKR {price.toLocaleString('en-US')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                    {product.badge && (
                        <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-semibold px-1.5 py-[2px] rounded-[3px]">
                            {product.badge}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
