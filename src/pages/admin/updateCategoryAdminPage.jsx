import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";
import { FaImage, FaChevronLeft } from "react-icons/fa";

export default function UpdateCategoryAdminPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Attempt to get the category from location state (passed from the list view)
    const categoryData = location.state?.category;

    // State for the category being edited
    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");
    const [parentId, setParentId] = useState("");
    const [existingImage, setExistingImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = location.state?.categoryId;
        if (!id) {
            toast.error("No category selected for updating");
            navigate("/admin/categories");
            return;
        }
        setCategoryId(id);
        fetchCategoryDetails(id);
        fetchParentOptions(id);
    }, [location.state, navigate]);

    const fetchCategoryDetails = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/categories/${id}`, {
                headers: { Authorization: "Bearer " + token }
            });
            const cat = res.data.category;
            setName(cat.name || "");
            setParentId(cat.parentId || "");
            if (cat.image) {
                setExistingImage(cat.image);
                setImagePreview(cat.image);
            }
        } catch (error) {
            console.error("Error fetching category details:", error);
            toast.error("Failed to load category details");
        }
    };

    const fetchParentOptions = async (currentId) => {
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/categories");
            // Filter out self and potentially children (simplified: just self for now)
            const filtered = (res.data.categories || []).filter(c => c.id !== currentId);
            setAllCategories(filtered);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error("Main Category name is required");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            // Handle main image update
            let finalMainImageUrl = existingImage;
            if (newImage) {
                const toastId = toast.loading("Uploading new main image...");
                finalMainImageUrl = await uploadFile(newImage);
                toast.dismiss(toastId);
            }

            const payload = {
                name,
                image: finalMainImageUrl,
                parentId: parentId || null
            };

            const toastId = toast.loading("Updating category...");
            await axios.put(import.meta.env.VITE_BACKEND_URL + `/categories/${categoryId}`, payload, {
                headers: { Authorization: "Bearer " + token }
            });
            toast.dismiss(toastId);

            toast.success("Category Updated Successfully");
            navigate("/admin/categories");

        } catch (error) {
            console.error("Error Updating Category:", error);
            const msg = error.response?.data?.message || "Failed to update category";
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
                        <h2 className="text-2xl font-bold text-slate-800">Update Category</h2>
                        <p className="text-slate-500 text-sm mt-1">Modify details for this category</p>
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
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Updating...
                                </>
                            ) : "Update Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
