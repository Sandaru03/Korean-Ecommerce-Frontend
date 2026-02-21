import { Link } from "react-router-dom"
import {
  Sparkles, Droplets, Music, Tag, Brush, Scissors,
  Heart, Utensils, Home, ChefHat, Baby, Footprints,
  Dumbbell, Dog,
} from "lucide-react"

const categories = [
  { name: "K-Beauty", slug: "k-beauty", icon: Sparkles, color: "#FF69B4" },
  { name: "Skin Care", slug: "skin-care", icon: Droplets, color: "#4FC3F7" },
  { name: "K-Pop", slug: "k-pop", icon: Music, color: "#9C27B0" },
  { name: "Makeup", slug: "makeup", icon: Brush, color: "#E91E63" },
  { name: "Hair Care", slug: "hair-care", icon: Scissors, color: "#795548" },
  { name: "Health", slug: "health", icon: Heart, color: "#F44336" },
  { name: "Foods", slug: "foods", icon: Utensils, color: "#4CAF50" },
  { name: "Home", slug: "home", icon: Home, color: "#FF9800" },
  { name: "Baby & Kids", slug: "baby-kids", icon: Baby, color: "#03A9F4" },
  { name: "Dry Skin", slug: "dry-skin", icon: Droplets, color: "#2196F3" },
  { name: "Oily Skin", slug: "oily-skin", icon: Tag, color: "#009688" },
  { name: "Sports", slug: "sports", icon: Dumbbell, color: "#3F51B5" },
  { name: "Kitchen", slug: "home", icon: ChefHat, color: "#FF5722" },
  { name: "Shoes", slug: "sports", icon: Footprints, color: "#607D8B" },
  { name: "Pet Supplies", slug: "health", icon: Dog, color: "#8D6E63" },
]

export function CategoryIcons() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-5">
      <div className="grid grid-cols-5 gap-3 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-9">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.name}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110 group-hover:shadow-md"
                style={{ backgroundColor: `${cat.color}18` }}
              >
                <Icon className="h-6 w-6" style={{ color: cat.color }} />
              </div>
              <span className="text-center text-[11px] font-medium text-[#555] group-hover:text-[#333] transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
