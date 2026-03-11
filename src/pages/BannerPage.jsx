import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { Heart, ChevronRight, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

// ── All banner data — must match ids in hero-banner.jsx ─────────────
const BANNER_DATA = {
  1: {
    title: "Premium Skincare Collection",
    subtitle: "Hydrate and glow with our curated selections",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop",
    accent: "New Season Drops",
    color: "from-[#fff0f4] to-[#ffe0ea]",
    introTitle: "Your Glow Starts Here",
    introText: `Korean skincare is more than a routine — it's a ritual. Rooted in centuries of beauty tradition, K-beauty combines gentle, science-backed ingredients with luxurious textures to deliver visible, lasting results. Whether you're building your first routine or refining a multi-step regimen, our curated collection has everything you need. Start with a gentle cleanser, layer on your essences and serums, and seal it all in with a deeply nourishing moisturiser. Your skin will thank you.`,
    sections: [
      {
        id: "s1",
        title: "🌿 Cleansers & Toners",
        badge: "Step 1 — Foundation",
        description: "Start every routine right. These gentle formulas lift away impurities without disrupting your skin's natural barrier.",
        products: [
          { id: 101, name: "COSRX Low pH Good Morning Gel Cleanser", price: 2800, rating: 4.8, reviews: 12400, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
          { id: 102, name: "Some By Mi AHA BHA PHA Toner", price: 3400, rating: 4.7, reviews: 9800, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" },
          { id: 103, name: "Klairs Supple Preparation Facial Toner", price: 3100, rating: 4.9, reviews: 15000, image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80" },
          { id: 104, name: "Innisfree Green Tea Hyaluronic Cleanser", price: 2600, rating: 4.6, reviews: 8300, image: "https://images.unsplash.com/photo-1609372332255-611485350f25?w=400&q=80" },
        ],
      },
      {
        id: "s2",
        title: "💧 Essences & Serums",
        badge: "Step 2 — Treatment",
        description: "The powerhouse step. Concentrated actives that target your biggest skin concerns — hydration, brightness, or blemishes.",
        products: [
          { id: 105, name: "MISSHA Time Revolution First Treatment Essence", price: 4900, rating: 4.9, reviews: 22000, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
          { id: 106, name: "Torriden DIVE-IN Low Molecule Hyaluronic Serum", price: 4200, rating: 4.8, reviews: 11200, image: "https://images.unsplash.com/photo-1556228841-a3c527ebebe5?w=400&q=80" },
          { id: 107, name: "Skin1004 Madagascar Centella Ampoule", price: 3800, rating: 4.7, reviews: 9500, image: "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=400&q=80" },
          { id: 108, name: "Beauty of Joseon Glow Serum Propolis + Niacinamide", price: 4100, rating: 4.9, reviews: 18700, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80" },
        ],
      },
      {
        id: "s3",
        title: "🧴 Moisturisers & SPF",
        badge: "Step 3 — Lock It In",
        description: "Seal in every layer and protect your glow. SPF every single day — yes, even indoors.",
        products: [
          { id: 109, name: "COSRX Ultimate Nourishing Rice Overnight Mask", price: 3300, rating: 4.8, reviews: 14100, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80" },
          { id: 110, name: "Etude House Moistfull Collagen Cream", price: 3600, rating: 4.7, reviews: 10300, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
          { id: 111, name: "Round Lab Birch Juice Moisturizing Sunscreen SPF50+", price: 4400, rating: 4.9, reviews: 20500, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
          { id: 112, name: "Purito Daily Go-To Sunscreen SPF50+", price: 3900, rating: 4.8, reviews: 16800, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&q=80" },
        ],
      },
    ],
    outroTitle: "Build Your Perfect Routine",
    outroText: `The secret to Korean skincare isn't having the most steps — it's layering the right products in the right order, from lightest to heaviest. Listen to your skin: if it feels tight, reach for more hydration. If it looks dull, add a brightening step. Consistency is everything. Most results take 4–8 weeks to show, so stick with it and enjoy the ritual. Remember to always patch test new products, and when in doubt, less is more. Shop our full collection and build a routine that's uniquely yours.`,
    outroTip: "💡 Pro Tip: Apply products from thinnest to thickest consistency and wait 30 seconds between layers for maximum absorption.",
  },
  2: {
    title: "Vibrant Makeup & Nails",
    subtitle: "Express yourself with bold colors",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    accent: "Limited Edition",
    color: "from-[#fdf0ff] to-[#f5e0ff]",
    introTitle: "Bold, Beautiful, K-Beauty Makeup",
    introText: `K-beauty makeup is all about enhancing your natural features while having fun with color. From glass-skin bases to gradient lip looks and doll-like lashes — Korean makeup trends have taken the world by storm. Whether you prefer a natural GRWM or a full glam moment, you'll find everything here. Mix and match products to create your signature look, and don't be afraid to experiment.`,
    sections: [
      {
        id: "m1",
        title: "💄 Base & Foundation",
        badge: "Flawless Start",
        description: "Lightweight, skin-caring bases that give you a natural radiance without looking cakey.",
        products: [
          { id: 201, name: "Missha Magic Cushion Cover Lasting SPF50", price: 3800, rating: 4.8, reviews: 18900, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80" },
          { id: 202, name: "Laneige Neo Cushion Matte Foundation", price: 5200, rating: 4.7, reviews: 9100, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
          { id: 203, name: "Clio Kill Cover Fixer Cushion SPF50+", price: 4700, rating: 4.6, reviews: 12300, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
          { id: 204, name: "3CE Smoothing Face Primer", price: 3200, rating: 4.5, reviews: 7800, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
        ],
      },
      {
        id: "m2",
        title: "💅 Lip & Eye Colors",
        badge: "Statement Looks",
        description: "Vibrant lip tints, velvety mattes, and eye palettes that stay put all day.",
        products: [
          { id: 205, name: "ROM&ND Blur Fudge Tint", price: 2400, rating: 4.9, reviews: 24000, image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=400&q=80" },
          { id: 206, name: "3CE Soft Lip Lacquer", price: 2800, rating: 4.8, reviews: 19500, image: "https://images.unsplash.com/photo-1599733594230-6b823276c1e5?w=400&q=80" },
          { id: 207, name: "Etude House Play Color Eyes Mini Palette", price: 3100, rating: 4.7, reviews: 14200, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
          { id: 208, name: "Clio Pro Eye Palette No.6 Cherry Bomb", price: 4800, rating: 4.6, reviews: 8900, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
        ],
      },
    ],
    outroTitle: "Your Canvas, Your Rules",
    outroText: `Korean makeup philosophy is rooted in self-expression and skin-first beauty. Many K-beauty makeup products contain skincare ingredients so you're treating your skin while you wear it. Start with a good base, add color where you like it, and finish with a setting spray for all-day wear. Explore our full makeup range and find your favorite products.`,
    outroTip: "💡 Pro Tip: Korean gradient lips (ombré lips) are easy to achieve — just apply your lip tint to the center of your lips and blend outward with your finger.",
  },
  3: {
    title: "The Best of K-Beauty",
    subtitle: "Global favorites delivered to your door",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop",
    accent: "Bestsellers",
    color: "from-[#fff8f0] to-[#ffe8cc]",
    introTitle: "Why the World Loves K-Beauty",
    introText: `Korean beauty has become a global phenomenon for good reason — it works. Decades of dermatological research, a culture obsessed with skincare, and an innovative approach to ingredients have produced a catalogue of products that genuinely deliver results. From the 10-step routine that revolutionised skincare to single-ingredient heroes like snail mucin and propolis, K-beauty is endlessly fascinating and deeply effective.`,
    sections: [
      {
        id: "k1",
        title: "⭐ Global Bestsellers",
        badge: "Most Loved Worldwide",
        description: "Products that have earned cult status across the globe. Tried, tested, and trusted by millions.",
        products: [
          { id: 301, name: "COSRX Snail 96 Mucin Power Essence", price: 4100, rating: 4.9, reviews: 42000, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80" },
          { id: 302, name: "Laneige Lip Sleeping Mask", price: 3200, rating: 4.9, reviews: 38500, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80" },
          { id: 303, name: "Beauty of Joseon Relief Sun SPF50+", price: 3800, rating: 4.9, reviews: 35000, image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80" },
          { id: 304, name: "Innisfree Green Tea Seed Serum", price: 4600, rating: 4.8, reviews: 27000, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
        ],
      },
    ],
    outroTitle: "Join the K-Beauty Movement",
    outroText: `With millions of devotees worldwide and a growing scientific backing, K-beauty isn't a trend — it's a lifestyle. Explore our full catalogue, read reviews from real customers, and find the products that will transform your routine.`,
    outroTip: "💡 Pro Tip: New to K-beauty? Start with a simple 3-step routine: cleanser, moisturiser, SPF. Build from there as you understand your skin's needs.",
  },
  4: {
    title: "Essential Hair Care",
    subtitle: "Revitalize your hair with premium nutrients",
    image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?q=80&w=1600&auto=format&fit=crop",
    accent: "Daily Essentials",
    color: "from-[#f0fff4] to-[#d4f5e1]",
    introTitle: "Healthy Hair, Happy You",
    introText: `Korean hair care applies the same ingredient-forward, skin-first philosophy to your hair. Rich fermented extracts, peptides, and botanical oils nourish the scalp — the foundation of healthy hair — while strengthening each strand from root to tip. Whether your goal is shine, volume, moisture, or scalp health, the right K-beauty hair routine can transform your hair completely.`,
    sections: [
      {
        id: "h1",
        title: "🌿 Shampoo & Conditioner",
        badge: "The Foundation",
        description: "Gentle yet powerful cleansing and conditioning for all hair types.",
        products: [
          { id: 401, name: "Aromatica Tea Tree Balancing Shampoo", price: 3600, rating: 4.7, reviews: 8900, image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80" },
          { id: 402, name: "MASIL 8 Seconds Salon Hair Mask", price: 4200, rating: 4.8, reviews: 12400, image: "https://images.unsplash.com/photo-1527799822367-a4886d63f993?w=400&q=80" },
          { id: 403, name: "Amos Professional Perfume Therapy Conditioner", price: 3900, rating: 4.6, reviews: 7200, image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80" },
          { id: 404, name: "Mise en Scène Perfect Serum Original", price: 2800, rating: 4.7, reviews: 15600, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80" },
        ],
      },
    ],
    outroTitle: "Invest in Your Hair",
    outroText: `Consistency is key with hair care. A weekly deep conditioning treatment, daily scalp massage, and the right shampoo for your hair type are the foundations of a great routine. Browse our full hair care range for scalp treatments, styling products, and premium korean tools.`,
    outroTip: "💡 Pro Tip: Massage your scalp for 3-5 minutes before shampooing to boost circulation and promote healthier hair growth.",
  },
  5: {
    title: "Healthy Living & Supplements",
    subtitle: "Fuel your body with the best organic products",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    accent: "Bio Organic",
    color: "from-[#f0fdf4] to-[#dcfce7]",
    introTitle: "Wellness from Within",
    introText: `True beauty and wellbeing starts on the inside. Korean health and wellness culture emphasises balance — nutritious food, mindful habits, and targeted supplements to support your body's natural rhythms. Whether you're looking for collagen for your skin, probiotics for gut health, or energy-boosting superfoods, this collection has the finest Korean health products to complement your lifestyle.`,
    sections: [
      {
        id: "w1",
        title: "✨ Beauty Supplements",
        badge: "Inner Glow",
        description: "Collagen, ceramides, and biotin from the inside out — because great skin starts with what you eat.",
        products: [
          { id: 501, name: "Neogen Collagen Peptide Ampoule", price: 5400, rating: 4.8, reviews: 9800, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
          { id: 502, name: "Lacto-Fit Slim Probiotics 5X", price: 4800, rating: 4.7, reviews: 13200, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80" },
          { id: 503, name: "Korea Ginseng Corp Red Ginseng Extract", price: 7200, rating: 4.9, reviews: 22000, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" },
          { id: 504, name: "Drinkdrink Collagen Rice Drink", price: 3100, rating: 4.6, reviews: 6700, image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80" },
        ],
      },
    ],
    outroTitle: "A Holistic Approach to Beauty",
    outroText: `The best version of you comes from taking care of your whole self — body, mind, and skin. Combine quality supplements with a consistent skincare routine, adequate hydration, and plenty of sleep to see the most dramatic results. Explore our full wellness range and build habits that last.`,
    outroTip: "💡 Pro Tip: Marine collagen is more bioavailable than bovine collagen — meaning your body absorbs more of it. Look for hydrolysed collagen peptides for faster results.",
  },
}

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-[#ff1268] text-[#ff1268]" : "fill-gray-200 text-gray-200"}`} />
        ))}
      </div>
      <span className="text-[11px] text-[#888]">({reviews?.toLocaleString()})</span>
    </div>
  )
}

function ProductCard({ p }) {
  const { addToCart } = useCart()
  const [wished, setWished] = useState(false)

  return (
    <div className="group bg-white border border-[#eee] rounded-xl overflow-hidden hover:shadow-lg transition-shadow shrink-0 w-[220px]">
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <button
          onClick={() => setWished(w => !w)}
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-[#ff1268] text-[#ff1268]" : "text-[#bbb]"}`} strokeWidth={1.5} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[13px] font-semibold text-[#111] line-clamp-2 leading-snug mb-1">{p.name}</p>
        <StarRating rating={p.rating} reviews={p.reviews} />
        <p className="text-[17px] font-black text-[#111] mt-2">LKR {p.price.toLocaleString("en-IN")}</p>
        <button
          onClick={() => { addToCart(p, 1); toast.success("Added to cart!", { icon: "🛒" }) }}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-[#ff1268] hover:bg-[#e00d59] text-white text-[12px] font-bold rounded-lg transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
    </div>
  )
}

function SubTopicSection({ section }) {
  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-3">
        <div>
          <span className="text-[11px] font-bold text-[#ff1268] bg-[#ffebf0] px-2 py-0.5 rounded-full">{section.badge}</span>
          <h2 className="text-[24px] font-black text-[#111] mt-1">{section.title}</h2>
          <p className="text-[15px] text-[#666] mt-1 max-w-[600px]">{section.description}</p>
        </div>
      </div>

      {/* Products horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {section.products.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}

export default function BannerPage() {
  const { id } = useParams()
  const banner = BANNER_DATA[Number(id)]

  if (!banner) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-[22px] font-bold text-[#aaa]">Banner not found</p>
          <Link to="/" className="text-[#ff1268] hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <Header />

      {/* ── Full-width Banner Hero ── */}
      <div className="relative h-[320px] md:h-[500px] w-full overflow-hidden">
        <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-[1100px] mx-auto">
          <span className="text-[12px] md:text-[14px] font-bold text-white/80 tracking-widest uppercase mb-2">{banner.accent}</span>
          <h1 className="text-[34px] md:text-[56px] font-black text-white leading-tight tracking-tight mb-4">{banner.title}</h1>
          <p className="text-[16px] md:text-[20px] text-white/90 max-w-[500px]">{banner.subtitle}</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-14">

        {/* ── Intro Block ── */}
        <div className={`bg-gradient-to-br ${banner.color} rounded-2xl p-8 md:p-12 mb-16`}>
          <h2 className="text-[26px] font-black text-[#111] mb-4">{banner.introTitle}</h2>
          <p className="text-[16px] text-[#444] leading-relaxed max-w-[720px]">{banner.introText}</p>
        </div>

        {/* ── Sub-Topic Product Sections ── */}
        {banner.sections.map(section => (
          <SubTopicSection key={section.id} section={section} />
        ))}

        {/* ── Closing Info Block ── */}
        <div className="bg-[#111] rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-[24px] font-black mb-4">{banner.outroTitle}</h2>
          <p className="text-[15px] text-white/80 leading-relaxed mb-6 max-w-[720px]">{banner.outroText}</p>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-[14px] text-white/90 leading-relaxed">{banner.outroTip}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 bg-[#ff1268] hover:bg-[#e00d59] text-white font-bold px-8 py-3 rounded-full transition-colors"
          >
            Continue Shopping <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  )
}
