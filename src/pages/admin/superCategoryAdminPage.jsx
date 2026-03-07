import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTh } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Loader from "../../components/admin-utils/loader";

export default function SuperCategoryAdminPage() {
    const [superCategories, setSuperCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Add form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [addName, setAddName] = useState("");
    const [addImage, setAddImage] = useState("");
    const [adding, setAdding] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState("");
    const [saving, setSaving] = useState(false);

    const getHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchSuperCategories();
    }, []);

    const fetchSuperCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/categories`,
                { headers: getHeaders() }
            );
            // Show only root categories (parentId === null)
            const all = res.data.categories || [];
            setSuperCategories(all.filter(c => c.parentId === null));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load super categories.");
        } finally {
            setLoading(false);
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
                { name: addName.trim(), slug, image: addImage.trim() || null, parentId: null },
                { headers: getHeaders() }
            );
            toast.success(`"${addName}" created!`);
            setSuperCategories(prev => [...prev, res.data.category]);
            setAddName("");
            setAddImage("");
            setShowAddForm(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add super category.");
        } finally {
            setAdding(false);
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditImage(cat.image || "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditImage("");
    };

    const handleSaveEdit = async (id) => {
        if (!editName.trim()) return toast.error("Name is required.");
        try {
            setSaving(true);
            const slug = editName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${id}`,
                { name: editName.trim(), slug, image: editImage.trim() || null },
                { headers: getHeaders() }
            );
            toast.success("Super category updated!");
            setSuperCategories(prev =>
                prev.map(c => c.id === id ? { ...c, name: editName.trim(), slug, image: editImage.trim() || null } : c)
            );
            cancelEdit();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete super category "${name}"?\n\nThis will also delete ALL its categories and subcategories!`)) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, { headers: getHeaders() });
            toast.success(`"${name}" deleted`);
            setSuperCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error("Failed to delete super category.");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Admin</p>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <FaTh className="text-pink-500" />
                        Super Categories
                    </h1>
                </div>
            </div>

            {/* Hierarchy info */}
            <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3">
                <MdCategory className="text-pink-400 text-lg shrink-0" />
                <span>
                    <strong className="text-slate-700">Hierarchy:</strong>{" "}
                    <span className="text-pink-600 font-semibold">Super Category</span>
                    {" → "}
                    <span className="text-purple-600 font-semibold">Category</span>
                    {" → "}
                    <span className="text-blue-600 font-semibold">Sub Category</span>
                </span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {superCategories.length} super categor{superCategories.length === 1 ? "y" : "ies"}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Shown as icon grid on the homepage
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(v => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <FaPlus /> {showAddForm ? "Cancel" : "Add Super Category"}
                    </button>
                </div>

                {/* Add form */}
                {showAddForm && (
                    <form onSubmit={handleAdd} className="p-6 bg-pink-50 border-b border-slate-200">
                        <h3 className="text-sm font-semibold text-pink-800 mb-4 uppercase tracking-wider">
                            New Super Category
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={addName}
                                    onChange={e => setAddName(e.target.value)}
                                    placeholder="e.g. Beauty"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Image URL <span className="text-slate-400">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={addImage}
                                    onChange={e => setAddImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                />
                            </div>
                        </div>
                        {addImage && (
                            <div className="mt-3">
                                <img src={addImage} alt="preview" className="w-16 h-16 rounded-full object-cover border border-slate-200" onError={e => e.target.style.display = "none"} />
                            </div>
                        )}
                        <div className="mt-4 flex gap-3">
                            <button
                                type="submit"
                                disabled={adding}
                                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {adding ? "Adding..." : "Add Super Category"}
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
                {superCategories.length === 0 && !showAddForm && (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                            <FaTh className="text-3xl text-pink-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">No super categories yet</h3>
                        <p className="text-sm text-slate-400 max-w-sm mb-6">
                            Create your first super category to start organizing your products.
                        </p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            <FaPlus /> Create First Super Category
                        </button>
                    </div>
                )}

                {/* List */}
                {superCategories.length > 0 && (
                    <div className="divide-y divide-slate-100">
                        {superCategories.map(cat => (
                            <div key={cat.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                {editingId === cat.id ? (
                                    // ── Inline edit row ──
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                            <input
                                                type="text"
                                                value={editImage}
                                                onChange={e => setEditImage(e.target.value)}
                                                placeholder="Image URL"
                                                className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSaveEdit(cat.id)}
                                                disabled={saving}
                                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // ── Normal row ──
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-[56px] h-[56px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200 shrink-0">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaTh className="text-slate-300 text-xl" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">{cat.name}</p>
                                            <p className="text-xs text-slate-400">/{cat.slug}</p>
                                        </div>

                                        {/* Level badge */}
                                        <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 bg-pink-50 text-pink-600 rounded-full border border-pink-100 font-semibold">
                                            Super Category
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => navigate(`/admin/super-categories/${cat.id}/categories`)}
                                                className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-100"
                                                title="Manage categories"
                                            >
                                                Manage Categories
                                            </button>
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
