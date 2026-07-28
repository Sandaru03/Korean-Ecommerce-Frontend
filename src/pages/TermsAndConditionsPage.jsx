import React from "react";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1040px] mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-14">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
              <span className="text-primary mr-2">|</span> TERMS & <span className="text-primary">CONDITIONS</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Please read these terms and conditions carefully before using our website and services.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>By accessing, browsing, or purchasing from sameeandsandu.com, you explicitly agree to comply with and be legally bound by these Terms and Conditions and our Privacy Policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Pricing and Product Descriptions</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>All prices listed on the website are quoted in Sri Lankan Rupees (LKR) and are subject to change without prior notice.</li>
                <li>We make every effort to display product descriptions and colors as accurately as possible; however, minor variations may occur.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Order Acceptance & Confirmation</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>An order placed by a customer constitutes an offer to purchase.</li>
                <li>Acceptance of the order occurs only upon successful payment verification and the issuance of an official order confirmation notification.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Shipping and Delivery Terms</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>We dispatch orders promptly through reliable courier partners. However, delivery timelines are estimates, and Samee and Sandu shall not be held liable for delivery delays caused by courier service failures, natural disasters, or unforeseen logistical bottlenecks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>All content included on this website—including text, graphics, logos, product images, software, and compilation data—is the exclusive property of Samee and Sandu and is fully protected under copyright laws. Unauthorized reproduction is strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Samee and Sandu shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the misuse of products purchased or temporary technical interruptions of the website.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>These terms and conditions are governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka, and any legal disputes shall be subject to the exclusive jurisdiction of the courts in Sri Lanka.</li>
              </ul>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
