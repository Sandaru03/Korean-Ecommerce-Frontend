import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, ChevronDown, Edit, ArrowLeft, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function resolveImage(p) {
    let imgs = p?.images;
    if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    return p?.image || "/defult-product.jpg";
}

export default function ManageBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("list"); // 'list', 'edit'
    const [currentBanner, setCurrentBanner] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/banners`);
            if (data.success) setBanners(data.banners);
        } catch (err) {
            console.error("Error fetching banners:", err);
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setCurrentBanner({
            title: "", subtitle: "", heroImage: "", accent: "", topBannerImage: "",
            topInstructionsTitle: "", topInstructionsText: "", bgGradient: "from-[#fff0f4] to-[#ffe0ea]",
            bottomInstructionsTitle: "", bottomInstructionsText: "", bottomInstructionsTip: "", isActive: true
        });
        setView("edit");
    };

    const handleEdit = (banner) => {
        setCurrentBanner(banner);
        setView("edit");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner and all its product categories?")) return;
        try {
            await axios.delete(`${backendUrl}/banners/${id}`);
            toast.success("Banner deleted successfully");
            fetchBanners();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete banner");
        }
    };

    if (view === "list") {
        return (
            <div className="w-full h-full p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Banner Pages</h1>
                        <p className="text-sm text-slate-500">Manage Hero Banners and their Dynamic Pages.</p>
                    </div>
                    <button onClick={handleCreateNew} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Create New Banner Page
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map(banner => (
                            <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                <div className="h-32 bg-slate-100 flex items-center justify-center relative">
                                    {banner.heroImage ? (
                                        <img src={banner.heroImage} alt={banner.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-slate-300" />
                                    )}
                                    {!banner.isActive && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Inactive</div>
                                    )}
                                </div>
                                <div className="p-4 flex-1">
                                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{banner.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{banner.subtitle || "No subtitle"}</p>
                                </div>
                                <div className="p-4 border-t border-slate-100 flex justify-between">
                                    <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                    <button onClick={() => handleEdit(banner)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                                        <Edit className="w-4 h-4" /> Edit Content
                                    </button>
                                </div>
                            </div>
                        ))}
                        {banners.length === 0 && (
                            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-400 font-medium">No banners established yet.</p>
                                <button onClick={handleCreateNew} className="text-blue-600 font-semibold mt-2">Create your first banner</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <BannerEditor 
            banner={currentBanner} 
            onBack={() => setView("list")} 
            onSaveSuccess={() => { setView("list"); fetchBanners(); }} 
        />
    );
}

// Sub-component for editing a single Banner
function BannerEditor({ banner, onBack, onSaveSuccess }) {
    const [formData, setFormData] = useState({ ...banner });
    const [saving, setSaving] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingTop, setUploadingTop] = useState(false);
    const isNew = !banner.id;
    const [activeTab, setActiveTab] = useState("general"); // general, sections

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const setUploading = fieldName === 'heroImage' ? setUploadingHero : setUploadingTop;
        try {
            setUploading(true);
            const url = await mediaUpload(file);
            setFormData(prev => ({ ...prev, [fieldName]: url }));
            toast.success("Image uploaded to Cloudinary!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title) return toast.error("Title is required");
        
        try {
            setSaving(true);
            if (isNew) {
                const { data } = await axios.post(`${backendUrl}/banners`, formData);
                if (data.success) {
                    toast.success("Banner created!");
                    // Switch to existing mode so sections can be edited
                    setFormData(data.banner); 
                    // Do not close, instead allow editing sections now
                }
            } else {
                const { data } = await axios.put(`${backendUrl}/banners/${formData.id}`, formData);
                if (data.success) {
                    toast.success("Banner updated!");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save banner");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full h-full p-6 bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{isNew ? "Create Banner Page" : "Edit Banner Page"}</h1>
                        <p className="text-sm text-slate-500">{formData.title || "New Banner"}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50">
                        {saving ? "Saving..." : "Save Banner Details"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button 
                    onClick={() => setActiveTab("general")} 
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Banner Configurations
                </button>
                <button 
                    onClick={() => {
                        if (isNew) return toast.error("Please save the banner first before managing categories");
                        setActiveTab("sections");
                    }} 
                    className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'sections' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'} ${isNew ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Categories & Products
                </button>
            </div>

            {/* General Tab Content */}
            <div className={`space-y-6 ${activeTab !== 'general' ? 'hidden' : ''} overflow-y-auto pb-20`}>
                
                {/* Hero Banner Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">1. Hero Banner (Home Page Carousel)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Premium Skincare Collection" />
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Accent Badge</label>
                            <input name="accent" value={formData.accent} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. New Season Drops" />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Subtitle</label>
                            <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Hydrate and glow with our curated selections" />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Image URL (Home Page Carousel Image)</label>
                            <div className="flex items-center gap-3">
                                <input name="heroImage" value={formData.heroImage} onChange={handleChange} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://res.cloudinary.com/..." />
                                <div className="relative">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'heroImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    <button type="button" disabled={uploadingHero} className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-2 disabled:opacity-50">
                                        {uploadingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} Upload
                                    </button>
                                </div>
                            </div>
                            {formData.heroImage && <img src={formData.heroImage} alt="Hero Preview" className="mt-3 h-24 object-cover rounded-lg border border-slate-200" />}
                        </div>
                    </div>
                </div>

                {/* Banner Page Content */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">2. Inside Page Design & Content</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Top Banner Image URL (Full Width Inner Page Header)</label>
                            <div className="flex items-center gap-3">
                                <input name="topBannerImage" value={formData.topBannerImage} onChange={handleChange} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://res.cloudinary.com/..." />
                                <div className="relative">
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'topBannerImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                    <button type="button" disabled={uploadingTop} className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-2 disabled:opacity-50">
                                        {uploadingTop ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} Upload
                                    </button>
                                </div>
                            </div>
                            {formData.topBannerImage && <img src={formData.topBannerImage} alt="Top Preview" className="mt-3 h-24 object-cover rounded-lg border border-slate-200" />}
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Top Instructions Title</label>
                            <input name="topInstructionsTitle" value={formData.topInstructionsTitle} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Your Glow Starts Here" />
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Background Gradient (Tailwind Class)</label>
                            <input name="bgGradient" value={formData.bgGradient} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. from-[#fff0f4] to-[#ffe0ea]" />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Top Instructions Text</label>
                            <textarea name="topInstructionsText" value={formData.topInstructionsText} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Introduction paragraph..." />
                        </div>
                    </div>

                    <h3 className="text-md font-bold text-slate-700 mb-3 mt-6 border-t border-slate-100 pt-4">Bottom Instructions (Footer of Banner Page)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Bottom Title</label>
                            <input name="bottomInstructionsTitle" value={formData.bottomInstructionsTitle} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. ⚠️ Important Advice" />
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pro Tip (Highlighted Text)</label>
                            <input name="bottomInstructionsTip" value={formData.bottomInstructionsTip} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 💡 Pro Tip: Apply products from thinnest to thickest..." />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Bottom Text</label>
                            <textarea name="bottomInstructionsText" value={formData.bottomInstructionsText} onChange={handleChange} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Detailed instructions at the bottom..." />
                        </div>
                    </div>
                </div>
                
                {/* Status */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Banner Visibility</h2>
                        <p className="text-sm text-slate-500 mt-1">If inactive, it won't appear on the home screen carousel.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-2 ring-transparent peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-semibold text-gray-900">{formData.isActive ? "Active" : "Hidden"}</span>
                    </label>
                </div>
            </div>

            {/* Sections Tab Content */}
            {activeTab === 'sections' && !isNew && (
                <div className="flex-1 overflow-y-auto">
                    <BannerCategoriesManager bannerId={formData.id} bannerTitle={formData.title} />
                </div>
            )}
        </div>
    );
}

// Inline component to manage Categories & Products for a specific banner
function BannerCategoriesManager({ bannerId, bannerTitle }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    // New section form
    const [newTitle, setNewTitle] = useState("");
    const [showNewForm, setShowNewForm] = useState(false);

    // Product search
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchingSectionId, setSearchingSectionId] = useState(null);

    // Inline edit state
    const [editing, setEditing] = useState({});

    useEffect(() => {
        if(bannerId) fetchSections();
    }, [bannerId]);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/banner-sections?bannerId=${bannerId}`);
            if (data.success) setSections(data.sections);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async () => {
        if (!newTitle.trim()) { toast.error("Title is required"); return; }
        try {
            setLoading(true);
            const { data } = await axios.post(`${backendUrl}/banner-sections`, {
                bannerId: bannerId,
                title: newTitle.trim(),
                products: [],
                order: sections.length,
            });
            if (data.success) {
                setSections(prev => [...prev, { ...data.section, products: [] }]);
                setNewTitle("");
                setShowNewForm(false);
                toast.success("Category created!");
            }
        } catch (err) {
            console.error(err);
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
        } catch (err) { toast.error("Failed to delete"); }
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
        } catch (err) { toast.error("Failed to save"); }
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
        } catch (err) { toast.error("Failed to add product"); }
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
        } catch (err) { toast.error("Failed to remove product"); }
    };

    return (
        <div className="pb-20">
            {/* Add Category Form */}
            <div className="mb-6">
                {!showNewForm ? (
                    <button onClick={() => setShowNewForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add Product Category Section
                    </button>
                ) : (
                    <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">New Section for {bannerTitle}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Cleansers & Toners" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleCreateSection} disabled={loading} className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50">
                                {loading ? "Creating..." : "Create Category"}
                            </button>
                            <button onClick={() => { setShowNewForm(false); setNewTitle(""); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sections List */}
            {loading && sections.length === 0 ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600" /></div>
            ) : sections.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">No product categories for this banner.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map(section => {
                        const isEditing = !!editing[section.id];
                        const editData = editing[section.id] || {};

                        return (
                            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="bg-slate-50 px-6 py-4 flex items-start justify-between border-b border-slate-100">
                                    <div className="flex-1 min-w-0 pr-4">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input autoFocus value={editData.title ?? section.title} onChange={e => setEditing(prev => ({ ...prev, [section.id]: { ...prev[section.id], title: e.target.value } }))} className="w-full text-lg font-bold border-b-2 border-blue-500 bg-transparent outline-none pb-1" />
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleSaveEdit(section.id)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Save</button>
                                                <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[section.id]; return n; })} className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300">Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => setEditing(prev => ({ ...prev, [section.id]: { title: section.title } }))} className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100">Edit</button>
                                        )}
                                        <button onClick={() => handleDeleteSection(section.id)} className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                
                                {/* Products */}
                                <div className="p-6">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Products ({section.products.length})</h3>
                                    {section.products.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
                                            {section.products.map(product => (
                                                <div key={product.id} className="relative group flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                    <img src={resolveImage(product)} alt={product.name} className="w-full h-24 object-cover" />
                                                    <div className="p-2 flex-1">
                                                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-2">{product.name}</p>
                                                    </div>
                                                    <button onClick={() => handleRemoveProduct(section.id, product.id)} className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Product Search */}
                                    {searchingSectionId === section.id ? (
                                        <div className="relative max-w-md">
                                            <div className="flex items-center gap-2 border border-blue-400 rounded-lg px-3 py-2 bg-white">
                                                <Search className="w-4 h-4 text-slate-400" />
                                                <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 text-sm outline-none" />
                                                <button onClick={() => { setSearchingSectionId(null); setSearchQuery(""); }}><X className="w-4 h-4 text-slate-400" /></button>
                                            </div>
                                            {searchQuery.length > 1 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                                    {searchResults.map(product => (
                                                        <button key={product.id} onClick={() => handleAddProduct(section.id, product)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 border-b border-slate-100 text-left">
                                                            <img src={resolveImage(product)} className="w-8 h-8 object-cover rounded" />
                                                            <div className="flex-1"><p className="text-sm font-medium truncate">{product.name}</p></div>
                                                            <Plus className="w-4 h-4 text-blue-500" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <button onClick={() => { setSearchingSectionId(section.id); setSearchQuery(""); }} className="text-sm text-blue-600 font-semibold flex items-center gap-1"><Plus className="w-4 h-4" /> Add Product</button>
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
