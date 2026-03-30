import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/coupang/header";
import { Footer } from "../components/coupang/footer";
import { CommonProductCard } from "../components/coupang/CommonProductCard";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) return;
            setIsLoading(true);
            try {
                // 1. Fetch matching products from backend API search endpoint
                const prodRes = await axios.get(`${backendUrl}/products/search/query?q=${encodeURIComponent(query)}`);
                if (prodRes.data.success) {
                    setProducts(prodRes.data.products || []);
                }

                // 2. Fetch all categories and perform simple local grep to show categories matching query
                const catRes = await axios.get(`${backendUrl}/categories`);
                if (catRes.data.success) {
                    const allCategories = catRes.data.categories || [];
                    const qLower = query.toLowerCase();
                    const filteredCats = allCategories.filter(c => c.name.toLowerCase().includes(qLower));
                    setCategories(filteredCats);
                }
            } catch (err) {
                console.error("Error fetching search results:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
            <Header />

            <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Search Results for <span className="text-primary">"{query}"</span>
                    </h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* CATEGORIES SECTION */}
                        {categories.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-xl font-bold border-b border-gray-200 pb-3 mb-4 text-gray-700">Matching Categories ({categories.length})</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {categories.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            to={cat.parentId === null ? `/super-category/${cat.slug}` : `/category/${cat.slug}`}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1"
                                        >
                                            <div className="text-sm font-bold text-gray-800 uppercase tracking-tight">{cat.name}</div>
                                            <div className="text-[10px] text-gray-400 mt-2">{cat.parentId === null ? 'Main Category' : 'Sub Category'}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRODUCTS SECTION */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold border-b border-gray-200 pb-3 mb-4 text-gray-700">Matching Products ({products.length})</h2>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                    {products.map(product => (
                                        <CommonProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-lg font-bold mb-1">No products found</h3>
                                    <p className="text-sm">We couldn't find any items matching "{query}". Try checking your spelling or using different keywords.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
