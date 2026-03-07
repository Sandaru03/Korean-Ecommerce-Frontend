import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaLayerGroup } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";

export default function CategoryAdminPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Only attach Authorization header if a real token is stored
    const getHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Fetch as tree to handle hierarchy
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categories?tree=true", {
                headers: getHeaders()
            });
            
            // Flatten the tree for table display with depth indicator
            const flat = [];
            const flatten = (items, depth = 0) => {
                items.forEach(item => {
                    flat.push({ ...item, depth });
                    if (item.children && item.children.length > 0) {
                        flatten(item.children, depth + 1);
                    }
                });
            };
            flatten(res.data.categories || []);
            setCategories(flat);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete category "${name}"?\n\nThis will also delete all its children and subcategories.`)) return;

        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/categories/${id}`, {
                headers: getHeaders()
            });
            toast.success("Category deleted");
            // Refetch to accurately remove all descendants from the list
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete category");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Categories Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage main categories and their subcategories</p>
                </div>
                <Link
                    to="/admin/add-category"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <FaPlus /> Add Category
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-slate-500">
                                    No categories found. Click "Add Category" to create one.
                                </td>
                            </tr>
                        ) : (
                            categories.map(category => (
                                <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                            {category.image ? (
                                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-slate-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {[...Array(category.depth)].map((_, i) => (
                                                <div key={i} className="w-4 border-l border-slate-300 h-8 ml-2 -mt-4"></div>
                                            ))}
                                            <span className={`font-medium ${category.depth > 0 ? 'text-slate-600' : 'text-slate-800'}`}>
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Show 'Manage' for top-level categories only */}
                                            {category.depth === 0 && (
                                                <button
                                                    onClick={() => navigate(`/admin/categories/${category.id}/subcategories`)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                                                    title="Manage subcategories"
                                                >
                                                    <FaLayerGroup className="text-xs" /> Manage
                                                </button>
                                            )}
                                            <Link
                                                to={`/admin/update-category`}
                                                state={{ categoryId: category.id }}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
