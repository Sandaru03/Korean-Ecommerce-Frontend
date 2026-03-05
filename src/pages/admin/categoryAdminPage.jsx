import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";

export default function CategoryAdminPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            setLoading(true);
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categories", {
                headers: { Authorization: "Bearer " + token }
            });
            setCategories(res.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/categories/${id}`, {
                headers: { Authorization: "Bearer " + token }
            });
            toast.success("Category deleted");
            setCategories(categories.filter(c => c.id !== id));
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
                            <th className="p-4">Subcategories</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
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
                                    <td className="p-4 font-medium text-slate-800">{category.name}</td>
                                    <td className="p-4">
                                        {category.subcategories && category.subcategories.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {category.subcategories.map((sub, idx) => (
                                                    <span key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-600">
                                                        {sub.image && (
                                                            <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover" />
                                                        )}
                                                        {sub.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">None</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/update-category`}
                                                state={{ category }}
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
