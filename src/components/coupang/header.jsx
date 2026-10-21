"use client"

import { Search, ShoppingCart, User, Menu, ChevronDown, ChevronLeft, ChevronRight, LogOut, LogIn, CircleHelp } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import axios from "axios"

// static NAV_CATEGORIES removed in favor of dynamic fetching

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)
  const catMenuRef = useRef(null)
  const currencyMenuRef = useRef(null)
  const mobileCurrencyMenuRef = useRef(null)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate()
  const { totalItems, setIsCartOpen } = useCart()
  const { currency, setCurrency, exchangeRates, formatPrice } = useCurrency()

  const [navRowCategories, setNavRowCategories] = useState([])
  const [navDropdownCategories, setNavDropdownCategories] = useState([])
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const navScrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)
  const hasDragged = useRef(false)

  const checkNavScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current
      setCanScrollLeft(scrollLeft > 6)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6)
    }
  }

  const handleNavScroll = (direction) => {
    if (navScrollRef.current) {
      const amount = 320
      navScrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      })
    }
  }

  // Mouse drag-to-slide handlers (horizontal navbar)
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !navScrollRef.current) return
    const el = navScrollRef.current
    const startX = e.pageX
    const startScroll = el.scrollLeft
    setIsDragging(true)
    hasDragged.current = false

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.pageX - startX
      if (Math.abs(delta) > 5) {
        hasDragged.current = true
      }
      el.scrollLeft = startScroll - delta
      checkNavScroll()
    }

    const onMouseUp = () => {
      setIsDragging(false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  // Mouse drag-to-scroll handler (vertical category dropdown)
  const catScrollRef = useRef(null)
  const [isCatDragging, setIsCatDragging] = useState(false)
  const hasCatDragged = useRef(false)

  const handleCatMouseDown = (e) => {
    if (e.button !== 0 || !catScrollRef.current) return
    const el = catScrollRef.current
    const startY = e.pageY
    const startScrollTop = el.scrollTop
    setIsCatDragging(true)
    hasCatDragged.current = false

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.pageY - startY
      if (Math.abs(delta) > 5) {
        hasCatDragged.current = true
      }
      el.scrollTop = startScrollTop - delta
    }

    const onMouseUp = () => {
      setIsCatDragging(false)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  // Horizontal mouse wheel sliding
  useEffect(() => {
    const el = navScrollRef.current
    if (!el) return
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
        checkNavScroll()
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  useEffect(() => {
    checkNavScroll()
    const timer1 = setTimeout(checkNavScroll, 100)
    const timer2 = setTimeout(checkNavScroll, 400)
    window.addEventListener("resize", checkNavScroll)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener("resize", checkNavScroll)
    }
  }, [navRowCategories])

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
        const { data } = await axios.get(`${backendUrl}/categories?tree=true`);
        if (data.categories) {
          const allSuperCats = data.categories;
          const flaggedSuperCats = allSuperCats.filter(c => c.showInNavbar);
          // Top row: include ALL categories enabled in Admin panel
          setNavRowCategories(flaggedSuperCats);
          // Dropdown: show ALL super categories
          setNavDropdownCategories(allSuperCats);
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
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target) && 
          mobileCurrencyMenuRef.current && !mobileCurrencyMenuRef.current.contains(e.target)) {
        setShowCurrencyMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleCartClick() {
    if (!isLoggedIn) navigate("/login")
    else setIsCartOpen(true)
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
                      <div className="text-[12px] font-bold text-rose-500">{formatPrice(product.price)}</div>
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
      <header className="relative md:sticky md:top-0 z-[1000] bg-white shadow-sm md:pb-0">
        
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
            {/* Currency Selector */}
            <div className="relative" ref={currencyMenuRef}>
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 text-neutral-dark hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black uppercase tracking-tight">{currency}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showCurrencyMenu ? 'rotate-180' : ''}`} />
                </div>
                <span className="text-[10px]">Currency</span>
              </button>
              
              {showCurrencyMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-gray-100 bg-white shadow-xl z-[9999] overflow-hidden py-1">
                  {['LKR', 'USD', 'EUR', 'GBP', 'AUD', 'KRW', 'JPY'].filter(c => exchangeRates[c] || c === 'LKR').map(c => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors ${
                        currency === c ? "bg-red-50 text-primary font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {c}
                      {currency === c && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
            {/* Category Menu & Flyout */}
            <div 
              className="w-[180px] shrink-0 border-r border-l border-[#eee] relative group" 
              ref={catMenuRef}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button className="w-full py-4.5 px-4 text-[17px] font-bold text-[#111] flex items-center gap-2 group-hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
                Category
              </button>

              {/* Dropdown Container */}
              <div className="absolute top-full left-[-1px] flex bg-white border border-[#eee] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg">
                {/* Left Column: Vertically scrollable & draggable list of all super categories */}
                <div 
                  ref={catScrollRef}
                  onMouseDown={handleCatMouseDown}
                  className={`w-[230px] max-h-[min(580px,calc(100vh-170px))] overflow-y-auto py-2 divide-y-0 divide-[#f5f5f5] [scrollbar-width:thin] select-none ${
                    isCatDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {navDropdownCategories.map(cat => (
                    <div 
                      key={cat.id} 
                      onMouseEnter={() => setHoveredCategory(cat)}
                    >
                      <Link 
                        to={`/super-category/${cat.slug}`} 
                        onClick={(e) => {
                          if (hasCatDragged.current) {
                            e.preventDefault();
                          }
                        }}
                        className={`flex justify-between items-center px-5 py-2.5 text-[14px] font-medium transition-colors ${
                          hoveredCategory?.id === cat.id 
                            ? "bg-[#f8f9fa] text-primary font-semibold" 
                            : "text-[#333] hover:bg-[#f8f9fa] hover:text-primary"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        {cat.children && cat.children.length > 0 && (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        )}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Right Column: Flyout Subcategories */}
                {hoveredCategory && hoveredCategory.children && hoveredCategory.children.length > 0 && (
                  <div className="w-[540px] max-h-[min(580px,calc(100vh-170px))] overflow-y-auto border-l border-[#eee] p-6 bg-white [scrollbar-width:thin] animate-in fade-in duration-150">
                    <div className="flex gap-8 flex-wrap content-start">
                      {hoveredCategory.children.map(child => (
                        <div key={child.id} className="flex flex-col gap-2 w-[150px]">
                          <Link 
                            to={`/super-category/${hoveredCategory.slug}?selected=${child.slug}`} 
                            className="font-bold text-[14px] text-[#111] hover:text-primary border-b border-[#eee] pb-1 mb-1 block"
                          >
                            {child.name}
                          </Link>
                          {child.children && child.children.length > 0 && (
                            <ul className="flex flex-col gap-1.5">
                              {child.children.map(sub => (
                                <li key={sub.id}>
                                  <Link 
                                    to={`/super-category/${hoveredCategory.slug}?selected=${child.slug}`} 
                                    className="text-[13px] text-[#555] hover:text-primary transition-colors block py-0.5"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Navbar Categories Strip with smooth scrolling, drag-to-slide & chevrons */}
            <div className="relative flex-1 flex items-center min-w-0 pl-4 pr-1 overflow-hidden">
              {/* Left Arrow with gradient mask */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 pr-6 bg-gradient-to-r from-white via-white/95 to-transparent z-20 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => handleNavScroll("left")}
                    className="pointer-events-auto w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-800 hover:text-primary hover:scale-110 active:scale-95 transition-all"
                    aria-label="Scroll categories left"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              )}

              {/* Scrollable & Drag-Slideable Container */}
              <div 
                ref={navScrollRef}
                onScroll={checkNavScroll}
                onMouseDown={handleMouseDown}
                className={`flex-1 flex gap-7 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[17px] font-bold text-[#111] py-4.5 select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {navRowCategories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/super-category/${cat.slug}`}
                    onClick={(e) => {
                      if (hasDragged.current) {
                        e.preventDefault()
                      }
                    }}
                    className="hover:text-primary transition uppercase whitespace-nowrap shrink-0 hover:scale-105 active:scale-95 transform transition-transform"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Right Arrow with gradient mask */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1 pl-6 bg-gradient-to-l from-white via-white/95 to-transparent z-20 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => handleNavScroll("right")}
                    className="pointer-events-auto w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-800 hover:text-primary hover:scale-110 active:scale-95 transition-all"
                    aria-label="Scroll categories right"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              )}
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
                  transform: 'translateY(-1px) scaleY(1.15)',
                  transformOrigin: 'bottom',
                  display: 'inline-block'
                }}
              >
                Samee And Sandu
              </span>
            </Link>
            {/* Mobile Currency Selector - Replacing redundant cart button */}
            <div className="relative" ref={mobileCurrencyMenuRef}>
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[12px] font-black text-[#111] transition-all shadow-sm active:scale-95"
              >
                <span className="uppercase tracking-tight">{currency}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showCurrencyMenu ? 'rotate-180' : ''}`} />
              </button>
              {showCurrencyMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-gray-100 bg-white shadow-2xl z-[10000] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {['LKR', 'USD', 'EUR', 'GBP', 'AUD', 'KRW', 'JPY'].filter(c => exchangeRates[c] || c === 'LKR').map(c => (
                    <button
                      key={`m-curr-${c}`}
                      onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm ${
                        currency === c ? "bg-red-50 text-primary font-bold" : "text-gray-700 active:bg-gray-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
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
        </div>
      </header>

      {/* =========================================
          MOBILE BOTTOM NAVBAR
      ========================================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center px-6 h-[72px] relative">
          
          <button onClick={() => setShowMobileCategories(true)} className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors">
            <Menu className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">Menu</span>
          </button>
          
          <Link to="/about" className="flex flex-col items-center gap-1 text-black hover:text-primary transition-colors">
            <CircleHelp className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">About Us</span>
          </Link>

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
