import { ChevronRight, TrendingUp, Award, Flame } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "Top 10 Must-Have Kitchen Gadgets for 2026",
    category: "Trending",
    icon: TrendingUp,
    image: "https://picsum.photos/seed/news1/400/250",
    views: "12.5K",
  },
  {
    id: 2,
    title: "Best Beauty Products Chosen by Experts",
    category: "Editor's Pick",
    icon: Award,
    image: "https://picsum.photos/seed/news2/400/250",
    views: "8.3K",
  },
  {
    id: 3,
    title: "Spring Fashion Trends You Need to Know",
    category: "Hot Topic",
    icon: Flame,
    image: "https://picsum.photos/seed/news3/400/250",
    views: "15.2K",
  },
  {
    id: 4,
    title: "Home Organization Tips & Storage Solutions",
    category: "Trending",
    icon: TrendingUp,
    image: "https://picsum.photos/seed/news4/400/250",
    views: "6.7K",
  },
]

export function NewsGallery() {
  return (
    <section className="bg-[#1a1a2e] py-8">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#fff]">News Gallery</h2>
          <a
            href="#"
            className="flex items-center gap-0.5 text-sm text-[#aaa] hover:text-[#fff] transition-colors"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {newsItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.id}
                href="#"
                className="group overflow-hidden rounded-lg bg-[#fff]/10 backdrop-blur-sm hover:bg-[#fff]/15 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000]/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5 text-[#fff]" />
                    <span className="text-xs font-medium text-[#fff]">{item.category}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-[#fff] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#888]">{item.views} views</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
