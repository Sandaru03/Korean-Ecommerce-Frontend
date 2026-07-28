import React from "react";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";
import { Phone, Mail, MapPin, Clock, Building2, Store } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 md:py-24 w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Greeting & Direct Contact */}
        <div className="w-full lg:w-1/2 space-y-12">
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Let's start a <br/>
              <span className="text-primary">conversation.</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Whether you have a question about our authentic K-Beauty products, shipping, or just want to say hello, our team is ready to answer all your questions.
            </p>
          </div>

          <div className="space-y-8 pt-4 border-t border-gray-100">
            
            {/* Phone */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Call Us Directly</p>
                <a href="tel:+94757802149" className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                  +94 75 780 2149
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Send an Email</p>
                <a href="mailto:sameeandsandu@gmail.com" className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                  sameeandsandu@gmail.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                <Clock className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Customer Support Hours</p>
                <p className="text-xl font-semibold text-gray-900">
                  Mon - Fri, 9:00 AM - 5:00 PM
                </p>
                <p className="text-sm text-gray-500 mt-1">Local Sri Lankan Time</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Business Info Card */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-8 relative z-10">Official Business Details</h3>
            
            <div className="space-y-8 relative z-10">
              
              <div className="flex gap-4">
                <Building2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Registered Name</p>
                  <p className="text-gray-600">Samee and Sandu</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Store className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Nature of Business</p>
                  <p className="text-gray-600 leading-relaxed">
                    Online retail and distribution of authentic cosmetics, skincare products, and K-Beauty items.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Principal Place of Business</p>
                  <p className="text-gray-600 leading-relaxed">
                    214/1, Kongodamulla,<br/>
                    Katana, Sri Lanka<br/>
                    (Postal Code: 11250)
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
