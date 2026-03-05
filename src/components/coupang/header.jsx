"use client"

import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, LogIn } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"

const NAV_CATEGORIES = [
  { name: "K-Beauty", slug: "k-beauty", emoji: "✨" },
  { name: "Skin Care", slug: "skin-care", emoji: "🌿" },
  { name: "Dry Skin", slug: "dry-skin", emoji: "💧" },
  { name: "Oily Skin", slug: "oily-skin", emoji: "🍃" },
  { name: "K-Pop", slug: "k-pop", emoji: "🎵" },
  { name: "Makeup", slug: "makeup", emoji: "💄" },
  { name: "Hair Care", slug: "hair-care", emoji: "💇" },
  { name: "Health", slug: "health", emoji: "💊" },
  { name: "Foods", slug: "foods", emoji: "🍜" },
  { name: "Home & Kitchen", slug: "home", emoji: "🏠" },
  { name: "Baby & Kids", slug: "baby-kids", emoji: "👶" },
  { name: "Sports", slug: "sports", emoji: "🏃" },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const catMenuRef = useRef(null)
  const navigate = useNavigate()

  // Check login state on mount + whenever storage changes
  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("token"))
    check()
    window.addEventListener("storage", check)
    return () => window.removeEventListener("storage", check)
  }, [])

  // Close USER dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close CATEGORIES dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setShowCategories(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleCartClick() {
    if (!isLoggedIn) navigate("/login")
    else navigate("/cart")
  }

  function handleLogout() {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <header className="relative z-50 bg-white shadow-sm">
      {/* ── Main Header Row ── */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <svg width="210" height="32" viewBox="0 0 210 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="26" fill="#346AFF" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">
              Samee &amp; Sadu
            </text>
          </svg>
        </a>

        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative flex w-full max-w-[600px] items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="h-10 w-full rounded-l-md border border-[#e5e5e5] bg-white px-4 text-sm text-[#333] placeholder:text-[#999] focus:border-coupang-blue focus:outline-none"
            />
            <button className="flex h-10 items-center justify-center rounded-r-md bg-coupang-blue px-4 text-white hover:bg-[#2a5ae0] transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-[#333] hover:text-coupang-blue transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="text-[10px]">{isLoggedIn ? "My Account" : "Login"}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-100 bg-white shadow-xl z-[9999] overflow-hidden">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { navigate("/profile"); setShowUserMenu(false) }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" /> View Profile
                    </button>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={() => { handleLogout(); setShowUserMenu(false) }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate("/login"); setShowUserMenu(false) }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="h-4 w-4" /> Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-[#333] hover:text-coupang-blue transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[10px]">Cart</span>
          </button>
        </div>
      </div>

    </header>
  )
}
