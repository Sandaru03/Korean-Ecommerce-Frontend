import { Rocket, Truck, CreditCard, Shield } from "lucide-react"

const promos = [
  { icon: Rocket, title: "Rocket Delivery", desc: "Order by midnight, get it tomorrow", color: "#346aff" },
  { icon: Truck, title: "Free Returns", desc: "30-day hassle-free returns", color: "#00b050" },
  { icon: CreditCard, title: "Easy Payments", desc: "Interest-free installments", color: "#f6a623" },
  { icon: Shield, title: "100% Authentic", desc: "Quality guaranteed products", color: "#e44d2e" },
]

export function PromoBannerStrip() {
  return (
    <section className="bg-[#fff] py-4 border-y border-[#f0f0f0]">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {promos.map((promo) => {
            const Icon = promo.icon
            return (
              <div key={promo.title} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${promo.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: promo.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#333]">{promo.title}</p>
                  <p className="text-xs text-[#888]">{promo.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
