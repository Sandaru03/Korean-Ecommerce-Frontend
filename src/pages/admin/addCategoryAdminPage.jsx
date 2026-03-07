import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";
import { FaPlus, FaImage, FaChevronLeft } from "react-icons/fa";

export default function AddCategoryAdminPage() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [parentId, setParentId] = useState("");
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchParentOptions();
    }, []);

    const fetchParentOptions = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categories");
            setAllCategories(res.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error("Category name is required");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            // Upload main category image
            let mainImageUrl = "";
            if (image) {
                const toastId = toast.loading("Uploading image...");
                mainImageUrl = await uploadFile(image);
                toast.dismiss(toastId);
            }

            const categoryData = {
                name,
                image: mainImageUrl,
                parentId: parentId || null
            };

            const toastId = toast.loading("Saving category...");
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/categories", categoryData, {
                headers: { Authorization: "Bearer " + token }
            });
            toast.dismiss(toastId);

            toast.success("Category Added Successfully");
            navigate("/admin/categories");

        } catch (error) {
            console.error("Error Adding Category:", error);
            const msg = error.response?.data?.message || "Failed to add category";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center bg-gray-50 min-h-[calc(100vh-100px)] py-8 px-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Add New Category</h2>
                        <p className="text-slate-500 text-sm mt-1">Create a main category and its subcategories</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Main Category Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Category Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Category Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg h-11 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. Skin Care"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Parent Category</label>
                                <select
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg h-11 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">None (Top Level Category)</option>
                                    {allCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-slate-500 mt-1">Select if this is a subcategory of another one.</p>
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Category Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            className="w-full border border-slate-300 rounded-lg h-11 px-3 py-2 text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                                        />
                                    </div>
                                    {imagePreview && (
                                        <div className="w-11 h-11 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
                        <Link
                            to="/admin/categories"
                            className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : "Save Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
