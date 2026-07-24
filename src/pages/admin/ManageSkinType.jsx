import { useState, useEffect } from "react";
import axios from "axios";
import { Save, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageSkinType() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({ 
        image: "", 
        quizPageImage: "",
        link: "/quiz", 
        isActive: true 
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/quiz-banner`);
            if (data.success && data.banner) {
                setFormData({
                    image: data.banner.image || "",
                    quizPageImage: data.banner.quizPageImage || "",
                    link: data.banner.link || "/quiz",
                    isActive: data.banner.isActive ?? true
                });
            }
        } catch (err) {
            console.error("Error fetching skin type banner:", err);
            toast.error("Failed to load current configuration");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await mediaUpload(file);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleQuizPageImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await mediaUpload(file);
            setFormData(prev => ({ ...prev, quizPageImage: url }));
            toast.success("Quiz page image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.image) return toast.error("An image is required!");

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.put(`${backendUrl}/quiz-banner`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success("Skin type banner updated successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl p-6 bg-gray-50">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage Skin Type (Quiz Banner)</h1>
                <p className="text-sm text-slate-500">Update the image used for the 'Do you know your skin type?' banner on the homepage.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Banner Image *</label>
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <input 
                            value={formData.image} 
                            onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} 
                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" 
                            placeholder="Image URL or upload..." 
                        />
                        <div className="relative shrink-0">
                            <input 
                                type="file" 
                                onChange={handleImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*" 
                            />
                            <button 
                                type="button" 
                                disabled={uploading} 
                                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} 
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>
                    </div>
                    <div className="inline-block bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 shadow-sm">
                        ⚠️ Recommended Resolution: 1040 x 420 px
                    </div>

                    {/* Image Preview */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 min-h-[200px] flex items-center justify-center">
                        {formData.image ? (
                            <img src={formData.image} alt="Skin Type Banner Preview" className="w-full max-w-[1040px] h-auto object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-sm font-medium">No image selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6 mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quiz Page Hero Image *</label>
                    <p className="text-sm text-slate-500 mb-4">This image appears inside the actual Skin Type Quiz page.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-2">
                        <input 
                            value={formData.quizPageImage} 
                            onChange={e => setFormData(p => ({ ...p, quizPageImage: e.target.value }))} 
                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" 
                            placeholder="Image URL or upload..." 
                        />
                        <div className="relative shrink-0">
                            <input 
                                type="file" 
                                onChange={handleQuizPageImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*" 
                            />
                            <button 
                                type="button" 
                                disabled={uploading} 
                                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} 
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>
                    </div>
                    <div className="inline-block bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4 shadow-sm">
                        ⚠️ Recommended Resolution: 800 x 800 px (Square)
                    </div>

                    {/* Image Preview */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 min-h-[200px] flex items-center justify-center p-6">
                        {formData.quizPageImage ? (
                            <img src={formData.quizPageImage} alt="Quiz Page Preview" className="w-full max-w-[320px] h-auto object-cover rounded-[24px] shadow-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-sm font-medium">No image selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-end border-t border-slate-100 pt-6 mt-6">
                    <button 
                        onClick={handleSave} 
                        disabled={saving || uploading} 
                        className="px-8 py-3 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving Changes..." : "Save Configuration"}
                    </button>
                </div>
            </div>
        </div>
    );
}
