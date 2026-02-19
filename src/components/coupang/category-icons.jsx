import {
  Sparkles,
  Droplets,
  Music,
  Tag,
  Brush,
  Scissors,
  Heart,
  Utensils,
  Home,
  ChefHat,
  Baby,
  Footprints,
  Smartphone,
  Laptop,
  Dumbbell,
  Dog,
} from "lucide-react"

const categories = [
  { name: "K-Beauty", icon: Sparkles, color: "#FF69B4" },
  { name: "Skin Care", icon: Droplets, color: "#4FC3F7" },
  { name: "K Pop", icon: Music, color: "#9C27B0" },
  { name: "Brand Items", icon: Tag, color: "#FF9800" },
  { name: "Makeup items", icon: Brush, color: "#E91E63" },
  { name: "Hair care", icon: Scissors, color: "#795548" },
  { name: "Health", icon: Heart, color: "#F44336" },
  { name: "Foods", icon: Utensils, color: "#4CAF50" },
  { name: "Home", icon: Home, color: "#795548" },
  { name: "Kitchen", icon: ChefHat, color: "#FF5722" },
  { name: "Baby & Kids", icon: Baby, color: "#03A9F4" },
  { name: "Shoes", icon: Footprints, color: "#607D8B" },
  { name: "Electronics", icon: Smartphone, color: "#3F51B5" },
  { name: "Digital", icon: Laptop, color: "#2196F3" },
  { name: "Sports", icon: Dumbbell, color: "#4CAF50" },
  { name: "Pet supplies", icon: Dog, color: "#8D6E63" },
]

export function CategoryIcons() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-8">
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
