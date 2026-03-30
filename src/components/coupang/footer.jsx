import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Rocket, Truck } from "lucide-react";

export function Footer() {
  const [categories, setCategories] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/categories`);
        if (data.categories) {
          // Get only top-level categories and limit to 5 for footer display
          setCategories(data.categories.filter(c => c.parentId === null).slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching categories for footer:", error);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-white border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-[1040px] px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Company Info */}
            <div className="col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-1 mb-4">
                <img src="/logo.png" alt="Samee & Sadu" className="h-7 w-auto object-contain" />
              </Link>
              <p className="text-xs text-[#888] leading-relaxed max-w-[200px]">
                Your premium destination for authentic Korean Beauty and Health products. Delivering quality and happiness to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-[#333] uppercase tracking-tight">Quick Links</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link to="/" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/search" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Search Products</Link></li>
                <li><Link to="/cart" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Shopping Cart</Link></li>
                <li><Link to="/login" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Track Orders</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-[#333] uppercase tracking-tight">Top Categories</h3>
              <ul className="flex flex-col gap-2.5">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/category/${cat.slug}`} className="text-[13px] text-neutral-muted hover:text-primary transition-colors uppercase">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link to="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Skin Care</Link></li>
                    <li><Link to="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Cosmetics</Link></li>
                    <li><Link to="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Health</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-[#333] uppercase tracking-tight">My Account</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link to="/profile" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">View Profile</Link></li>
                <li><Link to="/login" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Login / Signup</Link></li>
                <li><Link to="/cart" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Order History</Link></li>
                <li><Link to="/admin-login" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-[#333] uppercase tracking-tight">Support</h3>
              <ul className="flex flex-col gap-2.5">
                <li><a href="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-[13px] text-neutral-muted hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f5f5f5] bg-gray-50/30">
          <div className="mx-auto flex max-w-[1040px] flex-col md:flex-row items-center justify-between px-4 py-6 gap-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-[12px] text-[#888] font-medium">
                Samee and Sandu Corp. | Your Korean Lifestyle Partner
              </p>
            </div>
            <p className="text-[11px] text-[#aaa]">
              &copy; {new Date().getFullYear()} Samee & Sadu. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
