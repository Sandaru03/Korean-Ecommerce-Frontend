import { useState, useMemo, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import {
    Search, Star, Rocket, SlidersHorizontal,
    Grid3x3, LayoutGrid, ChevronRight, Heart, ShoppingCart
} from "lucide-react"
import {
    kBeautyProducts,
    skinCareProducts,
    drySkinProducts,
    oilySkinProducts,
    kpopProducts,
    makeupProducts,
    hairCareProducts,
    healthProducts,
    foodProducts,
    homeProducts,
    babyProducts,
    sportsProducts,
} from "@/lib/product-data"

// ── Category registry ────────────────────────────────────────
const CATEGORIES = {
    "k-beauty": {
        name: "K-Beauty",
        description: "Best sellers from COSRX, Anua, Medicube & more",
        color: "from-pink-500 to-rose-400",
        products: kBeautyProducts,
        brands: ["COSRX", "Anua", "Medicube", "Beauty of Joseon", "Skin1004", "Some By Mi"],
    },
    "skin-care": {
        name: "Skin Care",
        description: "Daily essentials — cleanse, tone, moisturise",
        color: "from-green-500 to-teal-400",
        products: skinCareProducts,
        brands: ["The Ordinary", "Cetaphil", "Anua", "Medicube", "Skin1004"],
    },
    "dry-skin": {
        name: "Dry Skin",
        description: "Rich moisturisers, ceramides & hyaluronic acid",
        color: "from-blue-500 to-cyan-400",
        products: drySkinProducts,
        brands: ["COSRX", "Cetaphil", "Beauty of Joseon", "Some By Mi", "Anua"],
    },
    "oily-skin": {
        name: "Oily Skin",
        description: "Control shine, minimise pores & stay matte",
        color: "from-teal-500 to-emerald-400",
        products: oilySkinProducts,
        brands: ["COSRX", "Medicube", "Some By Mi", "The Ordinary", "Anua", "Beauty of Joseon"],
    },
    "k-pop": {
        name: "K-Pop",
        description: "Official albums, lightsticks & fan merch",
        color: "from-purple-600 to-indigo-500",
        products: kpopProducts,
        brands: ["BTS", "BLACKPINK", "SEVENTEEN", "STRAY KIDS", "NewJeans", "aespa"],
    },
    "makeup": {
        name: "Makeup",
        description: "ROMAND, Laneige, 3CE, CLIO & more",
        color: "from-pink-600 to-rose-500",
        products: makeupProducts,
        brands: ["ROMAND", "Etude House", "3CE", "Laneige", "CLIO", "Peripera"],
    },
    "hair-care": {
        name: "Hair Care",
        description: "Repair, grow and nourish your hair",
        color: "from-amber-500 to-orange-400",
        products: hairCareProducts,
        brands: ["Aromatica", "MASIL", "Amos", "Ryo", "innisfree", "Mise En Scene"],
    },
    "health": {
        name: "Health & Supplements",
        description: "Red ginseng, collagen, vitamins & probiotics",
        color: "from-emerald-600 to-green-500",
        products: healthProducts,
        brands: ["Korean Red Ginseng", "Collagen Plus", "VitaC", "KorProb", "OmegaKor"],
    },
    "foods": {
        name: "Korean Foods",
        description: "Authentic snacks, ramen & Korean staples",
        color: "from-orange-500 to-red-400",
        products: foodProducts,
        brands: ["Ottogi", "Nongshim", "Binggrae", "CJ", "Lotte", "Orion"],
    },
    "home": {
        name: "Home & Kitchen",
        description: "Korean-style cookware, ceramics & essentials",
        color: "from-amber-600 to-yellow-500",
        products: homeProducts,
        brands: ["Cuchen", "PN Poong Nyun", "Hanil", "Korean Ceramic", "Teflon Free"],
    },
    "baby-kids": {
        name: "Baby & Kids",
        description: "Safe, organic & gentle for your little ones",
        color: "from-sky-500 to-blue-400",
        products: babyProducts,
        brands: ["Burt's Bees Baby", "Organic Korea", "Comotomo", "Hegen", "Baby Dove"],
    },
    "sports": {
        name: "Sports & Fitness",
        description: "Gear up, train hard & recover faster",
        color: "from-indigo-600 to-blue-500",
        products: sportsProducts,
        brands: ["Fit Korea", "ActivePro", "KF94", "NexBand", "FlexGear"],
    },
}

const PAGE_SIZES = [9, 12, 18, 24]
const SORT_OPTIONS = [
    { label: "Best Match", value: "default" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "rating" },
    { label: "Most Reviewed", value: "reviews" },
]

// ── Individual product card ───────────────────────────────────
function ListingCard({ product }) {
    const [wished, setWished] = useState(false)
    return (
        <div className="group relative bg-white rounded-xl border border-[#eee] hover:shadow-lg hover:border-[#ccc] transition-all duration-200 overflow-hidden cursor-pointer">
            <button
                onClick={() => setWished(w => !w)}
                className="absolute top-2 right-2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
            >
                <Heart className={`h-4 w-4 ${wished ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>

            {product.badge && (
                <span className="absolute top-2 left-2 z-10 rounded text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white">
                    {product.badge}
                </span>
            )}

            <div className="aspect-square overflow-hidden bg-[#f8f8f8]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            <div className="p-3">
                <p className="text-[13px] text-[#333] leading-snug line-clamp-2 min-h-[38px] group-hover:text-blue-600 transition-colors">
                    {product.name}
                </p>

                <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                        ))}
                    </div>
                    <span className="text-[11px] text-gray-400">({product.reviews?.toLocaleString()})</span>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                    {product.discount && (
                        <span className="text-sm font-bold text-red-500">{product.discount}</span>
                    )}
                    <span className="text-base font-black text-[#111]">{product.price}</span>
                </div>
                {product.originalPrice && (
                    <p className="text-[11px] text-gray-400 line-through">{product.originalPrice}</p>
                )}

                <div className="flex gap-1 mt-2 flex-wrap">
                    {product.rocketDelivery && (
                        <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            <Rocket className="h-2.5 w-2.5" /> Fast
                        </span>
                    )}
                    {product.freeShipping && (
                        <span className="bg-green-50 text-green-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">Free Ship</span>
                    )}
                </div>

                <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

// ── Main page component ───────────────────────────────────────
export default function CategoryPage() {
    // ALL hooks must be declared before any conditional return
    const { slug } = useParams()

    const [brandSearch, setBrandSearch] = useState("")
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [sortBy, setSortBy] = useState("default")
    const [pageSize, setPageSize] = useState(12)
    const [page, setPage] = useState(1)
    const [cols, setCols] = useState(4)

    // Reset all filters whenever the category slug changes
    useEffect(() => {
        setSelectedBrand(null)
        setBrandSearch("")
        setSortBy("default")
        setPage(1)
    }, [slug])

    const category = CATEGORIES[slug] || null

    const filteredProducts = useMemo(() => {
        if (!category) return []
        let list = [...category.products]
        if (selectedBrand) {
            // Match by brand keyword in product name
            list = list.filter(p =>
                p.name.toLowerCase().includes(selectedBrand.toLowerCase())
            )
        }
        if (sortBy === "price_asc") list.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")))
        else if (sortBy === "price_desc") list.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")))
        else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating)
        else if (sortBy === "reviews") list.sort((a, b) => b.reviews - a.reviews)
        return list
    }, [category, selectedBrand, sortBy])

    const totalPages = Math.ceil(filteredProducts.length / pageSize)
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

    const filteredBrands = category
        ? (category.brands || []).filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
        : []

    const gridCols = {
        3: "grid-cols-2 sm:grid-cols-3",
        4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    }[cols] || "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"

    // ── Not found state ──
    if (!category) {
        return (
            <div className="min-h-screen bg-[#f5f5f5]">
                <Header />
                <div className="flex flex-col items-center justify-center py-40">
                    <p className="text-2xl font-bold text-gray-400">Category not found</p>
                    <Link to="/" className="mt-4 text-blue-600 underline">← Go Home</Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans">
            <Header />

            {/* Category Hero Banner */}
            <div className={`bg-gradient-to-r ${category.color} text-white`}>
                <div className="mx-auto max-w-[1280px] px-6 py-8">
                    <div className="flex items-center gap-1 text-white/70 text-xs mb-2">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white font-semibold">{category.name}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black">{category.name}</h1>
                    <p className="text-white/80 mt-1 text-sm">{category.description}</p>
                    <p className="mt-2 text-white/60 text-xs">{filteredProducts.length} products</p>
                </div>
            </div>

            {/* Main layout */}
            <div className="mx-auto max-w-[1280px] px-4 py-6 flex gap-5">

                {/* ── SIDEBAR ── */}
                <aside className="hidden lg:block w-56 shrink-0 space-y-4">

                    {/* Sidebar search */}
                    <div className="bg-white rounded-xl p-3 border border-[#eee]">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for products"
                                className="w-full pl-7 pr-3 py-2 text-xs border border-[#eee] rounded-lg focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>

                    {/* Brand filter */}
                    <div className="bg-white rounded-xl p-4 border border-[#eee]">
                        <h3 className="text-sm font-bold text-[#222] mb-3">Brand</h3>
                        <div className="relative mb-2">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Find a Brand"
                                value={brandSearch}
                                onChange={e => setBrandSearch(e.target.value)}
                                className="w-full pl-6 pr-2 py-1.5 text-[11px] border border-[#eee] rounded-md focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <ul className="space-y-1 max-h-48 overflow-y-auto">
                            <li>
                                <button
                                    onClick={() => { setSelectedBrand(null); setPage(1) }}
                                    className={`w-full text-left text-[12px] px-2 py-1 rounded transition-colors flex items-center justify-between ${!selectedBrand ? "bg-blue-50 text-blue-700 font-semibold" : "text-[#555] hover:bg-gray-50"}`}
                                >
                                    <span>All Brands</span>
                                    <span className="text-[11px] text-gray-400">{category.products.length}</span>
                                </button>
                            </li>
                            {filteredBrands.map(brand => (
                                <li key={brand}>
                                    <button
                                        onClick={() => { setSelectedBrand(brand); setPage(1) }}
                                        className={`w-full text-left text-[12px] px-2 py-1 rounded transition-colors ${selectedBrand === brand ? "bg-blue-50 text-blue-700 font-semibold" : "text-[#555] hover:bg-gray-50"}`}
                                    >
                                        {brand}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* All categories nav */}
                    <div className="bg-white rounded-xl p-4 border border-[#eee]">
                        <h3 className="text-sm font-bold text-[#222] mb-3">All Categories</h3>
                        <ul className="space-y-0.5">
                            {Object.entries(CATEGORIES).map(([s, c]) => (
                                <li key={s}>
                                    <Link
                                        to={`/category/${s}`}
                                        className={`block text-[12px] px-2 py-1.5 rounded transition-colors ${s === slug
                                                ? "bg-blue-600 text-white font-semibold"
                                                : "text-[#444] hover:bg-gray-50 hover:text-blue-600"
                                            }`}
                                    >
                                        {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 min-w-0">

                    {/* Toolbar */}
                    <div className="bg-white rounded-xl border border-[#eee] px-4 py-3 mb-4 flex flex-wrap items-center gap-3 justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={e => { setSortBy(e.target.value); setPage(1) }}
                                className="text-[13px] border border-[#eee] rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>

                            {/* Active brand filter tag */}
                            {selectedBrand && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                                    {selectedBrand}
                                    <button onClick={() => setSelectedBrand(null)} className="hover:text-red-500">✕</button>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <span className="text-xs text-gray-400">Show:</span>
                            <div className="flex gap-1">
                                {PAGE_SIZES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setPageSize(s); setPage(1) }}
                                        className={`text-[12px] px-2 py-1 rounded transition-colors ${pageSize === s ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1 border-l pl-3">
                                {[3, 4, 5].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCols(c)}
                                        className={`p-1.5 rounded transition-colors ${cols === c ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
                                    >
                                        {c === 3 ? <Grid3x3 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {paginatedProducts.length > 0 ? (
                        <div className={`grid ${gridCols} gap-3`}>
                            {paginatedProducts.map(p => (
                                <ListingCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-[#eee] py-20 text-center text-gray-400">
                            <p className="text-lg font-semibold">No products found</p>
                            {selectedBrand && (
                                <button
                                    onClick={() => setSelectedBrand(null)}
                                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm"
                                >
                                    Clear Brand Filter
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-[#ddd] text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                                .reduce((acc, n, idx, arr) => {
                                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…")
                                    acc.push(n)
                                    return acc
                                }, [])
                                .map((n, i) =>
                                    n === "…" ? (
                                        <span key={`e-${i}`} className="px-2 py-1.5 text-sm text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-blue-600 text-white" : "border border-[#ddd] text-gray-600 hover:bg-gray-50"}`}
                                        >
                                            {n}
                                        </button>
                                    )
                                )
                            }
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-[#ddd] text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
