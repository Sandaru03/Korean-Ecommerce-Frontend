import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { ChevronRight, ChevronLeft, Heart } from "lucide-react"

/* eslint-disable react/prop-types */

// ── Single product card ────────────────────────────────────────
function ListingCard({ product }) {
    const [wished, setWished] = useState(false)
    const brandName = product.name?.split(" ")[0] || "Brand"

    let imageUrl = "https://via.placeholder.com/300"
    let images = product.images || product.image
    if (typeof images === "string" && (images.startsWith("[") || images.startsWith("{"))) {
        try { images = JSON.parse(images) } catch { /* keep as string */ }
    }
    if (Array.isArray(images) && images.length > 0) imageUrl = images[0]
    else if (typeof images === "string") imageUrl = images

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
                    onClick={(e) => { e.preventDefault(); setWished(w => !w) }}
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
                    <div className="flex items-baseline gap-1.5 leading-none mt-1">
                        <span className="text-[16px] font-bold text-[#111]">
                            LKR {Number(product.price).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

// ── Large circle icons for categories ─────────────────────────
function CategoryCircles({ categories, selectedId, onSelect }) {
    if (!categories || categories.length === 0) return null
    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex justify-center gap-6 mb-2 flex-wrap min-w-max mx-auto px-4">
                {categories.map(cat => {
                    const isActive = selectedId === cat.id
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat)}
                            className="flex flex-col items-center gap-2.5 group shrink-0"
                        >
                            <div className={`w-[88px] h-[88px] rounded-full overflow-hidden border-[3px] transition-all duration-300 ${isActive ? "border-[#ff1268] scale-105" : "border-transparent group-hover:border-[#ff1268]"}`}>
                                <img
                                    src={cat.image || `https://picsum.photos/seed/${cat.slug}/200`}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className={`text-[13px] font-medium transition-all ${isActive ? "text-[#ff1268] font-bold" : "text-[#666] group-hover:text-[#ff1268] group-hover:font-bold"}`}>
                                {cat.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ── Sub-category pill filters ──────────────────────────────────
function SubCategoryPills({ subcategories, selectedName, onSelect }) {
    if (!subcategories || subcategories.length === 0) return null
    return (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${!selectedName ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#555] border-[#ddd] hover:border-[#999]"}`}
            >
                All
            </button>
            {subcategories.map(sub => (
                <button
                    key={sub.id}
                    onClick={() => onSelect(sub.name)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${selectedName === sub.name ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#555] border-[#ddd] hover:border-[#999]"}`}
                >
                    {sub.name}
                </button>
            ))}
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

    // Fetch products whenever selected category / sub changes
    useEffect(() => {
        if (!superCategory) return
        const fetchProducts = async () => {
            try {
                setProductsLoading(true)
                let url = `${import.meta.env.VITE_BACKEND_URL}/products`
                const params = new URLSearchParams()

                if (selectedCategory) {
                    params.set("category", selectedCategory.name)
                    if (selectedSubName) {
                        params.set("subCategory", selectedSubName)
                    }
                } else {
                    // No specific category selected — fetch all for super category using its name
                    params.set("category", superCategory.name)
                }
                const res = await axios.get(`${url}?${params.toString()}`)
                setProducts(Array.isArray(res.data) ? res.data : res.data?.products || [])
                setPage(1)
            } catch (err) {
                console.error("Error fetching products:", err)
                setProducts([])
            } finally {
                setProductsLoading(false)
            }
        }
        fetchProducts()
    }, [superCategory, selectedCategory, selectedSubName])

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
            <div className="w-full bg-gradient-to-r from-[#fff0f4] via-[#fff5f7] to-[#fff0f4] border-b border-[#eee] py-10 mb-0">
                <div className="mx-auto max-w-[1200px] px-6 flex items-center gap-6">
                    {superCategory.image && (
                        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-[#ff1268]/20 shrink-0 hidden sm:block">
                            <img src={superCategory.image} alt={superCategory.name} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#ff1268] mb-1">Collection</p>
                        <h1 className="text-[32px] font-black text-[#111] tracking-tight leading-none">{superCategory.name}</h1>
                        <p className="text-[14px] text-[#777] mt-2">
                            {categories.length} categories · {products.length} products
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Category circles ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-[#eee] py-6 shadow-sm">
                <div className="mx-auto max-w-[1200px] px-6">
                    {categories.length > 0 ? (
                        <CategoryCircles
                            categories={categories}
                            selectedId={selectedCategory?.id}
                            onSelect={handleSelectCategory}
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
                        {/* Sub-category pill filters */}
                        {selectedCategory && subCategories.length > 0 && (
                            <SubCategoryPills
                                subcategories={subCategories}
                                selectedName={selectedSubName}
                                onSelect={setSelectedSubName}
                            />
                        )}

                        {/* Section heading */}
                        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-[#111]">
                            <h3 className="text-[20px] font-bold text-[#111]">
                                {selectedSubName || selectedCategory?.name || superCategory.name} Products
                            </h3>
                            <span className="text-[13px] text-[#777] font-medium block pb-0.5">
                                Total <strong className="text-[#111]">{products.length}</strong>
                            </span>
                        </div>

                        {/* Product grid */}
                        {productsLoading ? (
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
