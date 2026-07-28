import React from "react";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1040px] mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-14">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
              <span className="text-primary mr-2">|</span> PRIVACY <span className="text-primary">POLICY</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              Your privacy is critically important to us. This document outlines how we collect, use, and protect your personal data when you use our services.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>We collect personal data provided directly by customers during registration, checkout, or communication, including name, email address, contact number, shipping address, and order history.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Use of Personal Information</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>The collected information is strictly utilized to process orders, manage deliveries, improve user experience, communicate order status updates, and provide customer support services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Security & Protection</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>We implement robust administrative, technical, and physical security measures to safeguard your personal data against unauthorized access, alteration, disclosure, or destruction.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Third-Party Disclosure</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except for trusted third-party partners (such as courier services and payment gateways like OnePay) necessary for fulfilling our business operations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Payment Gateway Security</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>All online payment transactions are securely processed through encrypted channels provided by authorized payment aggregators (OnePay). We do not store sensitive credit/debit card information on our servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cookies Policy</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Our website uses cookies to enhance browsing efficiency, analyze site traffic, remember user preferences, and facilitate a seamless shopping cart experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Customer Rights</h2>
              <ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">
                <li>Customers retain the absolute right to access, correct, update, or request the complete deletion of their personal information stored in our database by contacting our support team.</li>
              </ul>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
