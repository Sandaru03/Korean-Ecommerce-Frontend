import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { Footer } from "@/components/coupang/footer"
import { BannerTopicSection } from "@/components/coupang/BannerTopicSection"
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { AdBannerSlider } from "@/components/coupang/AdBannerSlider"
import { ReelsSection } from "@/components/coupang/ReelsSection"
import { GridBannerSection } from "@/components/coupang/GridBannerSection"
import { TimeDealsSection } from "@/components/coupang/TimeDealsSection"

function resolveImage(p) {
    let imgs = p.images
    if (typeof imgs === "string") {
        try { imgs = JSON.parse(imgs) } catch { imgs = [imgs] }
    }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0]
    return p.image || null
}

import { CommonProductCard } from "@/components/coupang/CommonProductCard"

// Removed OliveCard local definition as it's now shared as CommonProductCard

// ── Horizontal scrolling topic strip ───────────────────────────
function TopicStrip({ title, products }) {
    return (
        <section className="mb-6 md:mb-14">
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-[22px] font-bold text-[#111] tracking-tight">{title}</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
                {products.slice(0, 10).map(p => (
                    <div key={p.id} className="snap-start w-[240px] shrink-0">
                        <CommonProductCard product={p} />
                    </div>
                ))}
            </div>
        </section>
    )
}

// ── Empty state ────────────────────────────────────────────────
function EmptyTopics() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-[#eee]" strokeWidth={1} />
            <p className="text-[20px] font-bold text-[#ccc]">No products yet</p>
            <p className="text-[14px] text-[#bbb]">Add topics and products from the Admin panel to display them here.</p>
        </div>
    )
}

// ── Middle Banner Section ─────────────────────────────────────
function MiddleBannerSection({ banners }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const [touchStartX, setTouchStartX] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    if (!banners || banners.length === 0) return null;

    return (
        <section 
            className="mb-6 md:mb-14 relative group"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden">
                <div 
                    className="flex transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu backface-hidden will-change-transform"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner) => (
                        <div key={banner.id} className="min-w-full shrink-0 relative">
                            <Link to={banner.link || '#'} className="block w-full h-full group/item">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-60" />
                                <img 
                                    src={banner.image} 
                                    alt="Promotion" 
                                    className="w-full h-[220px] md:h-[420px] object-contain block bg-[#f8f8f8] transition-transform duration-1000 group-hover/item:scale-110" 
                                />
                                <div className="absolute bottom-10 left-10 z-20 transition-all duration-500 transform translate-y-2 group-hover/item:translate-y-0 opacity-0 group-hover/item:opacity-100 hidden md:block">
                                    <span className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-lg text-sm tracking-uppercase">Explore Collection</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-2xl text-slate-900 border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white scale-75 group-hover:scale-100 z-30 hidden lg:flex"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-2xl text-slate-900 border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white scale-75 group-hover:scale-100 z-30 hidden lg:flex"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`transition-all duration-500 rounded-full ${
                                    idx === currentIndex 
                                    ? "bg-black w-10 h-2" 
                                    : "bg-slate-300 w-2 h-2 hover:bg-slate-400"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export default function HomePage() {
    const [categories, setCategories] = useState([])
    const [topics, setTopics] = useState([])
    const [middleBanners, setMiddleBanners] = useState([])
    const [topicsLoading, setTopicsLoading] = useState(true)
    const [sectionLabels, setSectionLabels] = useState({})
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

    useEffect(() => {
        fetch(`${backendUrl}/categories`)
            .then(r => r.json())
            .then(d => { if (d.categories) setCategories(d.categories) })
            .catch(console.error)

        fetch(`${backendUrl}/homepage-topics`)
            .then(r => r.json())
            .then(d => { if (d.success) setTopics(d.topics) })
            .catch(console.error)
            .finally(() => setTopicsLoading(false))

        fetch(`${backendUrl}/middle-banners`)
            .then(r => r.json())
            .then(d => { if (d.success) setMiddleBanners(d.banners) })
            .catch(console.error)

        fetch(`${backendUrl}/section-labels`)
            .then(r => r.json())
            .then(d => { if (d.success) setSectionLabels(d.labels) })
            .catch(console.error)
    }, [backendUrl])

    // Root categories de-duplicated by ID
    const rootCategories = Array.from(
        new Map(categories.filter(c => c.parentId === null).map(c => [c.id, c])).values()
    );

    // Active topics de-duplicated by ID
    const activeTopicsWithProducts = Array.from(
        new Map(topics.filter(t => t.active && (t.products?.length > 0 || t.bannerImage)).map(t => [t.id, t])).values()
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
            <Header />

            {/* Hero Banner */}
            <div className="w-full mt-0 md:mt-0 mb-6 md:mb-14">
                <HeroBanner />
            </div>

            {/* Round Icon Categories */}
            {rootCategories.length > 0 && (
                <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-16">
                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-0">
                        <div className="grid grid-rows-2 grid-flow-col gap-x-1 gap-y-2 min-w-max md:grid md:grid-rows-1 md:grid-cols-10 md:grid-flow-row md:gap-x-2 md:min-w-0">
                            {rootCategories.map((cat, idx) => (
                                <Link key={cat.id || idx} to={`/super-category/${cat.slug}`} className="flex flex-col items-center gap-1 group w-[76px] md:w-auto">
                                    <div className="w-[58px] h-[58px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden border border-[#eaeaea] bg-[#f8f8f8] shrink-0">
                                        {cat.image
                                            ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                                            : <div className="w-full h-full bg-gradient-to-br from-accent to-accent/50" />
                                        }
                                    </div>
                                    <span className="text-[10.5px] md:text-[13px] text-[#333] font-medium text-center leading-tight group-hover:text-primary transition-colors">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Topic 1 ─────────────────────────────────────────── */}
            {!topicsLoading && activeTopicsWithProducts[0] && (
                <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                    {activeTopicsWithProducts[0].bannerImages?.length > 0 || activeTopicsWithProducts[0].bannerImage ? (
                        <BannerTopicSection title={activeTopicsWithProducts[0].title} products={activeTopicsWithProducts[0].products} bannerImage={activeTopicsWithProducts[0].bannerImage} bannerImages={activeTopicsWithProducts[0].bannerImages} />
                    ) : (
                        <TopicStrip title={activeTopicsWithProducts[0].title} products={activeTopicsWithProducts[0].products} />
                    )}
                </div>
            )}

            {/* ── Grid Banners ─────────────────────────────────────── */}
            <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                <GridBannerSection title={sectionLabels.gridBannerTitle || ""} />
            </div>

            {/* ── Time Deals ───────────────────────────────────────── */}
            <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                <TimeDealsSection />
            </div>

            {/* ── Ad Banners ───────────────────────────────────────── */}
            <div className="w-full md:mx-auto md:max-w-[1040px] px-0 md:px-4 mb-8 md:mb-14">
                <AdBannerSlider />
            </div>

            {/* ── Topic 2 ─────────────────────────────────────────── */}
            {!topicsLoading && activeTopicsWithProducts[1] && (
                <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                    {activeTopicsWithProducts[1].bannerImages?.length > 0 || activeTopicsWithProducts[1].bannerImage ? (
                        <BannerTopicSection title={activeTopicsWithProducts[1].title} products={activeTopicsWithProducts[1].products} bannerImage={activeTopicsWithProducts[1].bannerImage} bannerImages={activeTopicsWithProducts[1].bannerImages} />
                    ) : (
                        <TopicStrip title={activeTopicsWithProducts[1].title} products={activeTopicsWithProducts[1].products} />
                    )}
                </div>
            )}

            {/* ── Reels ────────────────────────────────────────────── */}
            <div className="-mx-0 mb-8 md:mb-14">
                <ReelsSection />
            </div>

            {/* ── Topic 3 ─────────────────────────────────────────── */}
            {!topicsLoading && activeTopicsWithProducts[2] && (
                <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                    {activeTopicsWithProducts[2].bannerImages?.length > 0 || activeTopicsWithProducts[2].bannerImage ? (
                        <BannerTopicSection title={activeTopicsWithProducts[2].title} products={activeTopicsWithProducts[2].products} bannerImage={activeTopicsWithProducts[2].bannerImage} bannerImages={activeTopicsWithProducts[2].bannerImages} />
                    ) : (
                        <TopicStrip title={activeTopicsWithProducts[2].title} products={activeTopicsWithProducts[2].products} />
                    )}
                </div>
            )}

            {/* ── Middle Banner ─────────────────────────────────────── */}
            {middleBanners.length > 0 && (
                <div className="mx-auto max-w-[1040px] px-4 mb-8 md:mb-12">
                    {sectionLabels.middleBannerTitle && (
                        <h2 className="text-[22px] font-bold text-[#111] tracking-tight mb-4">
                            {sectionLabels.middleBannerTitle}
                        </h2>
                    )}
                    <MiddleBannerSection banners={middleBanners} />
                </div>
            )}

            {/* ── Remaining Topics (4th onwards) ───────────────────── */}
            {!topicsLoading && activeTopicsWithProducts.length > 3 && (
                <div className="mx-auto max-w-[1040px] px-4 space-y-8 md:space-y-12">
                    {activeTopicsWithProducts.slice(3).map((topic) => (
                        <div key={topic.id}>
                            {topic.bannerImages?.length > 0 || topic.bannerImage ? (
                                <BannerTopicSection title={topic.title} products={topic.products} bannerImage={topic.bannerImage} bannerImages={topic.bannerImages} />
                            ) : (
                                <TopicStrip title={topic.title} products={topic.products} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state if no topics at all */}
            {!topicsLoading && activeTopicsWithProducts.length === 0 && <EmptyTopics />}

            <Footer />
        </div>
    )
}
