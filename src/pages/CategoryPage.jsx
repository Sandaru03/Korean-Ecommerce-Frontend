import { useState, useMemo, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import {
    Search, Star, Rocket, SlidersHorizontal,
    Grid3x3, LayoutGrid, ChevronRight, ChevronLeft, Heart, ShoppingCart
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

/* eslint-disable react/prop-types */
// ── Individual product card ───────────────────────────────────
function ListingCard({ product }) {
    const [wished, setWished] = useState(false)
    const brandName = product.name.split(" ")[0]; // Extract first word as brand for UI purposes

    return (
        <Link to={`/product/${product.id}`} className="group relative bg-white block">
            <div className="relative aspect-square overflow-hidden border border-[#eee] rounded-sm mb-3">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <button
                    onClick={(e) => { e.preventDefault(); setWished(w => !w); }}
                    className="absolute top-2 right-2 z-10 flex items-center justify-center p-1"
                >
                    <Heart className={`h-[22px] w-[22px] ${wished ? "fill-[#ff4040] text-[#ff4040]" : "text-[#ccc] hover:text-[#999]"}`} strokeWidth={1.5} />
                </button>
            </div>

            <div className="px-0.5">
                <p className="text-[12px] font-bold text-[#111] mb-1 leading-none truncate">{brandName}</p>
                <p className="text-[13px] text-[#555] leading-[1.3] line-clamp-2 min-h-[34px] group-hover:underline decoration-1 underline-offset-2">
                    {product.name}
                </p>

                <div className="mt-2.5 flex flex-col gap-0.5">
                    {product.originalPrice && (
                        <p className="text-[12px] text-[#999] line-through font-medium leading-none">{product.originalPrice}</p>
                    )}
                    <div className="flex items-baseline gap-1.5 leading-none mt-1">
                        {product.discount && (
                            <span className="text-[16px] font-bold text-[#ff4040]">{product.discount}</span>
                        )}
                        <span className="text-[16px] font-bold text-[#111]">{product.price.replace('$', '₩')}</span>
                    </div>
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                    {product.rocketDelivery && (
                        <span className="bg-[#f0f0f0] text-[#555] text-[10px] font-semibold px-1.5 py-[2px] rounded-[3px]">
                            Today's Dream
                        </span>
                    )}
                    {product.freeShipping && (
                        <span className="bg-[#fff0f0] text-[#ff4040] text-[10px] font-semibold px-1.5 py-[2px] rounded-[3px]">
                            Sale
                        </span>
                    )}
                    {product.badge && (
                        <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-semibold px-1.5 py-[2px] rounded-[3px]">
                            {product.badge}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function CategoryHeroBanner({ category }) {
    if (!category.products.length) return null
    return (
        <div className="w-full bg-[#f8f6f4] rounded-xl overflow-hidden flex h-[260px] mb-12 relative cursor-pointer group border border-[#eee]">
            <div className="flex-1 px-12 py-10 flex flex-col justify-center relative z-10">
                <span className="text-[12px] text-[#666] font-bold mb-3 tracking-widest uppercase">{category.name}</span>
                <h2 className="text-[28px] font-black text-[#111] leading-[1.2] mb-4">
                    Discover the Best<br />of {category.name}
                </h2>
                <p className="text-[14px] text-[#555] max-w-sm leading-relaxed">
                    {category.description}
                </p>
            </div>
            <div className="w-[45%] h-full relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-[0.15] mix-blend-multiply z-10`}></div>
                <img src={category.products[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f4] via-[#f8f6f4]/50 to-transparent z-10 w-1/3"></div>
            </div>
            <div className="absolute bottom-5 right-5 z-20 bg-black/40 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2.5 text-white text-[11px] font-bold tracking-widest transition-colors hover:bg-black/60">
                <span>1 / 3</span>
                <span className="w-[1px] h-3 bg-white/40"></span>
                <ChevronRight className="h-3.5 w-3.5" />
            </div>
        </div>
    )
}

function TopPills({ category, selectedBrand, onSelectBrand }) {
    const brands = category.brands.slice(0, 5);
    return (
        <div className="flex justify-center gap-8 mb-12">
            {brands.map((brand, i) => {
                const prod = category.products.find(p => p.name.includes(brand)) || category.products[i];
                const isActive = selectedBrand === brand;
                return (
                    <button
                        key={brand}
                        onClick={() => onSelectBrand(isActive ? null : brand)}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className={`w-[96px] h-[96px] rounded-full overflow-hidden border-[3px] transition-all duration-300 ${isActive ? 'border-[#9bd965]' : 'border-transparent group-hover:border-gray-200'}`}>
                            <div className="w-full h-full bg-[#f8f8f8]">
                                <img src={prod?.image} alt={brand} className="w-full h-full object-cover mix-blend-multiply flex shrink-0 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                        <span className={`text-[13px] ${isActive ? 'font-bold text-[#111]' : 'text-[#666] font-medium'}`}>{brand}</span>
                    </button>
                )
            })}
        </div>
    )
}

// ── Main page component ───────────────────────────────────────
export default function CategoryPage() {
    const { slug } = useParams()

    const [selectedBrand, setSelectedBrand] = useState(null)
    const [page, setPage] = useState(1)
    const pageSize = 16

    useEffect(() => {
        setSelectedBrand(null)
        setPage(1)
    }, [slug])

    const category = CATEGORIES[slug] || null

    const filteredProducts = useMemo(() => {
        if (!category) return []
        let list = [...category.products]
        if (selectedBrand) {
            list = list.filter(p =>
                p.name.toLowerCase().includes(selectedBrand.toLowerCase())
            )
        }
        return list
    }, [category, selectedBrand])

    const totalPages = Math.ceil(filteredProducts.length / pageSize)
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

    if (!category) {
        return (
            <div className="min-h-screen bg-white">
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
        <div className="min-h-screen bg-white font-sans selection:bg-[#9bd965] selection:text-black">
            <Header />

            {/* Main layout */}
            <div className="mx-auto max-w-[1200px] px-6 py-10 flex gap-12 items-start">

                {/* ── SIDEBAR ── */}
                <aside className="hidden lg:block w-[180px] shrink-0 sticky top-10 text-left">
                    <h2 className="text-[34px] font-black text-[#111] mb-8 lowercase tracking-tight">{category.name}</h2>
                    <ul className="flex flex-col">
                        <li>
                            <button
                                onClick={() => { setSelectedBrand(null); setPage(1) }}
                                className={`text-left w-full py-3.5 border-b border-[#f0f0f0] text-[15px] transition-colors ${!selectedBrand ? 'font-bold text-[#111]' : 'text-[#666] hover:text-[#111]'}`}
                            >
                                All Products
                            </button>
                        </li>
                        {category.brands.map(brand => (
                            <li key={brand}>
                                <button
                                    onClick={() => { setSelectedBrand(brand); setPage(1) }}
                                    className={`text-left w-full py-3.5 border-b border-[#f0f0f0] text-[15px] transition-colors ${selectedBrand === brand ? 'font-bold text-[#111]' : 'text-[#666] hover:text-[#111]'}`}
                                >
                                    {brand}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <div className="flex-1 min-w-0">

                    {/* Top Section */}
                    <h3 className="text-center text-[26px] font-bold text-[#111] mb-10 tracking-tight">
                        The most sought-after {category.name} BEST right now
                    </h3>

                    <TopPills category={category} selectedBrand={selectedBrand} onSelectBrand={(b) => { setSelectedBrand(b); setPage(1); }} />

                    <CategoryHeroBanner category={category} />

                    {/* Curated Section Title */}
                    <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-[#111]">
                        <h4 className="text-[20px] font-bold text-[#111]">Recommended Products</h4>
                        <span className="text-[13px] text-[#777] font-medium block pb-0.5">Total <strong className="text-[#111]">{filteredProducts.length}</strong></span>
                    </div>

                    {/* Grid */}
                    {paginatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 mb-16">
                            {paginatedProducts.map(p => (
                                <ListingCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="border border-[#eee] py-32 text-center text-gray-400 mb-16 rounded-lg bg-[#fcfcfc]">
                            <p className="text-lg font-semibold mb-2">No products found</p>
                            <p className="text-sm">Try selecting a different subcategory.</p>
                            {selectedBrand && (
                                <button
                                    onClick={() => setSelectedBrand(null)}
                                    className="mt-6 bg-[#111] hover:bg-[#333] transition-colors text-white px-6 py-2.5 rounded text-sm font-semibold"
                                >
                                    View All Products
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 border-t border-[#eee] pt-10 pb-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center border border-[#ddd] text-[#333] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
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
                                        <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-10 h-10 flex items-center justify-center text-[15px] font-medium transition-colors ${n === page ? "bg-[#111] text-white border border-[#111]" : "border border-transparent text-[#555] hover:bg-gray-50 hover:border-[#ddd]"}`}
                                        >
                                            {n}
                                        </button>
                                    )
                                )
                            }
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center border border-[#ddd] text-[#333] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
