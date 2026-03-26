import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
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
function SubCategoryProductManager({ sub, rootName, token }) {
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
                // Save both root category and final subcategory
                { subCategory: sub.name, category: rootName },
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
                <div className="px-6 pb-5 pt-2 space-y-4">
                    {/* Add product search */}
                    <div>
                        {!searchOpen ? (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="flex items-center gap-2 text-sm text-purple-600 font-semibold hover:underline"
                            >
                                <FaPlus className="text-xs" /> Add Product to "{sub.name}"
                            </button>
                        ) : (
                            <div className="relative max-w-md">
                                <div className="flex items-center gap-2 border border-purple-300 rounded-xl px-3 py-2 bg-white shadow-sm">
                                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search products by name..."
                                        className="flex-1 text-sm outline-none"
                                    />
                                    <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                                {searchResults.length > 0 && (
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                                        {searchResults.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleAssignProduct(product)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 border-b border-slate-100 text-left transition-colors"
                                            >
                                                <img src={resolveImage(product)} className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0" alt={product.name} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                                                    <p className="text-xs text-slate-400">LKR {Number(product.price).toLocaleString()}</p>
                                                </div>
                                                <span className="text-xs text-purple-600 font-semibold shrink-0">Add</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
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

    // NO LONGER SHOWING ADD FORM AS PER USER REQUEST 
    // subcategories don't need to create more categories inside them

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchData();
    }, [parentId]);

    const getHeaders = () => token ? { Authorization: `Bearer ${token}` } : {};

    const [rootCategoryName, setRootCategoryName] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${backendUrl}/categories/${parentId}`,
                { headers: getHeaders() }
            );
            const cat = res.data.category;
            setParentCategory(cat);
            setSubcategories(cat.children || []);

            // Find Root Category Name for product assignment
            if (!cat.parentId) {
                setRootCategoryName(cat.name);
            } else {
                // If this is already a subcategory, we need to find its parent's parent... 
                // but usually subCategory field in products table refers to the child 
                // and category refers to the top-level. 
                // Let's fetch the ancestors if needed, or just assume the top-level is what we want.
                try {
                    const rootRes = await axios.get(`${backendUrl}/categories/slug/${cat.slug}`, { headers: getHeaders() });
                    // This might not give root. Let's just use the current parent for now 
                    // unless we want to be recursive.
                    setRootCategoryName(cat.name); 
                } catch {
                    setRootCategoryName(cat.name);
                }
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("Failed to load category data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete subcategory "${name}"? This will also remove its children.`)) return;
        try {
            await axios.delete(`${backendUrl}/categories/${id}`, { headers: getHeaders() });
            toast.success(`"${name}" deleted`);
            setSubcategories(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subcategory.");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addName.trim()) return toast.error("Name is required.");
        try {
            setAdding(true);

            let finalImageUrl = addImage.trim() || null;
            if (addFile) {
                const toastId = toast.loading("Uploading image...");
                finalImageUrl = await uploadFile(addFile);
                toast.dismiss(toastId);
            }

            const slug = addName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const res = await axios.post(
                `${backendUrl}/categories`,
                { name: addName.trim(), slug, image: finalImageUrl, parentId: parseInt(parentId) },
                { headers: getHeaders() }
            );
            toast.success(`"${addName}" added!`);
            setSubcategories(prev => [...prev, res.data.category]);
            setAddName("");
            setAddImage("");
            setAddFile(null);
            setShowAddForm(false);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to add subcategory.");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/categories")}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Categories</p>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <FaLayerGroup className="text-purple-500" />
                        {parentCategory?.name} — Subcategories
                    </h1>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-600" />
                            Products in "{parentCategory?.name}"
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 caps">Manage products directly assigned to this category level</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Add button removed per user request */}
                    </div>
                </div>

                {/* Main Category Product Manager */}
                {parentCategory && (
                    <div className="border-b border-slate-200">
                        <SubCategoryProductManager sub={parentCategory} rootName={rootCategoryName} token={token} />
                    </div>
                )}

                {/* Product Manager Panel for the current category already shown above */}
                <div className="p-8 text-center text-slate-400 text-sm italic">
                    All subcategory products managed above.
                </div>
            </div>
        </div>
    );
}
