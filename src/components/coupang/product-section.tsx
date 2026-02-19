import { ChevronRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/product-data"

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  bgColor?: string
  accentColor?: string
  cols?: number
  showViewAll?: boolean
}

export function ProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-[#fff]",
  accentColor,
  cols = 6,
  showViewAll = true,
}: ProductSectionProps) {
  const gridCols =
    cols === 4
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : cols === 5
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"

  return (
    <section className={`${bgColor} py-6`}>
      <div className="mx-auto max-w-[1280px] px-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111] md:text-xl text-balance">
              {accentColor ? (
                <span style={{ color: accentColor }}>{title}</span>
              ) : (
                title
              )}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-[#666]">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <a
              href="#"
              className="flex items-center gap-0.5 text-sm text-[#666] hover:text-coupang-blue transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Product Grid */}
        <div className={`grid ${gridCols} gap-3`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              rating={product.rating}
              reviews={product.reviews}
              image={product.image}
              rocketDelivery={product.rocketDelivery}
              freeShipping={product.freeShipping}
              badge={product.badge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
