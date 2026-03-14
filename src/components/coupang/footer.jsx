import { Rocket, Truck } from "lucide-react"

export function Footer() {
  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-white border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-[1280px] px-4 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                <img src="/logo.png" alt="Samee & Sadu" className="h-6 w-auto object-contain" />
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                Your one-stop shop for Korean Beauty and Health products. Delivering happiness to your doorstep.
              </p>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Customer Service</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Order Tracking</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">About</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Press</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Investor Relations</a></li>
              </ul>
            </div>

            {/* Sell on Coupang */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Sell with Us</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Start Selling</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Seller Support</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Advertising</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Rocket Growth</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="mb-3 text-sm font-bold text-[#333]">Policies</h3>
              <ul className="flex flex-col gap-2">
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Terms of Use</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-xs text-neutral-muted hover:text-primary transition-colors">Accessibility</a></li>
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
