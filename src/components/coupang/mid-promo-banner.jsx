import { Rocket, Leaf, Star, Gift } from "lucide-react"

const banners = [
  {
    title: "Fast Delivery",
    desc: "Order now, delivered by dawn!",
    bgColor: "bg-[#e8f0fe]",
    textColor: "text-[#1a56db]",
    icon: Rocket,
    iconColor: "#346aff",
  },
  {
    title: "Fresh Foods",
    desc: "Farm-to-table freshness guaranteed",
    bgColor: "bg-[#e8f5e9]",
    textColor: "text-[#2e7d32]",
    icon: Leaf,
    iconColor: "#00b050",
  },
  {
    title: "Gold Box Deals",
    desc: "Limited time offers up to 70% off",
    bgColor: "bg-[#fff8e1]",
    textColor: "text-[#e65100]",
    icon: Star,
    iconColor: "#f6a623",
  },
  {
    title: "Gift Ideas",
    desc: "Perfect picks for every occasion",
    bgColor: "bg-[#fce4ec]",
    textColor: "text-[#c62828]",
    icon: Gift,
    iconColor: "#e44d2e",
  },
]

export function MidPromoBanner() {
  return (
    <section className="py-4">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {banners.map((banner) => {
            const Icon = banner.icon
            return (
              <a
                key={banner.title}
                href="#"
                className={`group flex items-center gap-3 rounded-xl ${banner.bgColor} p-4 transition-shadow hover:shadow-md`}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <Icon className="h-6 w-6" style={{ color: banner.iconColor }} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${banner.textColor}`}>{banner.title}</p>
                  <p className="text-xs text-[#666] leading-snug">{banner.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
