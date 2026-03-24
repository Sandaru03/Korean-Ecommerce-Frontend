import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaVideo, FaBoxOpen } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";

export default function ManageReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // Form fields
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);

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

        setUploading(true);
        try {
            const res = await axios.post(`${backendUrl}/reels`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                toast.success("Reel uploaded successfully!");
                setTitle("");
                setVideoFile(null);
                fetchReels();
                // Reset file input
                document.getElementById('videoFile').value = '';
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload reel.");
        } finally {
            setUploading(false);
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
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-full shadow-sm text-white ${reel.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                                    {reel.isActive ? "ACTIVE" : "HIDDEN"}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
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
                        <div className="p-4 bg-white border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{reel.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
            {reels.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    <FaBoxOpen className="mx-auto text-4xl mb-4 opacity-20" />
                    <p className="font-medium">No reels found. Upload your first short video above.</p>
                </div>
            )}
        </div>
    );
}
