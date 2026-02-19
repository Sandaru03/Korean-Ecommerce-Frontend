import {
  Rocket,
  Leaf,
  Shirt,
  Tv,
  Sofa,
  Baby,
  Dog,
  Dumbbell,
  Sparkles,
  Gift,
  Plane,
  ShoppingBag,
} from "lucide-react"

const categories = [
  { name: "Rocket Delivery", icon: Rocket, color: "#346aff" },
  { name: "Rocket Fresh", icon: Leaf, color: "#00b050" },
  { name: "Fashion", icon: Shirt, color: "#e44d2e" },
  { name: "Electronics", icon: Tv, color: "#333333" },
  { name: "Home & Living", icon: Sofa, color: "#f6a623" },
  { name: "Baby & Kids", icon: Baby, color: "#ff6b9d" },
  { name: "Pets", icon: Dog, color: "#8B4513" },
  { name: "Sports", icon: Dumbbell, color: "#2E7D32" },
  { name: "Beauty", icon: Sparkles, color: "#9C27B0" },
  { name: "Gift Cards", icon: Gift, color: "#E91E63" },
  { name: "Travel", icon: Plane, color: "#0097A7" },
  { name: "Deals", icon: ShoppingBag, color: "#FF5722" },
]

export function CategoryIcons() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-12">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <a
              key={cat.name}
              href="#"
              className="group flex flex-col items-center gap-2"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: cat.color }}
                />
              </div>
              <span className="text-center text-[11px] font-medium text-[#555] group-hover:text-[#333] transition-colors leading-tight">
                {cat.name}
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
