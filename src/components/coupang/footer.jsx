import { Rocket, Truck } from "lucide-react"

export function Footer() {
  return (
    <footer>
      {/* Free Delivery Banner */}
      <div className="bg-coupang-blue py-4">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-4 px-4">
          <Truck className="h-8 w-8 text-white" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">Free Delivery on First Order!</p>
            <p className="text-sm text-white/80">Sign up now and get free shipping on your first purchase</p>
          </div>
          <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-coupang-blue hover:bg-[#f0f0f0] transition-colors">
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-white border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-[1280px] px-4 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                <Rocket className="h-5 w-5 text-coupang-blue" />
                <span className="text-xl font-bold text-coupang-blue">Samee & Sandu</span>
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                Your one-stop shop for Korean Beauty and Health products. Delivering happiness to your doorstep.
              </p>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Customer Service</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Help Center</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Order Tracking</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">About</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">About Us</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Careers</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Press</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Investor Relations</a></li>
              </ul>
            </div>

            {/* Sell on Coupang */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Sell with Us</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Start Selling</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Seller Support</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Advertising</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Rocket Growth</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Policies</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Terms of Use</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-xs text-[#666] hover:text-coupang-blue transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f0f0f0]">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4">
            <p className="text-[11px] text-[#aaa]">
              {"Samee and Sandu Corp. | Business Reg. No: 123-45-67890"}
            </p>
            <p className="text-[11px] text-[#aaa]">
              {"Copyright 2026 Samee and Sandu. All rights reserved."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
