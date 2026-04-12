"use client"

import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, LogIn } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import axios from "axios"

// static NAV_CATEGORIES removed in favor of dynamic fetching

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const catMenuRef = useRef(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate()
  const { totalItems } = useCart()

  const [navRowCategories, setNavRowCategories] = useState([])
  const [navDropdownCategories, setNavDropdownCategories] = useState([])

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search logic for autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ products: [], categories: [] });
        setShowSuggestions(false);
        return;
      }
      setIsSearching(true);
      setShowSuggestions(true);
      try {
        const prodRes = await axios.get(`${backendUrl}/products/search/query?q=${encodeURIComponent(searchQuery.trim())}`);
        const catRes = await axios.get(`${backendUrl}/categories`);
        let products = [];
        let categories = [];
        if (prodRes.data.success) {
          products = prodRes.data.products?.slice(0, 5) || [];
        }
        if (catRes.data.success) {
          const allCategories = catRes.data.categories || [];
          const qLower = searchQuery.toLowerCase();
          categories = allCategories.filter(c => c.name.toLowerCase().includes(qLower)).slice(0, 3);
        }
        setSearchResults({ products, categories });
      } catch (err) {
        console.error("Autosuggest fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, backendUrl]);

  // Click outside to close search dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) &&
        (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target))
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check login state on mount + whenever storage changes
  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("token"))
    check()
    window.addEventListener("storage", check)
    return () => window.removeEventListener("storage", check)
  }, [])

  // Fetch dynamic navbar categories
  useEffect(() => {
    const fetchNavbarCats = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/categories`);
        if (data.categories) {
          const allSuperCats = data.categories.filter(c => c.parentId === null);
          const flaggedSuperCats = allSuperCats.filter(c => c.showInNavbar);
          // Top row: first 10 that are flagged
          const row = flaggedSuperCats.slice(0, 10);
          setNavRowCategories(row);
          // Dropdown: show super categories NOT in the top row
          const rowIds = new Set(row.map(c => c.id));
          const dropdown = allSuperCats.filter(c => !rowIds.has(c.id)).slice(0, 15);
          setNavDropdownCategories(dropdown);
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error);
      }
    };
    fetchNavbarCats();
  }, [backendUrl])

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

  // Hardcoded NAV_CATEGORIES removed in favor of dynamic navDropdownCategories

  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const renderSearchSuggestions = () => {
    if (!showSuggestions || (!searchResults.products.length && !searchResults.categories.length && !isSearching)) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl z-[1000] overflow-hidden">
        {isSearching ? (
          <div className="p-4 text-center text-sm text-gray-500 animate-pulse">Searching...</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {searchResults.categories.length > 0 && (
              <div className="p-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-1 tracking-wider">Categories</div>
                {searchResults.categories.map(cat => (
                  <Link 
                    key={`s-cat-${cat.id}`}
                    to={cat.parentId === null ? `/super-category/${cat.slug}` : `/category/${cat.slug}`}
                    onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                    className="block px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-[#111] font-medium transition-colors"
                  >
                    <span className="text-gray-400 mr-2">🔍</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
            
            {searchResults.products.length > 0 && (
              <div className="p-2 border-t border-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-1 mt-1 tracking-wider">Related Products</div>
                {searchResults.products.map(product => (
                  <Link 
                    key={`s-prod-${product.id}`}
                    to={`/product/${product.id}`}
                    onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 shrink-0 bg-white border border-gray-100 rounded overflow-hidden flex items-center justify-center p-1">
                      <img src={product.images?.[0] || '/placeholder.png'} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#111] truncate">{product.name}</div>
                      <div className="text-[12px] font-bold text-rose-500">LKR {product.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            <button 
              onClick={handleSearchSubmit}
              type="button"
              className="w-full p-3.5 bg-gray-50 text-sm font-bold text-center text-primary hover:bg-gray-100 transition-colors"
            >
              View all results for "{searchQuery}"
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="relative z-50 bg-white shadow-sm md:pb-0">
        
        {/* =========================================
            DESKTOP HEADER
        ========================================= */}
        <div className="hidden md:flex mx-auto max-w-[1040px] items-center gap-4 px-4 pt-3 pb-4">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-end gap-2">
            {/* Crop out baked-in text — show icon only */}
            <div className="w-11 h-11 shrink-0 flex items-end">
              <img
                src="/logo-crop.png"
                alt="Logo"
                className="w-full h-full object-contain block"
              />
            </div>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.65rem',
                color: '#c8102e',
                letterSpacing: '-0.06em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                transform: 'translateY(2px) scaleY(1.15)',
                transformOrigin: 'bottom',
                display: 'inline-block'
              }}
            >
              Samee And Sandu
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex flex-1 items-center">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-[600px] items-center" ref={searchContainerRef}>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products 🔥"
                className="h-10 w-full rounded-l-md border border-[#e5e5e5] bg-white px-4 text-sm text-[#333] placeholder:text-[#999] focus:border-primary focus:outline-none"
              />
              <button type="submit" className="flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-white hover:bg-red-800 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              {renderSearchSuggestions()}
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
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
                      <button onClick={() => { navigate("/profile"); setShowUserMenu(false) }} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4" /> View Profile
                      </button>
                      <div className="border-t border-gray-100" />
                      <button onClick={() => { handleLogout(); setShowUserMenu(false) }} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <button onClick={() => { navigate("/login"); setShowUserMenu(false) }} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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

        {/* Desktop Category Nav */}
        <div className="border-b border-[#eee] bg-white relative z-50 hidden md:block">
          <div className="mx-auto max-w-[1040px] px-4 flex">
            <div className="w-[180px] shrink-0 border-r border-l border-[#eee] relative group" ref={catMenuRef}>
              <button className="w-full py-4.5 px-4 text-[17px] font-bold text-[#111] flex items-center gap-2 group-hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
                Category
              </button>
              <div className="absolute top-full left-[-1px] w-[200px] bg-white border border-[#eee] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <ul className="py-2">
                  {navDropdownCategories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/super-category/${cat.slug}`} className="block px-6 py-2.5 text-[14px] text-[#333] font-medium hover:bg-[#f8f9fa] hover:text-primary transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1 flex gap-8 items-center px-8 text-[17px] font-bold text-[#111]">
              {navRowCategories.map((cat) => (
                <Link key={cat.id} to={`/super-category/${cat.slug}`} className="hover:text-primary transition uppercase whitespace-nowrap">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            MOBILE HEADER (Top Bar)
        ========================================= */}
        <div className="md:hidden flex flex-col px-4 pt-2 pb-2 gap-2 bg-white border-b border-gray-100 shrink-0">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-end gap-1">
              {/* Crop out baked-in text — show icon only */}
              <div className="w-12 h-12 shrink-0 flex items-end">
                <img
                  src="/logo-crop.png"
                  alt="Logo"
                  className="w-full h-full object-contain block"
                />
              </div>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  color: '#c8102e',
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  transform: 'translateY(2px) scaleY(1.15)',
                  transformOrigin: 'bottom',
                  display: 'inline-block'
                }}
              >
                Samee And Sandu
              </span>
            </Link>
            <button onClick={handleCartClick} className="relative text-black">
              <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#ff1268] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative flex w-full items-center" ref={mobileSearchContainerRef}>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find today's trending picks! 🔥"
              className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 pr-12 text-sm text-[#333] placeholder:text-gray-400 focus:border-primary focus:outline-none shadow-inner"
            />
            <button type="submit" className="absolute right-3 text-[#ff1268]">
              <Search className="h-5 w-5" />
            </button>
            {renderSearchSuggestions()}
          </form>

          {/* Swippable Categories (Full list for mobile) */}
          {(navRowCategories.length > 0 || navDropdownCategories.length > 0) && (
            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-0 pt-0">
              {/* Combine and de-duplicate by ID */}
              {Array.from(new Map([...navRowCategories, ...navDropdownCategories].map(c => [c.id, c])).values()).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/super-category/${cat.slug}`}
                  className="whitespace-nowrap px-4 py-2 bg-gray-50 rounded-full text-[14px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* =========================================
          MOBILE BOTTOM NAVBAR
      ========================================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-[9999] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center px-6 h-[72px] relative">
          
          <button onClick={() => setShowMobileCategories(true)} className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors">
            <Menu className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">Menu</span>
          </button>
          
          <button onClick={() => window.scrollTo({top:0, behavior: 'smooth'})} className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors">
            <Search className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">Search</span>
          </button>

          {/* Spacer for center logo */}
          <div className="w-16"></div>
          
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 transition-transform hover:scale-105">
            <Link to="/" className="flex items-center justify-center w-[76px] h-[76px] bg-white rounded-full shadow-[0_-5px_15px_rgba(0,0,0,0.08)] p-2">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 flex items-center justify-center overflow-hidden">
                <div className="w-[90%] h-[90%] bg-white rounded-full flex items-center justify-center p-2">
                   <img src="/logo-crop.png" alt="Home" className="w-[85%] h-[85%] object-contain" />
                </div>
              </div>
            </Link>
          </div>

          <button onClick={handleCartClick} className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors relative">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Cart</span>
          </button>

          <button onClick={() => navigate(isLoggedIn ? "/profile" : "/login")} className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors">
            <User className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">{isLoggedIn ? "Account" : "Login"}</span>
          </button>
        </div>
      </div>

      {/* =========================================
          MOBILE CATEGORY DRAWER
      ========================================= */}
      {showMobileCategories && (
        <div className="md:hidden fixed inset-0 z-[10000] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMobileCategories(false)}
          />
          
          {/* Drawer slide-in */}
          <div className="relative w-[300px] h-full bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
            <div className="h-20 bg-primary flex items-center px-6 text-white font-bold text-lg">
              Categories
              <button 
                onClick={() => setShowMobileCategories(false)}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-safe p-4">
              <ul className="space-y-2">
                {navDropdownCategories.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      to={`/super-category/${cat.slug}`} 
                      onClick={() => setShowMobileCategories(false)}
                      className="block px-4 py-3 rounded-lg text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border border-transparent hover:border-gray-100 uppercase"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Global CSS for Drawer Animation & Bottom Padding */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        body { padding-bottom: 72px; }
        @media (min-width: 768px) { body { padding-bottom: 0; } }
      `}} />
    </>
  )
}
