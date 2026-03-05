import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { Footer } from "@/components/coupang/footer"
import { ChevronRight, ChevronLeft, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

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

const categories = [
    { name: "Skincare", path: "/category/skin-care" },
    { name: "Makeup/Nails", path: "/category/makeup" },
    { name: "Beauty Tools", path: "/category/k-beauty" },
    { name: "Dermo-Cosmetics", path: "/category/skin-care" },
    { name: "Men's Care", path: "/category/skin-care" },
    { name: "Fragrance/Diffuser", path: "/category/k-beauty" },
    { name: "Hair Care", path: "/category/hair-care" },
    { name: "Body Care", path: "/category/skin-care" },
    { name: "Health Supplements", path: "/category/health" },
    { name: "Foods", path: "/category/foods" },
    { name: "Oral/Health Care", path: "/category/health" },
    { name: "Hygiene Products", path: "/category/home" },
    { name: "Life/K-Pop", path: "/category/kpop" },
]

const roundCategories = [
    { name: "Sale BEST", image: "https://picsum.photos/seed/kbeauty1/150/150", path: "/category/makeup" },
    { name: "Minimal Skincare", image: "https://picsum.photos/seed/skincare2/150/150", path: "/category/skin-care" },
    { name: "New products", image: "https://picsum.photos/seed/skincare3/150/150", path: "/category/k-beauty" },
    { name: "slow aging", image: "https://picsum.photos/seed/skincare4/150/150", path: "/category/skin-care" },
    { name: "Clean Beauty", image: "https://picsum.photos/seed/skincare5/150/150", path: "/category/skin-care" },
    { name: "Skincare", image: "https://picsum.photos/seed/skincare6/150/150", path: "/category/skin-care" },
    { name: "Makeup", image: "https://picsum.photos/seed/makeup1/150/150", path: "/category/makeup" },
    { name: "Hair Care", image: "https://picsum.photos/seed/haircare1/150/150", path: "/category/hair-care" },
    { name: "Body Care", image: "https://picsum.photos/seed/dryskin1/150/150", path: "/category/skin-care" },
    { name: "Health", image: "https://picsum.photos/seed/health1/150/150", path: "/category/health" },
    { name: "Foods", image: "https://picsum.photos/seed/food1/150/150", path: "/category/foods" },
    { name: "Hygiene", image: "https://picsum.photos/seed/home1/150/150", path: "/category/home" },
    { name: "K-Pop", image: "https://picsum.photos/seed/kpop1/150/150", path: "/category/kpop" },
    { name: "Baby & Kids", image: "https://picsum.photos/seed/baby1/150/150", path: "/category/home" },
    { name: "Sports", image: "https://picsum.photos/seed/sports1/150/150", path: "/category/home" },
    { name: "Home & Kitchen", image: "https://picsum.photos/seed/home2/150/150", path: "/category/home" },
    { name: "Beauty Tools", image: "https://picsum.photos/seed/makeup2/150/150", path: "/category/k-beauty" },
    { name: "Men's Care", image: "https://picsum.photos/seed/oilyskin1/150/150", path: "/category/skin-care" },
    { name: "Fragrance", image: "https://picsum.photos/seed/haircare2/150/150", path: "/category/k-beauty" },
    { name: "Dermo-Cosmetics", image: "https://picsum.photos/seed/dryskin2/150/150", path: "/category/skin-care" },
]

function OliveCard({ p }) {
    const [wished, setWished] = useState(false);

    // Parse numeric price for calculation (assuming price is like "$15.99" or "15,000원")
    const rawPriceMatch = p.price.match(/[\d,.]+/);
    const rawPrice = rawPriceMatch ? rawPriceMatch[0] : p.price;

    // Extract brand from name
    const brandName = p.name.split(" ")[0];
    const discountPct = p.discount ? p.discount.replace("%", "") : null;

    return (
        <div className="group flex flex-col relative w-[240px] shrink-0">
            {/* Image Box */}
            <div className="relative aspect-square overflow-hidden bg-[#f8f8f8] mb-3 border border-[#eee] rounded-[4px]">
                <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </Link>
                <button
                    onClick={(e) => { e.preventDefault(); setWished(w => !w); }}
                    className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
                >
                    <Heart className={`h-4 w-4 ${wished ? "fill-[#ff1268] text-[#ff1268]" : "text-[#999]"}`} strokeWidth={1.5} />
                </button>
            </div>

            {/* Details */}
            <Link to={`/product/${p.id}`} className="flex flex-col flex-1">
                <p className="text-[12px] font-bold text-[#111] mb-0.5">{brandName}</p>
                <p className="text-[13px] text-[#333] line-clamp-2 leading-snug mb-2">{p.name}</p>

                <div className="flex items-baseline gap-1.5 mt-auto">
                    {discountPct && (
                        <span className="text-[18px] font-black text-[#e2211c] leading-none">{discountPct}%</span>
                    )}
                    <span className="text-[18px] font-black text-[#111] leading-none">{rawPrice}<span className="text-[14px] font-bold text-[#111]">원</span></span>
                    {p.originalPrice && (
                        <span className="text-[11px] text-[#999] line-through ml-0.5 leading-none">{p.originalPrice}</span>
                    )}
                </div>

                {/* Badges */}
                <div className="flex gap-1 mt-2.5 flex-wrap">
                    <span className="bg-[#ffebf0] text-[#ff1268] text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">Today Delivery</span>
                    <span className="bg-[#f0f0f0] text-[#555] text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">BEST</span>
                </div>
            </Link>
        </div>
    )
}

function HorizontalProductStrip({ title, products, link = "#" }) {
    return (
        <section className="mb-14">
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-[22px] font-bold text-[#111] tracking-tight">{title}</h2>
                <Link to={link} className="text-[13px] text-[#777] hover:text-[#111] flex items-center gap-0.5">
                    View More <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
                    {products.slice(0, 10).map(p => (
                        <div key={p.id} className="snap-start">
                            <OliveCard p={p} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeatureRankingCard({ p, rank }) {
    const brandName = p.name.split(" ")[0];
    const discountPct = p.discount ? p.discount.replace("%", "") : null;
    const rawPriceMatch = p.price.match(/[\d,.]+/);
    const rawPrice = rawPriceMatch ? rawPriceMatch[0] : p.price;

    return (
        <Link to={`/product/${p.id}`} className="block relative w-[380px] shrink-0 border border-[#eee] rounded-[8px] overflow-hidden bg-white shadow-sm group">
            <div className="aspect-[4/3] bg-[#f8f8f8] overflow-hidden relative">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-0 left-0 bg-[#ff1268] text-white font-black text-[22px] w-[40px] h-[40px] flex items-center justify-center rounded-br-[8px]">
                    {rank}
                </div>
            </div>
            <div className="p-5">
                <span className="text-[#ff1268] text-[12px] font-bold bg-[#ffebf0] px-2 py-1 rounded-[4px] inline-flex items-center gap-1 mb-3">
                    🔥 1,234 people are viewing this
                </span>
                <p className="text-[12px] font-bold text-[#111] mb-1">{brandName}</p>
                <p className="text-[15px] text-[#111] leading-snug line-clamp-2 mb-3">{p.name}</p>

                <div className="flex items-baseline gap-1.5 mt-auto">
                    {discountPct && (
                        <span className="text-[22px] font-black text-[#e2211c] leading-none">{discountPct}%</span>
                    )}
                    <span className="text-[22px] font-black text-[#111] leading-none">{rawPrice}<span className="text-[16px] font-bold text-[#111]">원</span></span>
                </div>
            </div>
        </Link>
    )
}

function CuratedList({ title, products, link = "#" }) {
    return (
        <div className="flex-1 min-w-0">
            <div className="flex items-end justify-between mb-4 px-1">
                <h3 className="text-[20px] font-bold text-[#111] tracking-tight">{title}</h3>
                <Link to={link} className="text-[13px] text-[#777] hover:text-[#111] flex items-center gap-0.5">
                    View More <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>
            <div className="space-y-3">
                {products.slice(0, 3).map((p, idx) => {
                    const rawPriceMatch = p.price.match(/[\d,.]+/);
                    const rawPrice = rawPriceMatch ? rawPriceMatch[0] : p.price;
                    return (
                        <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-4 bg-white border border-[#eee] rounded-[8px] p-4 hover:shadow-md transition-shadow group">
                            <div className="relative h-[100px] w-[100px] bg-[#f8f8f8] rounded-[4px] overflow-hidden shrink-0">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute top-0 left-0 bg-[#333] text-white text-[12px] font-bold w-[24px] h-[24px] flex items-center justify-center rounded-br-[4px]">
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-[#111] mb-1">{p.name.split(" ")[0]}</p>
                                <p className="text-[14px] text-[#333] mb-2 line-clamp-2 leading-tight">{p.name}</p>
                                <div className="flex items-baseline gap-1.5">
                                    {p.discount && <span className="text-[16px] font-black text-[#e2211c] leading-none">{p.discount.replace("%", "")}%</span>}
                                    <span className="text-[16px] font-black text-[#111] leading-none">{rawPrice}원</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white pb-20">
            {/* ── Sticky header with search + cart ── */}
            <Header />

            {/* ── Top Navigation Bar (Olive Young Sub Nav) ── */}
            <div className="border-b border-[#eee] bg-white relative z-50 hidden md:block">
                <div className="mx-auto max-w-[1040px] px-4 flex">
                    {/* Categories Hover Trigger */}
                    <div className="w-[180px] shrink-0 border-r border-l border-[#eee] relative group">
                        <button className="w-full py-3.5 px-4 text-[15px] font-bold text-[#111] flex items-center gap-2 group-hover:text-[#ff1268] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                            Category
                        </button>

                        {/* Hover Dropdown Menu */}
                        <div className="absolute top-full left-[-1px] w-[200px] bg-white border border-[#eee] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul className="py-2">
                                {categories.map(cat => (
                                    <li key={cat.name}>
                                        <Link to={cat.path} className="block px-6 py-2.5 text-[14px] text-[#333] font-medium hover:bg-[#f8f9fa] hover:text-[#ff1268] transition-colors">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Header Links */}
                    <div className="flex-1 flex gap-8 items-center px-8 text-[15px] font-bold text-[#111]">
                        <Link to="/category/makeup" className="hover:text-[#ff1268] transition">Special Deals</Link>
                        <Link to="/category/skin-care" className="hover:text-[#ff1268] transition">Ranking</Link>
                        <Link to="/category/k-beauty" className="hover:text-[#ff1268] transition">Only at OY</Link>
                        <Link to="/category/hair-care" className="hover:text-[#ff1268] transition">LUXE EDIT</Link>
                        <Link to="/category/skin-care" className="hover:text-[#ff1268] transition">Events</Link>
                        <Link to="/category/health" className="hover:text-[#ff1268] transition">Sale</Link>
                    </div>
                </div>
            </div>

            {/* ── Full Width Hero Section ── */}
            <div className="w-full mb-14">
                <HeroBanner />
            </div>

            {/* ── Round Icon Categories (20 Items) ── */}
            <div className="mx-auto max-w-[1040px] px-4 mb-20">
                <div className="flex flex-wrap md:grid md:grid-cols-10 gap-y-8 gap-x-2">
                    {roundCategories.map((cat, idx) => (
                        <Link key={idx} to={cat.path} className="flex flex-col items-center gap-3 group w-[20%] md:w-auto">
                            <div className="w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden border border-[#eaeaea] bg-[#f8f8f8] shrink-0">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                            </div>
                            <span className="text-[12px] md:text-[13px] text-[#333] font-medium text-center leading-tight group-hover:text-[#ff1268] transition-colors whitespace-pre-wrap">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Main Content Container ── */}
            <div className="mx-auto max-w-[1040px] px-4 space-y-20">

                {/* ── Curated Lists (2 Columns) ── */}
                <div className="flex flex-col md:flex-row gap-8">
                    <CuratedList title="Trending Products Now" products={kBeautyProducts} link="/category/k-beauty" />
                    <CuratedList title="Recommended just for you" products={skinCareProducts} link="/category/skin-care" />
                </div>

                {/* ── Real-time Ranking ── */}
                <section>
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[22px] font-bold text-[#111] tracking-tight">Real-time Ranking</h2>
                            <span className="text-[13px] text-[#777] font-medium border border-[#ddd] px-2 py-0.5 rounded-full">All</span>
                        </div>
                        <Link to="/category/makeup" className="text-[13px] text-[#777] hover:text-[#111] flex items-center gap-0.5">
                            View More <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Top Rank Feature Card */}
                        <FeatureRankingCard p={makeupProducts[0]} rank={1} />

                        {/* List format for ranks 2-5 */}
                        <div className="flex-1 flex flex-col justify-between">
                            {[2, 3, 4].map((rank, idx) => {
                                const p = makeupProducts[idx + 1];
                                const rawPriceMatch = p.price.match(/[\d,.]+/);
                                const rawPrice = rawPriceMatch ? rawPriceMatch[0] : p.price;
                                return (
                                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-5 border-b border-[#eee] py-4 group hover:bg-[#fcfcfc] transition-colors rounded-lg px-2">
                                        <span className="text-[20px] font-black text-[#111] w-[20px] text-center">{rank}</span>
                                        <div className="w-[72px] h-[72px] shrink-0 bg-[#f8f8f8] rounded-[4px] overflow-hidden border border-[#eee]">
                                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[12px] font-bold text-[#111] mb-0.5">{p.name.split(" ")[0]}</p>
                                            <p className="text-[14px] text-[#555] line-clamp-1 group-hover:underline">{p.name}</p>
                                        </div>
                                        <div className="flex items-baseline gap-1 text-right">
                                            {p.discount && <span className="text-[16px] font-black text-[#e2211c]">{p.discount.replace("%", "")}%</span>}
                                            <span className="text-[16px] font-bold text-[#111]">{rawPrice}<span className="text-[14px] font-medium ml-0.5">원</span></span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Promo Banner Pair ── */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/category/hair-care" className="relative h-[200px] rounded-[12px] overflow-hidden group bg-[#eee] block">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ffe4e1] to-[#fce4ec]"></div>
                        <div className="absolute inset-0 px-8 py-10 flex flex-col justify-center">
                            <span className="text-[12px] font-bold bg-[#111] text-white px-2 py-0.5 rounded-sm self-start mb-3">WEEKLY</span>
                            <h3 className="text-[22px] font-black text-[#111] mb-1 relative z-10 group-hover:underline decoration-2 underline-offset-4">Fragrant Hair Care Collection</h3>
                            <p className="text-[15px] text-[#555] relative z-10">Scents that welcome spring</p>
                        </div>
                        <div className="absolute right-4 bottom-0 top-6 w-[140px]">
                            <img src={hairCareProducts[0].image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 origin-bottom" />
                        </div>
                    </Link>
                    <Link to="/category/kpop" className="relative h-[200px] rounded-[12px] overflow-hidden group bg-[#eee] block">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2f1] to-[#e8f5e9]"></div>
                        <div className="absolute inset-0 px-8 py-10 flex flex-col justify-center">
                            <span className="text-[12px] font-bold bg-[#ff1268] text-white px-2 py-0.5 rounded-sm self-start mb-3">HOT</span>
                            <h3 className="text-[22px] font-black text-[#111] mb-1 relative z-10 group-hover:underline decoration-2 underline-offset-4">K-Pop Idol Goods Special</h3>
                            <p className="text-[15px] text-[#555] relative z-10">From lightsticks to albums</p>
                        </div>
                        <div className="absolute right-4 bottom-0 top-6 w-[140px]">
                            <img src={kpopProducts[0].image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 origin-bottom" />
                        </div>
                    </Link>
                </div>

                {/* ── Horizontal Strips ── */}
                <HorizontalProductStrip title="Editor's Pick Beauty Items" products={oilySkinProducts} link="/category/oily-skin" />
                <HorizontalProductStrip title="Only at Olive Young!" products={healthProducts} link="/category/health" />
                <HorizontalProductStrip title="Today's Deal" products={foodProducts} link="/category/foods" />

            </div>

            <Footer />
        </div>
    )
}
