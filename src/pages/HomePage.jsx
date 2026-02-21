import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { CategoryIcons } from "@/components/coupang/category-icons"
import { PromoBannerStrip } from "@/components/coupang/promo-banner-strip"
import { Footer } from "@/components/coupang/footer"
import { ProductSection } from "@/components/coupang/product-section"
import { ChevronRight, Zap, Flame, Clock } from "lucide-react"

import {
    kBeautyProducts,
    skinCareProducts,
    drySkinProducts,
    oilySkinProducts,
    kpopProducts,
    makeupProducts,
    hairCareProducts,
    healthProducts,
    foodProducts,
    homeProducts,
    babyProducts,
    sportsProducts,
} from "@/lib/product-data"

/* ── Mini product card used inside split-layout sections ── */
function MiniCard({ p }) {
    return (
        <a href="#" className="group flex flex-col bg-white border border-[#f0f0f0] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square overflow-hidden bg-[#f8f8f8]">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div className="p-2">
                <p className="text-[11px] text-[#333] line-clamp-2 leading-tight">{p.name}</p>
                <p className="mt-1 text-[12px] font-bold text-coupang-red">{p.price}</p>
                {p.discount && (
                    <p className="text-[10px] text-[#999] line-through">{p.originalPrice}</p>
                )}
            </div>
        </a>
    )
}

/* ── Feature banner with 4 products grid on the right ── */
function SplitSection({ gradient, tag, title, subtitle, cta, products }) {
    return (
        <section className="bg-white py-4 border-b border-[#f0f0f0]">
            <div className="mx-auto max-w-[1280px] px-4">
                <div className="flex gap-3">
                    {/* Left – promo card */}
                    <div className={`hidden md:flex w-[200px] shrink-0 flex-col justify-between rounded-xl p-5 text-white ${gradient}`}>
                        {tag && <span className="inline-block self-start text-[10px] font-bold bg-white/30 px-2 py-0.5 rounded-full mb-2">{tag}</span>}
                        <div>
                            <p className="text-xs opacity-80 mb-1">{subtitle}</p>
                            <h3 className="text-lg font-black leading-tight">{title}</h3>
                        </div>
                        <a href="#" className="mt-4 self-start inline-flex items-center text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition">
                            {cta} <ChevronRight className="h-3 w-3 ml-0.5" />
                        </a>
                    </div>

                    {/* Right – product grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {products.slice(0, 4).map(p => <MiniCard key={p.id} p={p} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ── Flash sale / deal banner ── */
function FlashBanner({ color = "#e44d2e", label, href = "#" }) {
    return (
        <section className="py-0">
            <a href={href}>
                <div className="mx-0" style={{ background: color }}>
                    <div className="mx-auto max-w-[1280px] px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <Zap className="h-5 w-5 fill-white" />
                            <span className="text-sm font-black tracking-wide">{label}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Limited Time</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </a>
        </section>
    )
}

/* ── Wide promotional banner ── */
function WideBanner({ gradient, icon: Icon, title, subtitle, accentText }) {
    return (
        <section className="py-0">
            <div className={`${gradient} py-8`}>
                <div className="mx-auto max-w-[1280px] px-6 flex items-center justify-between">
                    <div className="text-white">
                        {accentText && <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-1">{accentText}</p>}
                        <h2 className="text-2xl md:text-3xl font-black">{title}</h2>
                        <p className="text-sm md:text-base opacity-85 mt-1 max-w-sm">{subtitle}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <a href="#" className="bg-white text-gray-800 px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition">
                            Shop Now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans">
            {/* ── Top announcement bar ── */}
            <TopBanner />

            {/* ── Sticky header with search + cart ── */}
            <Header />

            {/* ── Hero carousel (auto-slides) ── */}
            <HeroBanner />

            {/* ── Promo trust strip ── */}
            <PromoBannerStrip />

            {/* ── Category icon grid ── */}
            <div className="bg-white border-b border-[#f0f0f0]">
                <CategoryIcons />
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 1: K-Beauty – full product grid    */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="✨ K-Beauty Picks"
                subtitle="Best sellers from COSRX, Anua, Medicube & more"
                products={kBeautyProducts}
                bgColor="bg-white"
                accentColor="#e91e8c"
            />

            {/* Flash sale strip */}
            <FlashBanner color="#e44d2e" label="⚡ Lightning Deals — Up to 50% Off" />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 2: Skin Care split layout          */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-green-400 to-teal-500"
                tag="HOT"
                title="Skin Care Essentials"
                subtitle="Daily must-haves"
                cta="See All"
                products={skinCareProducts}
            />

            {/* Wide promo – Dry Skin */}
            <WideBanner
                gradient="bg-gradient-to-r from-blue-400 to-cyan-400"
                title="Perfect for Dry Skin"
                subtitle="Hydrating creams, ceramides & moisture serums"
                accentText="Skin Type Collections"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 3: Dry Skin products               */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="💧 Dry Skin Solutions"
                subtitle="Rich moisturisers, ceramides & hyaluronic acid formulas"
                products={drySkinProducts}
                bgColor="bg-white"
                accentColor="#2196F3"
            />

            {/* Wide promo – Oily Skin */}
            <WideBanner
                gradient="bg-gradient-to-r from-teal-500 to-green-500"
                title="For Oily & Combination Skin"
                subtitle="Control shine, minimise pores & stay matte all day"
                accentText="Skin Type Collections"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 4: Oily Skin split layout          */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-teal-400 to-emerald-600"
                tag="NEW"
                title="Oily Skin Control"
                subtitle="BHA, AHA & pore care"
                cta="Shop All"
                products={oilySkinProducts}
            />

            {/* Flash sale strip – K-Pop */}
            <FlashBanner color="#7c3aed" label="🎵 K-Pop Official Merch — Albums, Lightsticks & More" />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 5: K-Pop – full product grid       */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="🎵 K-Pop Merchandise"
                subtitle="Official merch — BTS, BLACKPINK, SEVENTEEN, aespa & more"
                products={kpopProducts}
                bgColor="bg-white"
                accentColor="#7c3aed"
            />

            {/* Wide promo – Makeup */}
            <WideBanner
                gradient="bg-gradient-to-r from-pink-500 to-rose-500"
                title="K-Beauty Makeup"
                subtitle="ROMAND, Laneige, 3CE, CLIO — Korea's top makeup brands"
                accentText="Trending Now"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 6: Makeup split layout             */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-pink-400 to-rose-600"
                tag="TREND"
                title="Makeup Must-Haves"
                subtitle="Tints, shadows & foundation"
                cta="View All"
                products={makeupProducts}
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 7: Hair Care – full grid           */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="💇 Hair Care"
                subtitle="Repair, volumise and nourish — Korean hair care bestsellers"
                products={hairCareProducts}
                bgColor="bg-white"
                accentColor="#FF9800"
            />

            {/* Flash sale – Health */}
            <FlashBanner color="#2e7d32" label="💊 Health & Wellness — Red Ginseng, Collagen & Vitamins" />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 8: Health split layout             */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-green-500 to-emerald-700"
                tag="DAILY"
                title="Health & Supplements"
                subtitle="Collagen • Probiotics • Vitamins"
                cta="Shop Now"
                products={healthProducts}
            />

            {/* Wide promo – Foods */}
            <WideBanner
                gradient="bg-gradient-to-r from-orange-400 to-red-500"
                title="🍜 Authentic Korean Foods"
                subtitle="Ramen, seaweed, tteokbokki & all your Korean snack favourites"
                accentText="Korean Pantry"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 9: Foods – full grid               */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="🍜 Korean Foods"
                subtitle="Ottogi, Nongshim, Binggrae and more authentic Korean staples"
                products={foodProducts}
                bgColor="bg-white"
                accentColor="#FF5722"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 10: Home & Kitchen split           */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-amber-400 to-amber-600"
                tag="HOME"
                title="Home & Kitchen"
                subtitle="Korean ceramics & cookware"
                cta="Browse"
                products={homeProducts}
            />

            {/* Flash sale – Baby & Kids */}
            <FlashBanner color="#0288d1" label="👶 Baby & Kids — Organic, Safe & Gentle Products" />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 11: Baby & Kids – full grid        */}
            {/* ═══════════════════════════════════════════ */}
            <ProductSection
                title="👶 Baby & Kids"
                subtitle="Safe, organic and gentle essentials for your little ones"
                products={babyProducts}
                bgColor="bg-white"
                accentColor="#03A9F4"
            />

            {/* Wide promo – Sports */}
            <WideBanner
                gradient="bg-gradient-to-r from-indigo-500 to-blue-600"
                title="🏃 Sports & Fitness"
                subtitle="Yoga mats, resistance bands, dumbbells and more"
                accentText="Active Lifestyle"
            />

            {/* ═══════════════════════════════════════════ */}
            {/* SECTION 12: Sports split layout            */}
            {/* ═══════════════════════════════════════════ */}
            <SplitSection
                gradient="bg-gradient-to-b from-indigo-500 to-blue-700"
                tag="FIT"
                title="Sports & Fitness"
                subtitle="Train harder, recover faster"
                cta="Shop Gear"
                products={sportsProducts}
            />

            <Footer />
        </div>
    )
}
