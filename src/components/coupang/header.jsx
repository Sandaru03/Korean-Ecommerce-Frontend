"use client"

import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, LogIn } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "@/context/CartContext"

// static NAV_CATEGORIES removed in favor of dynamic fetching

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const catMenuRef = useRef(null)
  const [navCategories, setNavCategories] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate()
  const { totalItems } = useCart()

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${backendUrl}/categories?tree=true`)
        const data = await res.json()
        if (data.categories) {
          setNavCategories(data.categories)
        }
      } catch (err) {
          console.error("Error fetching header categories:", err)
      }
    }
    fetchCats()
  }, [backendUrl])

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
      <div className="mx-auto flex max-w-[1040px] items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <img src="/logo.png" alt="Samee & Sadu" className="h-8 w-auto object-contain" />
        </a>

        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative flex w-full max-w-[600px] items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="h-10 w-full rounded-l-md border border-[#e5e5e5] bg-white px-4 text-sm text-[#333] placeholder:text-[#999] focus:border-primary focus:outline-none"
            />
            <button className="flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-white hover:bg-red-800 transition-colors">
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
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-neutral-dark hover:text-primary transition-colors"
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
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-neutral-dark hover:text-primary transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff1268] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px]">Cart</span>
          </button>
        </div>
      </div>

      {/* ── Top Navigation Bar (Unified) ── */}
      <div className="border-b border-[#eee] bg-white relative z-50 hidden md:block">
        <div className="mx-auto max-w-[1040px] px-4 flex">
          {/* Categories Hover Trigger */}
          <div className="w-[180px] shrink-0 border-r border-l border-[#eee] relative group" ref={catMenuRef}>
            <button className="w-full py-3.5 px-4 text-[15px] font-bold text-[#111] flex items-center gap-2 group-hover:text-primary transition-colors">
              <Menu className="h-5 w-5" />
              Category
            </button>

            {/* Hover Dropdown Menu */}
            <div className="absolute top-full left-[-1px] w-[200px] bg-white border border-[#eee] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <ul className="py-2">
                {navCategories.map(cat => (
                  <li key={cat.id || cat.name}>
                    <Link to={`/category/${cat.slug}`} className="block px-6 py-2.5 text-[14px] text-[#333] font-medium hover:bg-[#f8f9fa] hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Header Links */}
          <div className="flex-1 flex gap-8 items-center px-8 text-[15px] font-bold text-[#111]">
            <Link to="/category/makeup" className="hover:text-primary transition">Special Deals</Link>
            <Link to="/category/skin-care" className="hover:text-primary transition">Ranking</Link>
            <Link to="/category/k-beauty" className="hover:text-primary transition">Only at OY</Link>
            <Link to="/category/hair-care" className="hover:text-primary transition">LUXE EDIT</Link>
            <Link to="/category/skin-care" className="hover:text-primary transition">Events</Link>
            <Link to="/category/health" className="hover:text-primary transition">Sale</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
