import React from "react";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";

export default function RefundPolicyPage() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1040px] mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-14">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
              <span className="text-primary mr-2">|</span> REFUND & RETURN <span className="text-primary">POLICY</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              At Samee and Sandu, we are committed to providing premium quality products. This policy explains how returns, exchanges, and refunds work for orders placed on our website.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Eligibility for Refunds & Returns</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Refunds or replacements are strictly applicable only under specific circumstances, such as receiving physically damaged items, incorrect product deliveries, or missing items within an order.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Reporting Timeframe</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Customers must report any damaged, defective, or incorrect items via email or phone within 7 days of receiving the delivery, accompanied by unboxing photos or clear video evidence.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Strict Return Conditions</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Returned products must be unused, unopened, in their original packaging, with all security seals, brand tags, and protective covers completely intact.</li>
                <li>Opened or used cosmetics will not be accepted due to health and safety regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Refund Processing Mechanism</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Once the returned item is received, inspected, and approved by our quality control team, the refund will be processed back to the original payment method or bank account within 7 to 14 business days.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Non-Refundable / Non-Returnable Items</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Shipping fees, delivery charges, promotional items, gift cards, and items damaged due to customer misuse or negligence are strictly non-refundable and non-returnable.</li>
              </ul>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
