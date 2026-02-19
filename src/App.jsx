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

export default function App() {
  return (
    <div className="min-h-screen bg-section-bg font-sans">
      <TopBanner />
      <Header />

      <main>
        <HeroBanner />
        <CategoryIcons />
        <PromoBannerStrip />

        {/* Today's Recommendations */}
        <ProductSection
          title="Today's Recommendations"
          subtitle="We picked these just for you"
          products={todayRecommended}
        />

        {/* Lightning Deals */}
        <QuickDealBanner />

        {/* Rocket Delivery Products */}
        <div className="py-2 bg-section-bg" />
        <ProductSection
          title="Rocket Delivery"
          subtitle="Order by midnight, get it by dawn"
          products={rocketDeliveryProducts}
          accentColor="#346aff"
        />

        {/* Mid Promo Banners */}
        <MidPromoBanner />

        {/* Fashion */}
        <ProductSection
          title="Fashion Picks"
          subtitle="Trending styles this season"
          products={fashionProducts}
          bgColor="bg-[#fafafa]"
        />

        {/* Personalized Recommendations */}
        <RecommendationSection />

        {/* News Gallery */}
        <NewsGallery />

        {/* Beauty & Personal Care */}
        <ProductSection
          title="Beauty & Personal Care"
          subtitle="Top-rated skincare and beauty essentials"
          products={beautyProducts}
          accentColor="#9C27B0"
        />

        {/* Fresh Products */}
        <div className="py-2 bg-section-bg" />
        <ProductSection
          title="Rocket Fresh"
          subtitle="Farm-fresh groceries delivered by dawn"
          products={freshProducts}
          bgColor="bg-[#f0faf0]"
          accentColor="#00b050"
        />

        {/* Electronics */}
        <ProductSection
          title="Electronics & Gadgets"
          subtitle="Latest tech at the best prices"
          products={electronicsProducts}
        />

        {/* Home & Living */}
        <div className="py-2 bg-section-bg" />
        <ProductSection
          title="Home & Living"
          subtitle="Make your space cozy and beautiful"
          products={homeProducts}
          bgColor="bg-[#fffaf0]"
          accentColor="#f6a623"
        />

        {/* Gold Box */}
        <ProductSection
          title="Gold Box Deals"
          subtitle="Limited-time mega discounts you don't want to miss"
          products={goldBoxDeals}
          bgColor="bg-gradient-to-b from-[#fff8e1] to-[#fff]"
          accentColor="#e65100"
        />
      </main>

      <Footer />
    </div>
  )
}
