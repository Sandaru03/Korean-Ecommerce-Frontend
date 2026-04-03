import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, X, Clock, Zap } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function resolveProductImage(product) {
    let images = product.images || product.image;
    if (typeof images === "string") {
        try { images = JSON.parse(images); } catch { images = [images]; }
    }
    if (Array.isArray(images) && images.length > 0) return images[0];
    return null;
}

export default function ManageTimeDeals() {
    const [deal, setDeal] = useState({ title: "Time Deals", dealEndsAt: "", productIds: [], active: true });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchTimerRef = useRef(null);

    useEffect(() => {
        fetchDeal();
    }, []);

    const fetchDeal = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/time-deals`);
            if (data.success) {
                const d = data.deal;
                setDeal({
                    title: d.title || "Time Deals",
                    dealEndsAt: d.dealEndsAt ? new Date(d.dealEndsAt).toISOString().slice(0, 16) : "",
                    productIds: d.productIds || [],
                    active: d.active !== false,
                });
                setSelectedProducts(d.products || []);
            }
        } catch (err) {
            console.error("Error loading time deal:", err);
            toast.error("Failed to load Time Deals config");
        } finally {
            setLoading(false);
        }
    };

    // Debounced product search
    useEffect(() => {
        clearTimeout(searchTimerRef.current);
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        searchTimerRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const { data } = await axios.get(`${backendUrl}/products/search/query?q=${encodeURIComponent(searchQuery.trim())}`);
                if (data.success) setSearchResults(data.products?.slice(0, 8) || []);
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(searchTimerRef.current);
    }, [searchQuery]);

    const addProduct = (product) => {
        if (selectedProducts.length >= 10) {
            toast.error("Maximum 10 products allowed for Time Deals");
            return;
        }
        if (selectedProducts.find(p => p.id === product.id)) {
            toast.error("Product already added");
            return;
        }
        setSelectedProducts(prev => [...prev, product]);
        setSearchQuery("");
        setSearchResults([]);
    };

    const removeProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                title: deal.title,
                dealEndsAt: deal.dealEndsAt || null,
                productIds: selectedProducts.map(p => p.id),
                active: deal.active,
            };
            const { data } = await axios.put(`${backendUrl}/time-deals`, payload);
            if (data.success) {
                toast.success("Time Deals saved successfully! ⚡");
            } else {
                toast.error("Failed to save");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save Time Deals");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                    <Zap className="text-amber-600 h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Time Deals</h1>
                    <p className="text-sm text-slate-500">Manage flash sale products with a countdown timer</p>
                </div>
            </div>

            {/* Config Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-800">Deal Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Section Title</label>
                        <input
                            type="text"
                            value={deal.title}
                            onChange={e => setDeal(d => ({ ...d, title: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Time Deals"
                        />
                    </div>

                    {/* Deal Ends At */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-amber-500" />
                            Deal Ends At (optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={deal.dealEndsAt}
                            onChange={e => setDeal(d => ({ ...d, dealEndsAt: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {deal.dealEndsAt && (
                            <button
                                onClick={() => setDeal(d => ({ ...d, dealEndsAt: "" }))}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Clear deadline
                            </button>
                        )}
                    </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDeal(d => ({ ...d, active: !d.active }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${deal.active ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${deal.active ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                        {deal.active ? "Section is active (visible on homepage)" : "Section is inactive (hidden)"}
                    </span>
                </div>
            </div>

            {/* Product Search */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-800">Products</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${selectedProducts.length >= 10 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                        {selectedProducts.length} / 10
                    </span>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search for products to add..."
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={selectedProducts.length >= 10}
                    />

                    {/* Search results dropdown */}
                    {(isSearching || searchResults.length > 0) && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                            {isSearching ? (
                                <div className="p-4 text-center text-sm text-slate-500 animate-pulse">Searching...</div>
                            ) : (
                                searchResults.map(product => {
                                    const img = resolveProductImage(product);
                                    const alreadyAdded = !!selectedProducts.find(p => p.id === product.id);
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => !alreadyAdded && addProduct(product)}
                                            disabled={alreadyAdded}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${alreadyAdded ? "bg-slate-50 opacity-60 cursor-not-allowed" : "hover:bg-blue-50"}`}
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                                                {img ? <img src={img} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                                                <p className="text-xs text-slate-500">LKR {Number(product.price).toLocaleString()}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${alreadyAdded ? "bg-slate-200 text-slate-500" : "bg-blue-100 text-blue-700"}`}>
                                                {alreadyAdded ? "Added" : "+ Add"}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Products */}
                {selectedProducts.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No products selected yet. Search and add up to 10.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {selectedProducts.map((product, idx) => {
                            const img = resolveProductImage(product);
                            return (
                                <div key={product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-slate-200 overflow-hidden">
                                        {img ? <img src={img} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                                        <p className="text-xs text-slate-500">LKR {Number(product.price).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-md"
                >
                    {saving ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Saving...</>
                    ) : (
                        <><Zap className="h-4 w-4" /> Save Time Deals</>
                    )}
                </button>
            </div>
        </div>
    );
}
