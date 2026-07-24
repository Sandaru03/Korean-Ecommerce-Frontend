import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, ToggleLeft, ToggleRight, Pencil, Check } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageFeaturedStrip() {
    const [strip, setStrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Title edit
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState("");

    // Product search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);

    // ── Load strip ──────────────────────────────────────────────
    useEffect(() => {
        fetchStrip();
    }, []);

    const fetchStrip = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/featured-strip`);
            if (data.success) {
                setStrip(data.strip);
                setTitleInput(data.strip.title);
            }
        } catch (err) {
            console.error("Error fetching strip:", err);
            toast.error("Failed to load featured strip");
        } finally {
            setLoading(false);
        }
    };

    // ── Save title ──────────────────────────────────────────────
    const handleSaveTitle = async () => {
        if (!titleInput.trim()) return;
        try {
            setSaving(true);
            const { data } = await axios.put(`${backendUrl}/featured-strip`, { title: titleInput });
            if (data.success) {
                setStrip(s => ({ ...s, title: data.strip.title }));
                setEditingTitle(false);
                toast.success("Title updated!");
            }
        } catch (err) {
            toast.error("Failed to save title");
        } finally {
            setSaving(false);
        }
    };

    // ── Toggle active ───────────────────────────────────────────
    const handleToggleActive = async () => {
        try {
            const { data } = await axios.put(`${backendUrl}/featured-strip`, { active: !strip.active });
            if (data.success) {
                setStrip(s => ({ ...s, active: !s.active }));
                toast.success(data.strip.active ? "Section is now visible" : "Section hidden");
            }
        } catch (err) {
            toast.error("Failed to update visibility");
        }
    };

    // ── Product search debounce ─────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const { data } = await axios.get(`${backendUrl}/products/search/query?q=${searchQuery}`);
                    if (data.success) setSearchResults(data.products);
                } catch { setSearchResults([]); }
            } else {
                setSearchResults([]);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ── Add product ─────────────────────────────────────────────
    const handleAddProduct = async (product) => {
        if (!strip) return;
        if (strip.products.some(p => p.id === product.id)) {
            toast("Already in the strip", { icon: "ℹ️" });
            return;
        }
        const newIds = [...strip.products.map(p => p.id), product.id];
        try {
            setSaving(true);
            const { data } = await axios.put(`${backendUrl}/featured-strip`, { products: newIds });
            if (data.success) {
                setStrip(s => ({ ...s, products: [...s.products, product] }));
                setSearchResults(prev => prev.filter(p => p.id !== product.id));
                toast.success(`"${product.name}" added`);
            }
        } catch (err) {
            toast.error("Failed to add product");
        } finally {
            setSaving(false);
        }
    };

    // ── Remove product ──────────────────────────────────────────
    const handleRemoveProduct = async (productId) => {
        if (!strip) return;
        const newIds = strip.products.filter(p => p.id !== productId).map(p => p.id);
        try {
            setSaving(true);
            const { data } = await axios.put(`${backendUrl}/featured-strip`, { products: newIds });
            if (data.success) {
                setStrip(s => ({ ...s, products: s.products.filter(p => p.id !== productId) }));
                toast.success("Product removed");
            }
        } catch (err) {
            toast.error("Failed to remove product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#ff1268] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Featured Products Strip</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        This single-line scrollable section appears between Topic 4 and Topic 5 on the homepage.
                    </p>
                </div>

                {/* Settings card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="font-semibold text-gray-800">Section Settings</span>
                        {/* Active toggle */}
                        <button
                            onClick={handleToggleActive}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                                strip?.active
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                            }`}
                        >
                            {strip?.active
                                ? <><ToggleRight className="w-4 h-4" /> Visible</>
                                : <><ToggleLeft className="w-4 h-4" /> Hidden</>
                            }
                        </button>
                    </div>

                    <div className="px-6 py-5">
                        {/* Title field */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                        {editingTitle ? (
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={titleInput}
                                    onChange={e => setTitleInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSaveTitle()}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#ff1268] focus:border-transparent"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveTitle}
                                    disabled={saving}
                                    className="p-2 bg-[#ff1268] text-white rounded-lg hover:bg-[#e0005a] disabled:opacity-50 transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setEditingTitle(false); setTitleInput(strip?.title || ""); }}
                                    className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <p className="flex-1 text-base font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                                    {strip?.title || "Featured Products"}
                                </p>
                                <button
                                    onClick={() => setEditingTitle(true)}
                                    className="p-2 text-gray-400 hover:text-[#ff1268] hover:bg-pink-50 rounded-lg transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                            Products in Strip
                            <span className="ml-2 text-xs text-gray-400 font-normal">
                                ({strip?.products?.length || 0} products)
                            </span>
                        </span>
                        <button
                            onClick={() => setSearchOpen(s => !s)}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#ff1268] hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>

                    {/* Search bar */}
                    {searchOpen && (
                        <div className="px-6 pt-4 relative">
                            <div className="flex items-center border border-[#ff1268] rounded-xl px-3 py-2.5 bg-white gap-2">
                                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search product by name..."
                                    className="flex-1 outline-none text-sm bg-transparent"
                                    autoFocus
                                />
                                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
                                </button>
                            </div>
                            {searchResults.length > 0 && (
                                <div className="absolute left-6 right-6 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                                    {searchResults.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleAddProduct(product)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 border-b border-gray-50 last:border-0 text-left"
                                        >
                                            <img
                                                src={product.images?.[0] || "/default-product.jpg"}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                                                alt={product.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-400">LKR {Number(product.price).toLocaleString()}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-[#ff1268] shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {searchQuery.length > 1 && searchResults.length === 0 && (
                                <div className="absolute left-6 right-6 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 text-sm text-gray-500">
                                    No products found.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="px-6 py-4">
                        {!strip?.products?.length ? (
                            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400 text-sm">No products added yet.</p>
                                <p className="text-gray-300 text-xs mt-1">Click "Add Product" to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {strip.products.map((product, idx) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
                                    >
                                        <span className="text-xs text-gray-300 w-5 text-center font-mono shrink-0">{idx + 1}</span>
                                        <img
                                            src={product.images?.[0] || "/default-product.jpg"}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                                            alt={product.name}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">LKR {Number(product.price).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveProduct(product.id)}
                                            disabled={saving}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove from strip"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview note */}
                <div className="text-center text-xs text-gray-400 pb-4">
                    Changes save instantly. Visit the homepage to see your featured strip in action.
                </div>
            </div>
        </div>
    );
}
