import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { ChevronRight, ChevronLeft, Heart } from "lucide-react"
import { CommonProductCard } from "@/components/coupang/CommonProductCard"

/* eslint-disable react/prop-types */


// ── Large circle icons for categories ─────────────────────────
function CategoryCircles({ categories, selectedId, onSelect, title }) {
    if (!categories || categories.length === 0) return null
    
    // Subtle pastel backgrounds matching Olive Young style
    const pastels = ['bg-[#eef2f5]', 'bg-[#fff1f1]', 'bg-[#f0f5ff]', 'bg-[#fff8ea]', 'bg-[#fcf0f5]']

    return (
        <div className="w-full pt-2">
            <div className="text-center mb-4">
                <h2 className="text-[18px] md:text-[22px] font-black text-[#111] tracking-tight">{title}</h2>
            </div>
            
            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex justify-center gap-4 md:gap-8 min-w-max mx-auto px-4 pb-2">
                    {categories.map((cat, idx) => {
                        const isActive = selectedId === cat.id
                        const bgColor = pastels[idx % pastels.length]
                        
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelect(cat)}
                                className="flex flex-col items-center gap-2 group shrink-0 w-[90px] md:w-[110px]"
                            >
                                <div className={`w-[85px] h-[85px] md:w-[105px] md:h-[105px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "border-[3px] border-[#ff1268] p-1 shadow-md scale-[1.03]" : "border-[2px] border-transparent p-1 group-hover:border-gray-200 group-hover:shadow-sm group-hover:scale-[1.03]"}`}>
                                    <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${bgColor}`}>
                                        <img
                                            src={cat.image || `https://picsum.photos/seed/${cat.slug}/200`}
                                            alt={cat.name}
                                            className="w-[85%] h-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <span className={`text-[12px] md:text-[14px] text-center leading-tight transition-all font-medium mt-1 ${isActive ? "text-[#ff1268] font-black" : "text-[#555] group-hover:text-[#111] font-bold"}`}>
                                    {cat.name}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


// ── Main Page Component ────────────────────────────────────────
export default function SuperCategoryPage() {
    const { slug } = useParams()

    const [superCategory, setSuperCategory] = useState(null)   // depth-0
    const [selectedCategory, setSelectedCategory] = useState(null) // depth-1
    const [selectedSubName, setSelectedSubName] = useState(null)   // depth-2 name
    const [products, setProducts] = useState([])
    const [groupedProducts, setGroupedProducts] = useState({}) // Added for grouped view
    const [loading, setLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const pageSize = 16

    // Fetch the super category (with 2 levels of children)
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/slug/${slug}`)
                const cat = res.data.category
                setSuperCategory(cat)
                setSelectedCategory(null)
                setSelectedSubName(null)
                setPage(1)
            } catch (err) {
                console.error("Failed to fetch super category:", err)
                setSuperCategory(null)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [slug])


    // Shuffle utility
    const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    // Fetch products whenever selected category / sub changes
    useEffect(() => {
        if (!superCategory) return
        const fetchProducts = async () => {
            try {
                setProductsLoading(true)
                if (selectedCategory) {
                    // Category selected — fetch its sub-categories in parallel
                    const children = selectedCategory.children || []
                    if (children.length > 0) {
                        const requests = children.map(sub =>
                            axios.get(`${import.meta.env.VITE_BACKEND_URL}/products?subCategory=${encodeURIComponent(sub.name)}`)
                                .then(r => ({ name: sub.name, products: Array.isArray(r.data) ? r.data : [] }))
                                .catch(() => ({ name: sub.name, products: [] }))
                        )
                        const results = await Promise.all(requests)
                        const grouped = {}
                        const allProducts = []
                        results.forEach(({ name, products }) => {
                            grouped[name] = products
                            allProducts.push(...products)
                        })
                        setGroupedProducts(grouped)
                        setProducts(allProducts)
                    } else {
                        // No sub-categories: fallback to category group
                        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products?category=${encodeURIComponent(selectedCategory.name)}`)
                        const list = Array.isArray(res.data) ? res.data : (res.data?.products || [])
                        setProducts(list)
                        setGroupedProducts({})
                    }
                } else {
                    // No specific category selected — fetch ALL products for this super category
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products?superCategory=${encodeURIComponent(superCategory.name)}`)
                    const list = Array.isArray(res.data) ? res.data : (res.data?.products || [])
                    // SHUFFLE for random look
                    setProducts(shuffleArray(list))
                    setGroupedProducts({})
                }
                setPage(1)
            } catch (err) {
                console.error("Error fetching products:", err)
                setProducts([])
                setGroupedProducts({})
            } finally {
                setProductsLoading(false)
            }
        }
        fetchProducts()
    }, [superCategory, selectedCategory])

    const handleSelectCategory = (cat) => {
        if (selectedCategory?.id === cat.id) {
            // Toggle off
            setSelectedCategory(null)
            setSelectedSubName(null)
        } else {
            setSelectedCategory(cat)
            setSelectedSubName(null)
        }
    }

    const categories = superCategory?.children || []  // depth-1
    const subCategories = selectedCategory?.children || []  // depth-2

    const totalPages = Math.ceil(products.length / pageSize)
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize)

    // ── Loading states ──────────────────────────────────────────
    if (loading) {
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

    if (!superCategory) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex flex-col items-center justify-center py-40">
                    <p className="text-2xl font-bold text-gray-400">Super Category not found</p>
                    <Link to="/" className="mt-4 text-blue-600 underline">← Go Home</Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#ff1268] selection:text-white">
            <Header />

            {/* ── Hero banner for the super category ── */}
            <div className="w-full bg-white pt-6 pb-0">
                <div className="mx-auto max-w-[1200px] px-6">
                    <h1 className="text-[28px] md:text-[34px] font-black text-[#111] tracking-tight leading-none uppercase">{superCategory.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-[#f0f0f0] text-[#555] text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                            Collection
                        </span>
                        <span className="text-[12px] md:text-[13px] text-[#777] font-medium">
                            {categories.length} categories &nbsp;·&nbsp; {products.length} products
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Category circles ── */}
            <div className="bg-white pb-6 border-b border-[#eee] mt-2">
                <div className="mx-auto max-w-[1200px] px-6">
                    {categories.length > 0 ? (
                        <CategoryCircles
                            categories={categories}
                            selectedId={selectedCategory?.id}
                            onSelect={handleSelectCategory}
                            title={`Trending ${superCategory.name} BEST`}
                        />
                    ) : (
                        <p className="text-center text-[#aaa] text-sm">No categories yet.</p>
                    )}
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="mx-auto max-w-[1200px] px-6 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-[#999] mb-6 uppercase tracking-wider font-bold flex-wrap">
                    <Link to="/" className="hover:text-[#111]">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#111]">{superCategory.name}</span>
                    {selectedCategory && (
                        <>
                            <ChevronRight className="h-3 w-3" />
                            <button onClick={() => { setSelectedCategory(selectedCategory); setSelectedSubName(null) }} className="text-[#111]">
                                {selectedCategory.name}
                            </button>
                        </>
                    )}
                    {selectedSubName && (
                        <>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-[#ff1268]">{selectedSubName}</span>
                        </>
                    )}
                </div>

                <div className="flex gap-10 items-start">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-[160px] shrink-0 sticky top-[200px]">
                        <h2 className="text-[28px] font-black text-[#111] mb-6 tracking-tight lowercase">
                            {selectedCategory ? selectedCategory.name : superCategory.name}
                        </h2>
                        <div className="space-y-1">
                            <button
                                onClick={() => { setSelectedCategory(null); setSelectedSubName(null) }}
                                className={`text-left w-full py-1.5 text-[14px] transition-colors ${!selectedCategory ? "font-bold text-[#ff1268]" : "text-[#666] hover:text-[#111]"}`}
                            >
                                All {superCategory.name}
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleSelectCategory(cat)}
                                    className={`text-left w-full py-1.5 text-[14px] transition-colors ${selectedCategory?.id === cat.id ? "font-bold text-[#ff1268]" : "text-[#666] hover:text-[#111]"}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main area */}
                    <div className="flex-1 min-w-0">

                        {/* Section heading */}
                        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-[#111]">
                            <h3 className="text-[20px] font-bold text-[#111]">
                                {selectedSubName || selectedCategory?.name || superCategory.name} Products
                            </h3>
                            <span className="text-[13px] text-[#777] font-medium block pb-0.5">
                                Total <strong className="text-[#111]">{products.length}</strong>
                            </span>
                        </div>

                        {/* Product area */}
                        {productsLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1268]"></div>
                            </div>
                        ) : selectedCategory && (selectedCategory.children || []).length > 0 ? (
                            /* ── Grouped by Subcategory (Korean e-commerce style) ── */
                            <div className="space-y-12 mb-20">
                                {(selectedCategory.children || []).map(sub => {
                                    const subProducts = groupedProducts[sub.name] || [];
                                    if (subProducts.length === 0) return null;
                                    return (
                                        <div key={sub.id}>
                                            {/* Section Header - Styled like the site theme */}
                                            <div className="flex items-center mb-8 px-5 py-3 bg-[#ff1268] text-white shadow-sm rounded-r-lg">
                                                <h4 className="text-[17px] font-black tracking-tight uppercase">
                                                    {sub.name}
                                                </h4>
                                            </div>
                                            {/* Products Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                                                {subProducts.map(p => (
                                                    <CommonProductCard key={p.id} product={p} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            /* Standard Grid */
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 mb-16">
                                {paginatedProducts.map(p => (
                                    <CommonProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-[#eee] py-32 text-center text-gray-400 mb-16 rounded-lg bg-[#fcfcfc]">
                                <p className="text-lg font-semibold mb-2">No products found</p>
                                <p className="text-sm">We're stocking up on items for this category.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1 border-t border-[#eee] pt-10 pb-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-10 h-10 flex items-center justify-center border border-[#ddd] text-[#333] hover:bg-gray-50 disabled:opacity-30 transition-colors"
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
                                    className="w-10 h-10 flex items-center justify-center border border-[#ddd] text-[#333] hover:bg-gray-50 disabled:opacity-30 transition-colors"
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
