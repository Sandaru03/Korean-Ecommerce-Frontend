import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { Footer } from "@/components/coupang/footer"
import { ChevronRight, ChevronLeft, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

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

// Moved static categories to local state fetched from backend

function OliveCard({ p }) {
    const [wished, setWished] = useState(false);

    // Parse price for calculation (handles both string "$15.99" and number 15000)
    let rawPrice = p.price;
    if (typeof p.price === 'string') {
        const match = p.price.match(/[\d,.]+/);
        rawPrice = match ? match[0] : p.price;
    }
    
    // Extract brand from name
    const brandName = p.name ? p.name.split(" ")[0] : "Brand";
    const discountPct = p.discount ? String(p.discount).replace("%", "") : null;

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
                    <span className="text-[18px] font-black text-[#111] leading-none">LKR {Number(rawPrice).toLocaleString('en-IN')}</span>
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
    if (!p) return null;
    const brandName = p.name ? p.name.split(" ")[0] : "Brand";
    const discountPct = p.discount ? String(p.discount).replace("%", "") : null;
    
    let rawPrice = p.price;
    if (typeof p.price === 'string') {
        const match = p.price.match(/[\d,.]+/);
        rawPrice = match ? match[0] : p.price;
    }

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
                    <span className="text-[22px] font-black text-[#111] leading-none">LKR {Number(rawPrice).toLocaleString('en-IN')}</span>
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
                    if (!p) return null;
                    let rawPrice = p.price;
                    if (typeof p.price === 'string') {
                        const match = p.price.match(/[\d,.]+/);
                        rawPrice = match ? match[0] : p.price;
                    }
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
                                    <span className="text-[16px] font-black text-[#111] leading-none">LKR {Number(rawPrice).toLocaleString('en-IN')}</span>
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
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${backendUrl}/categories`);
                const data = await response.json();
                if (data.categories) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
        
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${backendUrl}/homepage-topics`);
                const data = await response.json();
                if (data.success) {
                    setTopics(data.topics);
                }
            } catch (error) {
                console.error("Error fetching homepage topics:", error);
            }
        };
        fetchTopics();
    }, [backendUrl]);

    // Use fetched categories for both the dropdown and the round icons
    // Filter for top-level categories only
    const rootCategories = categories.filter(c => c.parentId === null);
    const topNavCategories = rootCategories.slice(0, 13);
    const roundIconCategories = rootCategories;

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white pb-20">
            {/* ── Sticky header with search + cart ── */}
            <Header />

            {/* Top Navigation Bar moved to Header.jsx for site-wide consistency */}

            {/* ── Full Width Hero Section ── */}
            <div className="w-full mb-14">
                <HeroBanner />
            </div>

            {/* ── Round Icon Categories (20 Items) ── */}
            <div className="mx-auto max-w-[1040px] px-4 mb-20">
                <div className="flex flex-wrap md:grid md:grid-cols-10 gap-y-8 gap-x-2">
                    {roundIconCategories.map((cat, idx) => (
                        <Link key={cat.id || idx} to={`/super-category/${cat.slug}`} className="flex flex-col items-center gap-3 group w-[20%] md:w-auto">
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
                                            <span className="text-[16px] font-bold text-[#111]">LKR {Number(rawPrice).toLocaleString('en-IN')}</span>
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

                {/* ── Dynamic Horizontal Strips ── */}
                {topics.map(topic => (
                    topic.products && topic.products.length > 0 && (
                        <HorizontalProductStrip 
                            key={topic.id} 
                            title={topic.title} 
                            products={topic.products} 
                            link={`/category/all`} // We can point to a general link for now
                        />
                    )
                ))}

            </div>

            <Footer />
        </div>
    )
}
