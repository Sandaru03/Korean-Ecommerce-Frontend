import { TopBanner } from "@/components/coupang/top-banner"
import { Header } from "@/components/coupang/header"
import { HeroBanner } from "@/components/coupang/hero-banner"
import { CategoryIcons } from "@/components/coupang/category-icons"
import { PromoBannerStrip } from "@/components/coupang/promo-banner-strip"
import { QuickDealBanner } from "@/components/coupang/quick-deal-banner"
import { ProductSection } from "@/components/coupang/product-section"
import { MidPromoBanner } from "@/components/coupang/mid-promo-banner"
import { NewsGallery } from "@/components/coupang/news-gallery"
import { RecommendationSection } from "@/components/coupang/recommendation-section"
import { CollectionLinks } from "@/components/coupang/collection-links"
import { Footer } from "@/components/coupang/footer"
import {
    todayRecommended,
    rocketDeliveryProducts,
    fashionProducts,
    beautyProducts,
    freshProducts,
    electronicsProducts,
    homeProducts,
    goldBoxDeals,
} from "@/lib/product-data"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-section-bg font-sans">
            <TopBanner />
            <Header />

            <main>
                <HeroBanner />
                <CategoryIcons />
                <CollectionLinks />
                <PromoBannerStrip />

                {/* K-Beauty (Priority 1) */}
                <ProductSection
                    title="K-Beauty"
                    subtitle="Discover all things K-Beauty"
                    products={beautyProducts}
                    accentColor="#FF69B4"
                />

                {/* Skin Care (Priority 2) */}
                <div className="py-2 bg-section-bg" />
                <ProductSection
                    title="Skin Care"
                    subtitle="Solutions for every skin type"
                    products={todayRecommended}
                    bgColor="bg-[#e3f2fd]"
                    accentColor="#4FC3F7"
                />

                {/* Lightning Deals */}
                <QuickDealBanner />

                {/* K Pop (Priority 3) - Using Best Sellers for now as placeholder */}
                <div className="py-2 bg-section-bg" />
                <ProductSection
                    title="K Pop"
                    subtitle="Trending K-Pop Merchandise"
                    products={rocketDeliveryProducts}
                    accentColor="#9C27B0"
                />

                {/* Mid Promo Banners */}
                <MidPromoBanner />

                {/* Brand Items (Priority 4) */}
                <ProductSection
                    title="Brand Items"
                    subtitle="Official Goods from Top Brands"
                    products={fashionProducts}
                    bgColor="bg-[#fafafa]"
                    accentColor="#FF9800"
                />

                {/* Health (Priority 7) */}
                <RecommendationSection />

                {/* Foods (Priority 8) */}
                <ProductSection
                    title="Foods"
                    subtitle="Authentic Korean Snacks & Food"
                    products={freshProducts}
                    bgColor="bg-[#f0faf0]"
                    accentColor="#4CAF50"
                />

                {/* News Gallery */}
                <NewsGallery />

                {/* Home (Priority 9) */}
                <div className="py-2 bg-section-bg" />
                <ProductSection
                    title="Home"
                    subtitle="Korean Home Lifestyle"
                    products={homeProducts}
                    bgColor="bg-[#fffaf0]"
                    accentColor="#795548"
                />

                {/* Electronics (Priority 13) */}
                <ProductSection
                    title="Electronics"
                    subtitle="Latest Digital Gadgets"
                    products={electronicsProducts}
                    accentColor="#3F51B5"
                />

                {/* Hot Deals */}
                <ProductSection
                    title="Hot Deals"
                    subtitle="Limited-time Offers"
                    products={goldBoxDeals}
                    bgColor="bg-gradient-to-b from-[#fff8e1] to-[#fff]"
                    accentColor="#F44336"
                />
            </main>

            <Footer />
        </div>
    )
}
