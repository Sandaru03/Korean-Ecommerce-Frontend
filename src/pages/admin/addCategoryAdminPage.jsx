import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from "../../utils/mediaUpload";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";

export default function AddCategoryAdminPage() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddSubcategory = () => {
        setSubcategories([...subcategories, { name: "", image: null, preview: "" }]);
    };

    const handleSubNameChange = (index, value) => {
        const newSubs = [...subcategories];
        newSubs[index].name = value;
        setSubcategories(newSubs);
    };

    const handleSubImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newSubs = [...subcategories];
            newSubs[index].image = file;
            newSubs[index].preview = URL.createObjectURL(file);
            setSubcategories(newSubs);
        }
    };

    const handleRemoveSubcategory = (index) => {
        const newSubs = subcategories.filter((_, i) => i !== index);
        setSubcategories(newSubs);
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

            // Upload main category image
            let mainImageUrl = "";
            if (image) {
                const toastId = toast.loading("Uploading main image...");
                mainImageUrl = await uploadFile(image);
                toast.dismiss(toastId);
            }

            // Upload subcategory images sequentially
            const processedSubcategories = [];
            for (let i = 0; i < subcategories.length; i++) {
                const sub = subcategories[i];
                if (!sub.name.trim()) continue; // Skip empty names

                let subImageUrl = "";
                if (sub.image) {
                    const toastId = toast.loading(`Uploading image for ${sub.name}...`);
                    subImageUrl = await uploadFile(sub.image);
                    toast.dismiss(toastId);
                }

                processedSubcategories.push({
                    name: sub.name,
                    image: subImageUrl
                });
            }

            const categoryData = {
                name,
                image: mainImageUrl,
                subcategories: processedSubcategories
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
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Main Category</h3>

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

                    {/* Subcategories Section */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-lg font-semibold text-slate-800">Subcategories</h3>
                            <button
                                type="button"
                                onClick={handleAddSubcategory}
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                                <FaPlus /> Add Subcategory
                            </button>
                        </div>

                        <div className="space-y-3">
                            {subcategories.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No subcategories added yet. Click the button above to add one.
                                </p>
                            ) : (
                                subcategories.map((sub, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                value={sub.name}
                                                onChange={(e) => handleSubNameChange(idx, e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Subcategory Name (e.g. Toners)"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1 w-full flex items-center gap-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`sub-img-${idx}`}
                                                className="sr-only"
                                                onChange={(e) => handleSubImageChange(idx, e)}
                                            />
                                            <label
                                                htmlFor={`sub-img-${idx}`}
                                                className="flex-1 flex items-center justify-center gap-2 h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                                            >
                                                <FaImage className="text-slate-400" />
                                                {sub.image ? "Change Image" : "Upload Image"}
                                            </label>

                                            {sub.preview && (
                                                <div className="w-10 h-10 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-white">
                                                    <img src={sub.preview} className="w-full h-full object-cover" alt="Preview" />
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubcategory(idx)}
                                            className="w-full md:w-auto mt-2 md:mt-0 px-3 h-10 flex flex-row md:flex-col items-center justify-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent md:border-0 hover:border-red-100"
                                            title="Remove Subcategory"
                                        >
                                            <FaTrash />
                                            <span className="md:hidden text-sm font-medium">Remove</span>
                                        </button>
                                    </div>
                                ))
                            )}
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
