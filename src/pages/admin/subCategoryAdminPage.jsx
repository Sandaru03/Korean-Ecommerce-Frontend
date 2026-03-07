import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";

export default function SubCategoryAdminPage() {
    const { parentId } = useParams();
    const navigate = useNavigate();

    const [parentCategory, setParentCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [addName, setAddName] = useState("");
    const [addImage, setAddImage] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchData();
    }, [parentId]);

    // Only attach Authorization header if a real token exists
    const getHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${parentId}`,
                { headers: getHeaders() }
            );
            const cat = res.data.category;
            setParentCategory(cat);
            setSubcategories(cat.children || []);
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
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, {
                headers: getHeaders()
            });
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
            const slug = addName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/categories`,
                { name: addName.trim(), slug, image: addImage.trim() || null, parentId: parseInt(parentId) },
                { headers: getHeaders() }
            );
            toast.success(`"${addName}" added!`);
            setSubcategories(prev => [...prev, res.data.category]);
            setAddName("");
            setAddImage("");
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
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {subcategories.length} subcategor{subcategories.length === 1 ? "y" : "ies"} found
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">Manage direct children of <span className="font-medium text-slate-600">{parentCategory?.name}</span></p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(v => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <FaPlus /> {showAddForm ? "Cancel" : "Add Subcategory"}
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <form onSubmit={handleAdd} className="p-6 bg-purple-50 border-b border-slate-200">
                        <h3 className="text-sm font-semibold text-purple-800 mb-4 uppercase tracking-wider">New Subcategory under "{parentCategory?.name}"</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={addName}
                                    onChange={e => setAddName(e.target.value)}
                                    placeholder="e.g. Anua"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL <span className="text-slate-400">(optional)</span></label>
                                <input
                                    type="text"
                                    value={addImage}
                                    onChange={e => setAddImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                type="submit"
                                disabled={adding}
                                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {adding ? "Adding..." : "Add Subcategory"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Empty state */}
                {subcategories.length === 0 && !showAddForm && (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                            <FaLayerGroup className="text-3xl text-purple-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No subcategories yet</h3>
                        <p className="text-sm text-slate-400 max-w-sm mb-6">
                            "{parentCategory?.name}" doesn't have any subcategories. Add one to help customers browse more specifically.
                        </p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            <FaPlus /> Create First Subcategory
                        </button>
                    </div>
                )}

                {/* Subcategory list */}
                {subcategories.length > 0 && (
                    <div className="divide-y divide-slate-100">
                        {subcategories.map(sub => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                            >
                                {/* Thumbnail */}
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                    {sub.image ? (
                                        <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <FaLayerGroup className="text-slate-300 text-xl" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{sub.name}</p>
                                    <p className="text-xs text-slate-400">/{sub.slug}</p>
                                </div>

                                {/* Children info */}
                                {sub.children && sub.children.length > 0 ? (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
                                        <FaLayerGroup className="text-xs" />
                                        {sub.children.length} children
                                    </span>
                                ) : (
                                    <span className="hidden sm:inline text-xs text-slate-300">No children</span>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Manage its sub-children */}
                                    <button
                                        onClick={() => navigate(`/admin/categories/${sub.id}/subcategories`)}
                                        className="px-2 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-100"
                                        title="Manage sub-subcategories"
                                    >
                                        Manage
                                    </button>
                                    <Link
                                        to="/admin/update-category"
                                        state={{ categoryId: sub.id }}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(sub.id, sub.name)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
