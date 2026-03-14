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

// Removed static CATEGORIES registry - now fetched from backend

/* eslint-disable react/prop-types */
// ── Individual product card ───────────────────────────────────
function ListingCard({ product }) {
    const [wished, setWished] = useState(false)
    const brandName = product.name.split(" ")[0]; 

    // Robust image handling
    let imageUrl = "https://via.placeholder.com/300"
    let images = product.images || product.image
    if (typeof images === 'string' && (images.startsWith('[') || images.startsWith('{'))) {
        try {
            const parsed = JSON.parse(images)
            images = Array.isArray(parsed) ? parsed : [parsed]
        } catch (e) {
            // Not JSON, use as is
        }
    }
    
    if (Array.isArray(images) && images.length > 0) {
        imageUrl = images[0]
    } else if (typeof images === 'string') {
        imageUrl = images
    }

    return (
        <Link to={`/product/${product.id}`} className="group relative bg-white block">
            <div className="relative aspect-square overflow-hidden border border-[#eee] rounded-sm mb-3">
                <img
                    src={imageUrl}
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
                        <span className="text-[16px] font-bold text-[#111]">
                            LKR {Number(product.price).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">

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

function CategoryHeroBanner({ category, products }) {
    if (!products || !products.length) return null
    return (
        <div className="w-full bg-accent rounded-xl overflow-hidden flex h-[260px] mb-12 relative cursor-pointer group border border-[#eee]">
            <div className="flex-1 px-12 py-10 flex flex-col justify-center relative z-10">
                <span className="text-[12px] text-[#666] font-bold mb-3 tracking-widest uppercase">{category.name}</span>
                <h2 className="text-[28px] font-black text-[#111] leading-[1.2] mb-4">
                    Discover the Best<br />of {category.name}
                </h2>
                <p className="text-[14px] text-[#555] max-w-sm leading-relaxed">
                    Explore our curated collection of premium products.
                </p>
            </div>
            <div className="w-[45%] h-full relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-pink-100 to-rose-200 opacity-[0.35] mix-blend-multiply z-10`}></div>
                <img src={products[0]?.images?.[0] || products[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" />
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

function TopPills({ subcategories, currentPath, onNavigate }) {
    if (!subcategories || subcategories.length === 0) return null;
    return (
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
            {subcategories.map((sub, i) => {
                return (
                    <button
                        key={sub.name}
                        onClick={() => onNavigate(sub.name)}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className={`w-[96px] h-[96px] rounded-full overflow-hidden border-[3px] transition-all duration-300 border-transparent hover:ring-2 hover:ring-primary hover:ring-offset-2`}>
                            <div className="w-full h-full bg-[#f8f8f8]">
                                <img src={sub.image || "https://picsum.photos/seed/cat/200/200"} alt={sub.name} className="w-full h-full object-cover flex shrink-0 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                        <span className={`text-[13px] text-[#666] font-medium group-hover:text-primary group-hover:font-bold transition-all`}>{sub.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

// ── Main page component ───────────────────────────────────────
import axios from "axios"

export default function CategoryPage() {
    const { slug } = useParams()
    const [categoryData, setCategoryData] = useState(null)
    const [products, setProducts] = useState([])
    const [currentPath, setCurrentPath] = useState([]) // Array of subcategory names
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const pageSize = 16

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/slug/${slug}`)
                setCategoryData(res.data.category)
                setCurrentPath([]) // Reset path when switching main category
                setPage(1)
            } catch (error) {
                console.error("Error fetching category:", error)
                setCategoryData(null)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [slug])

    useEffect(() => {
        if (!categoryData) return

        const fetchProducts = async () => {
            try {
                setLoading(true)
                let url = `${import.meta.env.VITE_BACKEND_URL}/products?category=${categoryData.name}`
                if (currentPath.length > 0) {
                    url += `&subCategory=${currentPath[currentPath.length - 1]}`
                }
                const res = await axios.get(url)
                setProducts(res.data)
                setPage(1)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [categoryData, currentPath])

    // Helper to find the current node in the subcategory tree
    const getCurrentSubcategories = () => {
        if (!categoryData) return []
        
        let current = categoryData.children || []
        
        // Traverse the path through children
        for (const pathName of currentPath) {
            const found = current.find(s => s.name === pathName)
            if (found && found.children) {
                current = found.children
            } else {
                return []
            }
        }
        return current
    }

    const handleNavigateSub = (name) => {
        setCurrentPath([...currentPath, name])
    }

    const handleGoBack = (index) => {
        if (index === -1) {
            setCurrentPath([])
        } else {
            setCurrentPath(currentPath.slice(0, index + 1))
        }
    }

    const totalPages = Math.ceil(products.length / pageSize)
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize)

    if (loading && !categoryData) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff1268]"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!categoryData) {
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

    const subcategoriesToShow = getCurrentSubcategories()

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white">
            <Header />

            <div className="mx-auto max-w-[1200px] px-6 py-10">
                <div className="flex gap-12 items-start">
                    {/* SIDEBAR */}
                    <aside className="hidden lg:block w-[180px] shrink-0 sticky top-10 text-left">
                        <h2 className="text-[34px] font-black text-[#111] mb-8 lowercase tracking-tight">{categoryData.name}</h2>
                        
                        <div className="mb-6">
                            <button 
                                onClick={() => handleGoBack(-1)}
                                className={`text-left w-full py-2 text-[14px] transition-colors ${currentPath.length === 0 ? 'text-primary font-semibold' : 'text-[#666] hover:text-[#111]'}`}
                            >
                                All {categoryData.name}
                            </button>
                            {currentPath.map((name, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleGoBack(i)}
                                    className={`text-left w-full pl-3 py-2 text-[14px] border-l-2 ml-1 transition-colors ${i === currentPath.length - 1 ? 'border-primary text-primary font-semibold' : 'border-gray-100 text-[#666] hover:text-[#111]'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-[12px] text-[#999] mb-4 uppercase tracking-wider font-bold">
                            <Link to="/" className="hover:text-[#111]">Home</Link>
                            <ChevronRight className="h-3 w-3" />
                            <button onClick={() => handleGoBack(-1)} className="hover:text-[#111] uppercase">{categoryData.name}</button>
                            {currentPath.map((name, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3" />
                                    <button onClick={() => handleGoBack(i)} className={`uppercase ${i === currentPath.length - 1 ? 'text-primary font-semibold' : 'hover:text-[#111]'}`}>
                                        {name}
                                    </button>
                                </span>
                            ))}
                        </div>

                        <h3 className="text-center text-[26px] font-bold text-[#111] mb-10 tracking-tight">
                            {currentPath.length > 0 ? currentPath[currentPath.length - 1] : categoryData.name} Best Sellers
                        </h3>

                        <TopPills 
                            subcategories={subcategoriesToShow} 
                            currentPath={currentPath} 
                            onNavigate={handleNavigateSub} 
                        />

                        <CategoryHeroBanner category={categoryData} products={products} />

                        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-[#111]">
                            <h4 className="text-[20px] font-bold text-[#111]">Products</h4>
                            <span className="text-[13px] text-[#777] font-medium block pb-0.5">Total <strong className="text-[#111]">{products.length}</strong></span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1268]"></div>
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 mb-16">
                                {paginatedProducts.map(p => (
                                    <ListingCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-[#eee] py-32 text-center text-gray-400 mb-16 rounded-lg bg-[#fcfcfc]">
                                <p className="text-lg font-semibold mb-2">No products found</p>
                                <p className="text-sm">We're stocking up on items for this category.</p>
                            </div>
                        )}

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
            </div>

            <Footer />
        </div>
    )
}
