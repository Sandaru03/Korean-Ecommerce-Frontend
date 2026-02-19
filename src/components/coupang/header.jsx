"use client"

import { Search, ShoppingCart, User, Menu, ChevronDown, MapPin } from "lucide-react"
import { useState } from "react"

const categories = [
  "K-Beauty",
  "Skin Care",
  "K Pop",
  "Brand Items",
  "Makeup items",
  "Hair care",
  "Health",
  "Foods",
  "Home",
  "Kitchen",
  "Baby & Kids",
  "Shoes",
  "Electronics",
  "Digital",
  "Sports",
  "Pet supplies",
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <svg width="174" height="32" viewBox="0 0 174 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="26" fill="#346AFF" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1">
              coupang
            </text>
          </svg>
        </a>

        {/* Category Dropdown */}
        <button
          className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#f5f5f5] transition-colors lg:flex"
          onClick={() => setShowCategories(!showCategories)}
        >
          <Menu className="h-5 w-5" />
          <span>Categories</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative flex w-full max-w-[600px] items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="h-10 w-full rounded-l-md border border-[#e5e5e5] bg-[#fff] px-4 text-sm text-[#333] placeholder:text-[#999] focus:border-coupang-blue focus:outline-none"
            />
            <button className="flex h-10 items-center justify-center rounded-r-md bg-coupang-blue px-4 text-[#fff] hover:bg-[#2a5ae0] transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#333] hover:text-coupang-blue transition-colors">
            <User className="h-5 w-5" />
            <span className="text-[10px]">My Coupang</span>
          </button>
          <button className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-[#333] hover:text-coupang-blue transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[10px]">Cart</span>
            <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-coupang-red text-[10px] font-bold text-[#fff]">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="border-t border-[#e5e5e5] bg-[#fff]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-0 overflow-x-auto px-4">
          <button
            className="flex flex-shrink-0 items-center gap-1 border-r border-[#e5e5e5] px-4 py-2.5 text-sm font-medium text-[#333] hover:text-coupang-blue transition-colors"
            onClick={() => setShowCategories(!showCategories)}
          >
            <Menu className="h-4 w-4" />
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <a
              key={cat}
              href="#"
              className="flex-shrink-0 px-3 py-2.5 text-[13px] text-[#555] hover:text-coupang-blue transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>
      </nav>

      {/* Delivery Address Bar */}
      <div className="border-t border-[#f0f0f0] bg-[#fafafa]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-1.5">
          <MapPin className="h-3.5 w-3.5 text-coupang-blue" />
          <span className="text-xs text-[#666]">
            {"Deliver to "}
            <span className="font-medium text-[#333]">Seoul, Gangnam-gu</span>
          </span>
        </div>
      </div>

      {/* Mobile Category Dropdown */}
      {showCategories && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-[#e5e5e5] bg-[#fff] shadow-lg lg:w-64">
          <div className="mx-auto max-w-[1280px] p-4">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="rounded-md px-3 py-2 text-sm text-[#333] hover:bg-[#f5f5f5] transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
