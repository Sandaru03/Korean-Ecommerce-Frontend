import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaVideo, FaBoxOpen, FaSearch, FaTimes, FaEdit, FaSave } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";

export default function ManageReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // Form fields
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Editing fields
    const [editingReel, setEditingReel] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editSelectedProduct, setEditSelectedProduct] = useState(null);
    const [editSearchQuery, setEditSearchQuery] = useState("");
    const [editSearchResults, setEditSearchResults] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const fetchReels = async () => {
        try {
            const res = await axios.get(`${backendUrl}/reels`);
            if (res.data.success) {
                setReels(res.data.reels);
            }
        } catch (error) {
            toast.error("Failed to load reels");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReels();
    }, [backendUrl]);

    // Product search debounce for Upload
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 1) {
                try {
                    const { data } = await axios.get(`${backendUrl}/products/search/query?q=${searchQuery}`);
                    if (data.success) setSearchResults(data.products);
                } catch (err) { console.error(err); }
            } else {
                setSearchResults([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Product search debounce for Edit
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (editSearchQuery.length > 1) {
                try {
                    const { data } = await axios.get(`${backendUrl}/products/search/query?q=${editSearchQuery}`);
                    if (data.success) setEditSearchResults(data.products);
                } catch (err) { console.error(err); }
            } else {
                setEditSearchResults([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [editSearchQuery]);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
        } else {
            setVideoFile(null);
            toast.error("Please select a valid video file.");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!videoFile) return toast.error("Please select a video file!");

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        if (selectedProduct) formData.append("productId", selectedProduct.id);

        setUploading(true);
        try {
            const res = await axios.post(`${backendUrl}/reels`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                toast.success("Reel uploaded successfully!");
                setTitle("");
                setVideoFile(null);
                setSelectedProduct(null);
                setSearchQuery("");
                fetchReels();
                if (document.getElementById('videoFile')) document.getElementById('videoFile').value = '';
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload reel.");
        } finally {
            setUploading(false);
        }
    };

    const startEditing = (reel) => {
        setEditingReel(reel);
        setEditTitle(reel.title);
        setEditSelectedProduct(reel.product || null);
        setEditSearchQuery("");
        setEditSearchResults([]);
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`${backendUrl}/reels/${editingReel.id}`, {
                title: editTitle,
                productId: editSelectedProduct ? editSelectedProduct.id : null
            });
            if (res.data.success) {
                toast.success("Reel updated!");
                setEditingReel(null);
                fetchReels();
            }
        } catch (error) {
            toast.error("Failed to update reel");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const res = await axios.put(`${backendUrl}/reels/${id}/toggle-status`);
            if (res.data.success) {
                toast.success(currentStatus ? "Reel hidden" : "Reel activated");
                fetchReels();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const deleteReel = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;
        try {
            const res = await axios.delete(`${backendUrl}/reels/${id}`);
            if (res.data.success) {
                toast.success("Reel deleted");
                fetchReels();
            }
        } catch (error) {
            toast.error("Failed to delete reel");
        }
    };

    const resolveImage = (p) => {
        if (!p) return "/default-product.jpg";
        let imgs = p.images;
        if (typeof imgs === "string") { try { imgs = JSON.parse(imgs); } catch { imgs = [imgs]; } }
        if (Array.isArray(imgs) && imgs.length > 0 && imgs[0]) return imgs[0];
        return "/default-product.jpg";
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaVideo className="text-blue-500" /> Manage Reels
            </h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
                    <FaPlus className="text-blue-600 text-sm" /> Add New Reel
                </h2>
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Video File (Vertical) <span className="text-red-500">*</span></label>
                            <input
                                id="videoFile"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Name / Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Cleansing Oil Demo"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Assignment */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Assign Product (Optional)</label>
                        {selectedProduct ? (
                            <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <img src={resolveImage(selectedProduct)} className="w-12 h-12 object-cover rounded-lg" alt="" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{selectedProduct.name}</p>
                                    <p className="text-xs text-gray-500">Rs.{selectedProduct.price.toLocaleString()}</p>
                                </div>
                                <button type="button" onClick={() => setSelectedProduct(null)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                                    <FaSearch className="text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products by name..."
                                        className="flex-1 text-sm bg-transparent outline-none"
                                    />
                                </div>
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => { setSelectedProduct(p); setSearchResults([]); setSearchQuery(""); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left"
                                            >
                                                <img src={resolveImage(p)} className="w-10 h-10 object-cover rounded" alt="" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                                    <p className="text-xs text-gray-500">Rs.{p.price.toLocaleString()}</p>
                                                </div>
                                                <FaPlus className="text-blue-500 text-xs" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !videoFile || !title}
                        className={`flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-md ${
                            uploading || !videoFile || !title ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                        }`}
                    >
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Uploading to Cloudinary...
                            </>
                        ) : (
                            <>
                                <FaPlus /> Upload Reel
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {reels.map((reel) => (
                    <div key={reel.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                        <div className="relative aspect-[9/16] bg-black">
                            <video src={reel.videoUrl} className="w-full h-full object-cover" preload="metadata" />
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-full shadow-sm text-white text-center ${reel.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                                    {reel.isActive ? "ACTIVE" : "HIDDEN"}
                                </span>
                                {reel.product && (
                                    <span className="px-2 py-1 text-[10px] bg-blue-600 text-white font-bold rounded-full shadow-sm flex items-center gap-1">
                                        <FaBoxOpen size={10} /> Product Linked
                                    </span>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => startEditing(reel)}
                                    className="p-2.5 bg-blue-600 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
                                    title="Edit Details"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => toggleStatus(reel.id, reel.isActive)}
                                    className={`p-2.5 rounded-full shadow-xl hover:scale-110 transition-transform ${reel.isActive ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}
                                    title={reel.isActive ? "Hide" : "Activate"}
                                >
                                    {reel.isActive ? "Hide" : "Show"}
                                </button>
                                <button
                                    onClick={() => deleteReel(reel.id)}
                                    className="p-2.5 bg-red-600 rounded-full text-white shadow-xl hover:scale-110 transition-transform"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 truncate text-sm">{reel.title}</h3>
                                {reel.product && (
                                    <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <img src={resolveImage(reel.product)} className="w-8 h-8 object-cover rounded shadow-sm" alt="" />
                                        <p className="text-[11px] text-gray-600 font-medium truncate">{reel.product.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingReel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Edit Reel Details</h2>
                            <button onClick={() => setEditingReel(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Reel Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Linked Product</label>
                                {editSelectedProduct ? (
                                    <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                        <img src={resolveImage(editSelectedProduct)} className="w-12 h-12 object-cover rounded-lg" alt="" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{editSelectedProduct.name}</p>
                                            <p className="text-xs text-gray-500">Rs.{editSelectedProduct.price.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => setEditSelectedProduct(null)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                                            <FaSearch className="text-gray-400" />
                                            <input
                                                type="text"
                                                value={editSearchQuery}
                                                onChange={(e) => setEditSearchQuery(e.target.value)}
                                                placeholder="Search products..."
                                                className="flex-1 text-sm bg-transparent outline-none"
                                            />
                                        </div>
                                        {editSearchResults.length > 0 && (
                                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                                {editSearchResults.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => { setEditSelectedProduct(p); setEditSearchResults([]); setEditSearchQuery(""); }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left"
                                                    >
                                                        <img src={resolveImage(p)} className="w-8 h-8 object-cover rounded" alt="" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                                                        </div>
                                                        <FaPlus className="text-blue-500 text-xs" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setEditingReel(null)} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reels.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    <FaBoxOpen className="mx-auto text-4xl mb-4 opacity-20" />
                    <p className="font-medium">No reels found. Upload your first short video above.</p>
                </div>
            )}
        </div>
    );
}
