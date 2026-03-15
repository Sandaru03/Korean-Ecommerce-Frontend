import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const BANNERS = [
    { id: 1, label: "Banner 1 — Premium Skincare Collection" },
    { id: 2, label: "Banner 2 — Vibrant Makeup & Nails" },
    { id: 3, label: "Banner 3 — The Best of K-Beauty" },
    { id: 4, label: "Banner 4 — Essential Hair Care" },
    { id: 5, label: "Banner 5 — Healthy Living & Supplements" },
];

function resolveImage(p) {
    let imgs = p?.images;
    if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    return p?.image || "/defult-product.jpg";
}

export default function ManageBannerCategories() {
    const [selectedBannerId, setSelectedBannerId] = useState(1);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    // New section form
    const [newTitle, setNewTitle] = useState("");
    const [newBadge, setNewBadge] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [showNewForm, setShowNewForm] = useState(false);

    // Product search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchingSectionId, setSearchingSectionId] = useState(null);

    // Inline edit state
    const [editing, setEditing] = useState({}); // { [sectionId]: { title, badge, description } }

    useEffect(() => {
        fetchSections();
    }, [selectedBannerId]);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/banner-sections?bannerId=${selectedBannerId}`);
            if (data.success) setSections(data.sections);
        } catch (err) {
            console.error("Error fetching banner sections:", err);
            toast.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async () => {
        if (!newTitle.trim()) { toast.error("Title is required"); return; }
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/banner-sections`, {
                bannerId: selectedBannerId,
                title: newTitle.trim(),
                badge: newBadge.trim(),
                description: newDesc.trim(),
                products: [],
                order: sections.length,
            });
            if (data.success) {
                setSections(prev => [...prev, { ...data.section, products: [] }]);
                setNewTitle(""); setNewBadge(""); setNewDesc("");
                setShowNewForm(false);
                toast.success("Category created!");
            }
        } catch (err) {
            console.error("Error creating section:", err);
            toast.error("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await axios.delete(`${backendUrl}/banner-sections/${id}`);
            setSections(prev => prev.filter(s => s.id !== id));
            toast.success("Deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete");
        }
    };

    const handleSaveEdit = async (id) => {
        const edits = editing[id];
        if (!edits) return;
        try {
            const { data } = await axios.put(`${backendUrl}/banner-sections/${id}`, edits);
            if (data.success) {
                setSections(prev => prev.map(s => s.id === id ? { ...s, ...edits } : s));
                setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
                toast.success("Saved!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save");
        }
    };

    // Product search debounce
    useEffect(() => {
        const t = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const { data } = await axios.get(`${backendUrl}/products/search/query?q=${searchQuery}`);
                    if (data.success) setSearchResults(data.products);
                } catch (err) { console.error(err); }
            } else {
                setSearchResults([]);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const handleAddProduct = async (sectionId, product) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;
        if (section.products.some(p => p.id === product.id)) { toast("Already added"); return; }

        const updatedIds = [...section.products.map(p => p.id), product.id];
        try {
            const { data } = await axios.put(`${backendUrl}/banner-sections/${sectionId}`, { products: updatedIds });
            if (data.success) {
                setSections(prev => prev.map(s => s.id === sectionId ? { ...s, products: [...s.products, product] } : s));
                setSearchQuery(""); setSearchResults([]); setSearchingSectionId(null);
                toast.success("Product added!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to add product");
        }
    };

    const handleRemoveProduct = async (sectionId, productId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;
        const updatedIds = section.products.filter(p => p.id !== productId).map(p => p.id);
        try {
            const { data } = await axios.put(`${backendUrl}/banner-sections/${sectionId}`, { products: updatedIds });
            if (data.success) {
                setSections(prev => prev.map(s => s.id === sectionId
                    ? { ...s, products: s.products.filter(p => p.id !== productId) }
                    : s));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove product");
        }
    };

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Banner Categories</h1>
                <p className="text-sm text-slate-500">Select a banner, create categories, and assign products to them.</p>
            </div>

            {/* Banner Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Banner</label>
                <div className="relative max-w-sm">
                    <select
                        value={selectedBannerId}
                        onChange={e => setSelectedBannerId(Number(e.target.value))}
                        className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {BANNERS.map(b => (
                            <option key={b.id} value={b.id}>{b.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Add Category Button / Form */}
            <div className="mb-6">
                {!showNewForm ? (
                    <button
                        onClick={() => setShowNewForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> New Category
                    </button>
                ) : (
                    <div className="bg-white border border-blue-200 rounded-xl shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">New Category for {BANNERS.find(b => b.id === selectedBannerId)?.label}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="e.g. Cleansers & Toners"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Badge / Label</label>
                                <input
                                    type="text"
                                    value={newBadge}
                                    onChange={e => setNewBadge(e.target.value)}
                                    placeholder="e.g. Step 1 — Foundation"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                            <textarea
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                placeholder="Short description for this category..."
                                rows={2}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreateSection}
                                disabled={loading}
                                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Creating..." : "Create Category"}
                            </button>
                            <button
                                onClick={() => { setShowNewForm(false); setNewTitle(""); setNewBadge(""); setNewDesc(""); }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sections List */}
            {loading && sections.length === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : sections.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">No categories for this banner yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Click "New Category" above to get started.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map(section => {
                        const isEditing = !!editing[section.id];
                        const editData = editing[section.id] || {};

                        return (
                            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
                                {/* Section Header */}
                                <div className="bg-slate-50 px-6 py-4 flex items-start justify-between border-b border-slate-100">
                                    <div className="flex-1 min-w-0 pr-4">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input
                                                    autoFocus
                                                    value={editData.title ?? section.title}
                                                    onChange={e => setEditing(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))}
                                                    className="w-full text-lg font-bold border-b-2 border-blue-500 bg-transparent outline-none text-slate-900 pb-1"
                                                />
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    <input
                                                        value={editData.badge ?? section.badge ?? ""}
                                                        onChange={e => setEditing(prev => ({ ...prev, [section.id]: { ...prev[section.id], badge: e.target.value } }))}
                                                        placeholder="Badge label"
                                                        className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                                                    />
                                                    <input
                                                        value={editData.description ?? section.description ?? ""}
                                                        onChange={e => setEditing(prev => ({ ...prev, [section.id]: { ...prev[section.id], description: e.target.value } }))}
                                                        placeholder="Description"
                                                        className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {section.badge && <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">{section.badge}</span>}
                                                <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                                                {section.description && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{section.description}</p>}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(section.id)}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditing(prev => { const n = { ...prev }; delete n[section.id]; return n; })}
                                                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditing(prev => ({ ...prev, [section.id]: { title: section.title, badge: section.badge || "", description: section.description || "" } }))}
                                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteSection(section.id)}
                                            className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="p-6">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        Products ({section.products.length})
                                    </h3>

                                    {section.products.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-5">
                                            {section.products.map(product => (
                                                <div key={product.id} className="relative group flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                    <img
                                                        src={resolveImage(product)}
                                                        alt={product.name}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    <div className="p-2 flex-1">
                                                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight">{product.name}</p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">LKR {Number(product.price).toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveProduct(section.id, product.id)}
                                                        className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Product Search */}
                                    {searchingSectionId === section.id ? (
                                        <div className="relative max-w-md">
                                            <div className="flex items-center gap-2 border border-blue-400 rounded-lg px-3 py-2 bg-white">
                                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    placeholder="Search products to add..."
                                                    className="flex-1 text-sm outline-none"
                                                />
                                                <button onClick={() => { setSearchingSectionId(null); setSearchQuery(""); }} className="text-slate-400 hover:text-slate-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {searchQuery.length > 1 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                                    {searchResults.length === 0 ? (
                                                        <p className="p-3 text-sm text-slate-400">No products found.</p>
                                                    ) : (
                                                        searchResults.map(product => (
                                                            <button
                                                                key={product.id}
                                                                onClick={() => handleAddProduct(section.id, product)}
                                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-left"
                                                            >
                                                                <img src={resolveImage(product)} className="w-9 h-9 object-cover rounded" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                                                                    <p className="text-xs text-slate-400">LKR {Number(product.price).toLocaleString()}</p>
                                                                </div>
                                                                <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setSearchingSectionId(section.id); setSearchQuery(""); }}
                                            className="text-sm text-blue-600 font-semibold flex items-center gap-1.5 hover:underline"
                                        >
                                            <Plus className="w-4 h-4" /> Add Product
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
