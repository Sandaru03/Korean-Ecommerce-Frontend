import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaLayerGroup, FaImage } from "react-icons/fa";
import { Search, X, ChevronDown, ChevronUp, Package } from "lucide-react";
import Loader from "../../components/admin-utils/loader";
import uploadFile from "../../utils/mediaUpload";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function resolveImage(p) {
    let imgs = p?.images;
    if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    return p?.image || "/defult-product.jpg";
}

// ── Product Manager for a single sub-category ─────────────────
function SubCategoryProductManager({ sub, parentName, rootName, token }) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const debounceRef = useRef(null);

    const getHeaders = () => token ? { Authorization: `Bearer ${token}` } : {};

    const fetchCategoryProducts = async () => {
        try {
            setLoadingProducts(true);
            const { data } = await axios.get(`${backendUrl}/products?subCategory=${encodeURIComponent(sub.name)}&includeUnavailable=true`, { headers: getHeaders() });
            // API returns a plain array
            const list = Array.isArray(data) ? data : (data.products || []);
            setProducts(list);
        } catch (err) {
            console.error("Error fetching subcategory products:", err);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Fetch product count on mount
    useEffect(() => { fetchCategoryProducts(); }, [sub.name]);

    const handleToggle = () => {
        if (!open) fetchCategoryProducts(); // Always re-fetch on open to show latest
        setOpen(o => !o);
    };

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/products/search/query?q=${encodeURIComponent(searchQuery)}`);
                if (data.success) setSearchResults(data.products || []);
            } catch { setSearchResults([]); }
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchQuery]);

    const handleAssignProduct = async (product) => {
        if (products.find(p => p.id === product.id)) {
            toast("Already in this subcategory");
            return;
        }
        try {
            const res = await axios.put(
                `${backendUrl}/products/${product.productId}`,
                // Save complete hierarchy lineage to ensure global discovery
                { 
                    subCategory: sub.name, 
                    category: parentName || "",
                    superCategory: rootName || ""
                },
                { headers: getHeaders() }
            );
            if (res.status === 200) {
                setProducts(prev => [...prev, product]);
                setSearchQuery("");
                setSearchResults([]);
                setSearchOpen(false);
                toast.success(`"${product.name}" assigned to ${sub.name}!`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to assign product");
        }
    };

    const handleRemoveProduct = async (product) => {
        if (!window.confirm(`Remove "${product.name}" from this subcategory?`)) return;
        try {
            await axios.put(
                `${backendUrl}/products/${product.productId}`,
                { subCategory: "" },
                { headers: getHeaders() }
            );
            setProducts(prev => prev.filter(p => p.id !== product.id));
            toast.success(`"${product.name}" removed from ${sub.name}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove product");
        }
    };

    return (
        <div className="border-t border-slate-100 bg-slate-50/60">
            {/* Toggle Panel */}
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between px-6 py-3 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <span className="flex items-center gap-2 font-medium">
                    <Package className="w-4 h-4 text-purple-400" />
                    Manage Products
                    {products.length > 0 && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                            {products.length}
                        </span>
                    )}
                </span>
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {open && (
                <div className="px-6 pb-6 pt-4 space-y-6">
                    {/* Primary Search Header: Always visible */}
                    <div className="relative group/search">
                        <div className="flex items-center gap-3 bg-white border-2 border-purple-100 rounded-[1.25rem] px-5 py-4 shadow-sm focus-within:border-purple-400 focus-within:shadow-lg focus-within:shadow-purple-100/50 transition-all duration-300">
                            <Search className="w-5 h-5 text-purple-400 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={`Search global inventory to add to "${sub.name}"...`}
                                className="flex-1 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            )}
                        </div>
                        
                        {/* Instant Search Results Overlay */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-[30] left-0 right-0 top-[110%] bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto animate-in slide-in-from-top-2 duration-200 divide-y divide-slate-50">
                                <div className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Search Results ({searchResults.length})
                                </div>
                                {searchResults.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleAssignProduct(product)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-purple-50 text-left transition-colors group/item"
                                    >
                                        <div className="relative w-12 h-12 shrink-0">
                                            <img src={resolveImage(product)} className="w-full h-full object-cover rounded-xl border border-slate-100 group-hover/item:scale-105 transition-transform" alt={product.name} />
                                            <div className="absolute inset-0 bg-purple-600/0 group-hover/item:bg-purple-600/10 rounded-xl transition-colors flex items-center justify-center">
                                                <FaPlus className="text-white opacity-0 group-hover/item:opacity-100 scale-50 group-hover/item:scale-100 transition-all" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate group-hover/item:text-purple-700 transition-colors uppercase tracking-tight">{product.name}</p>
                                            <p className="text-xs text-slate-400 font-bold mt-0.5">LKR {Number(product.price).toLocaleString()}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity">ASSIGN</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Products list */}
                    {loadingProducts ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
                            Loading products...
                        </div>
                    ) : products.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No products assigned to this subcategory yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {products.map(product => (
                                <div key={product.id} className="group relative flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-square overflow-hidden bg-slate-50">
                                        <img src={resolveImage(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-2">
                                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-snug">{product.name}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">LKR {Number(product.price).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProduct(product)}
                                        className="absolute top-1.5 right-1.5 h-6 w-6 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center shadow-md transition-all"
                                        title="Remove from subcategory"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function SubCategoryAdminPage() {
    const { parentId } = useParams();
    const navigate = useNavigate();

    const [parentCategory, setParentCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addName, setAddName] = useState("");
    const [addImage, setAddImage] = useState("");
    const [addFile, setAddFile] = useState(null);
    const [adding, setAdding] = useState(false);

    const token = localStorage.getItem("token");
    const getHeaders = () => token ? { Authorization: `Bearer ${token}` } : {};

    const [rootCategoryName, setRootCategoryName] = useState("");
    const [parentCategoryName, setParentCategoryName] = useState("");

    useEffect(() => {
        fetchData();
    }, [parentId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${backendUrl}/categories/${parentId}`,
                { headers: getHeaders() }
            );
            const cat = res.data.category;
            if (!cat) throw new Error("Category not found");
            
            setParentCategory(cat);
            setSubcategories(cat.children || []);

            // Determine Root Category Name for product assignment (Level 0, 1, or 2)
            if (!cat.parentId) {
                setRootCategoryName(cat.name);
                setParentCategoryName("");
            } else if (cat.parent && !cat.parent.parentId) {
                setRootCategoryName(cat.parent.name);
                setParentCategoryName(cat.name); // If at Level 1, parent is Level 0
            } else if (cat.parent && cat.parent.parent) {
                setRootCategoryName(cat.parent.parent.name);
                setParentCategoryName(cat.parent.name);
            } else {
                setRootCategoryName(cat.name);
                setParentCategoryName("");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to load category data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This will also remove its children.`)) return;
        try {
            await axios.delete(`${backendUrl}/categories/${id}`, { headers: getHeaders() });
            toast.success(`"${name}" deletedSuccessfully`);
            setSubcategories(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category.");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const trimmedName = addName?.trim();
        if (!trimmedName) return toast.error("Name is required.");
        
        try {
            setAdding(true);
            console.log("Adding new category:", { trimmedName, parentId });

            let finalImageUrl = addImage.trim() || null;
            if (addFile) {
                const toastId = toast.loading("Uploading image...");
                finalImageUrl = await uploadFile(addFile);
                toast.dismiss(toastId);
            }

            const slug = trimmedName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const payload = { 
                name: trimmedName, 
                slug, 
                image: finalImageUrl, 
                parentId: parseInt(parentId) 
            };

            console.log("Payload to backend:", payload);
            
            const res = await axios.post(
                `${backendUrl}/categories`,
                payload,
                { headers: getHeaders() }
            );
            
            toast.success(`"${trimmedName}" added!`);
            setSubcategories(prev => [...prev, res.data.category]);
            
            // Success cleanup
            setAddName("");
            setAddImage("");
            setAddFile(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Add category error details:", error?.response?.data || error.message);
            const msg = error?.response?.data?.message || "Failed to add. Please check if name already exists.";
            toast.error(msg);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <Loader />;

    // Level detection: 0=Root(Super), 1=Middle(Category), 2=Leaf(Subcategory)
    const level = !parentCategory?.parentId ? 0 : (!parentCategory?.parent?.parentId ? 1 : 2);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/categories")}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors bg-white shadow-sm"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                            {level === 0 ? "Root SuperCategory" : (level === 1 ? "Middle Category" : "Leaf Subcategory")}
                        </p>
                        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                            <FaLayerGroup className="text-purple-500" />
                            {parentCategory?.name}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {level < 2 && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black hover:shadow-xl hover:scale-105 transition-all active:scale-95 text-sm"
                        >
                            <FaPlus /> Add {level === 0 ? "Category" : "Subcategory"}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {level < 2 ? (
                    /* Render Folder View (Levels 0 and 1) */
                    <>
                        <div className="p-6 border-b border-slate-50 bg-slate-50/40">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaLayerGroup className="w-5 h-5 text-indigo-600" />
                                {level === 0 ? "Direct Categories" : "Leaf Subcategories"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {level === 0 ? "These act as grouping containers for your store." : "These are the final groups where products will be added."}
                            </p>
                        </div>

                        {subcategories.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="inline-block p-6 bg-indigo-50 rounded-[2rem] mb-6 shadow-sm border border-indigo-100">
                                    <FaLayerGroup className="w-12 h-12 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Empty Organization Folder</h3>
                                <p className="text-sm text-slate-400 max-w-[320px] mx-auto leading-relaxed">
                                    "{parentCategory?.name}" acts as a **Middle Category**. 
                                    Products must be assigned into its **Sub-Groups** (Level 2).
                                </p>
                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                                    >
                                        + Create First Subcategory
                                    </button>
                                    <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                                        THEN you can add products to it
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {subcategories.map(sub => (
                                    <div key={sub.id} className="p-5 hover:bg-slate-50/80 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-5">
                                            {/* Only show images for Categories (Level 1), not Subcategories (Level 2) */}
                                            {level === 0 && (
                                                sub.image ? (
                                                    <img src={sub.image} className="w-14 h-14 object-cover rounded-xl border shadow-sm group-hover:scale-110 transition-transform" alt={sub.name} />
                                                ) : (
                                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                                                        <FaImage className="text-slate-300" />
                                                    </div>
                                                )
                                            )}
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{sub.name}</h3>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.slug}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/admin/categories/${sub.id}/subcategories`)}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[13px] font-black rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
                                            >
                                                Manage {level === 0 ? "Subcategories" : "Products"}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sub.id, sub.name)}
                                                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* Render Product Management View (Level 2) */
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/40">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                                <Package className="w-6 h-6 text-indigo-600" />
                                Product Inventory Management
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Manage items assigned to this subcategory.</p>
                        </div>
                        <div className="p-4">
                            <SubCategoryProductManager 
                                sub={parentCategory} 
                                parentName={parentCategoryName}
                                rootName={rootCategoryName} 
                                token={token} 
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Creation Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in slide-in-from-bottom-10 duration-300 border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">New {level === 0 ? "Category" : "Subcategory"}</h3>
                                <p className="text-sm text-slate-400 mt-1">Fill in the details to expand your store hierarchy.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Display Name</label>
                                <input
                                    type="text"
                                    value={addName}
                                    onChange={e => setAddName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                    placeholder={level === 0 ? "e.g. Skin Care" : "e.g. Cleansers"}
                                    autoFocus
                                />
                            </div>
                            
                            {/* Image input: only for SuperCategories adding Categories (Level 1) */}
                            {level === 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Visual Identity (Optional)</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={addImage}
                                            onChange={e => setAddImage(e.target.value)}
                                            className="flex-1 px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all"
                                            placeholder="Cloudinary/Image URL"
                                        />
                                        <label className="p-4 bg-slate-100 rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center aspect-square">
                                            <FaImage className="text-slate-500 w-5 h-5" />
                                            <input type="file" className="hidden" onChange={e => setAddFile(e.target.files[0])} />
                                        </label>
                                    </div>
                                    {addFile && (
                                        <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            <p className="text-[11px] text-indigo-700 font-black truncate">FILE SELECTED: {addFile.name}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 disabled:grayscale"
                                >
                                    {adding ? "Deploying..." : "Enact Change"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
