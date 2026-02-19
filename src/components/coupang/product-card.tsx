import { Rocket, Star } from "lucide-react"

interface ProductCardProps {
  name: string
  price: string
  originalPrice?: string
  discount?: string
  rating?: number
  reviews?: number
  image: string
  rocketDelivery?: boolean
  freeShipping?: boolean
  badge?: string
}

export function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  rocketDelivery = false,
  freeShipping = false,
  badge,
}: ProductCardProps) {
  return (
    <a
      href="#"
      className="group flex flex-col overflow-hidden rounded-lg bg-[#fff] transition-shadow hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded bg-coupang-red px-1.5 py-0.5 text-[10px] font-bold text-[#fff]">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-[13px] text-[#333] leading-snug group-hover:text-coupang-blue transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-1.5">
          {discount && (
            <span className="text-base font-bold text-coupang-red">{discount}</span>
          )}
          <span className="text-base font-bold text-[#111]">{price}</span>
        </div>
        {originalPrice && (
          <span className="text-xs text-[#999] line-through">{originalPrice}</span>
        )}

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "fill-[#f6a623] text-[#f6a623]"
                      : "fill-[#e0e0e0] text-[#e0e0e0]"
                  }`}
                />
              ))}
            </div>
            {reviews && (
              <span className="text-[11px] text-[#999]">({reviews.toLocaleString()})</span>
            )}
          </div>
        )}

        {/* Delivery Tags */}
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {rocketDelivery && (
            <span className="inline-flex items-center gap-0.5 rounded bg-[#346aff]/10 px-1.5 py-0.5 text-[10px] font-medium text-coupang-blue">
              <Rocket className="h-2.5 w-2.5" />
              Rocket
            </span>
          )}
          {freeShipping && (
            <span className="rounded bg-[#00b050]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#00b050]">
              Free Shipping
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
