import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageAdBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({ image: "", link: "", isActive: true, order: 0 });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/ad-banners`);
            if (data.success) setBanners(data.banners);
        } catch (err) {
            console.error("Error fetching ad banners:", err);
            toast.error("Failed to load ad banners");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({ image: banner.image, link: banner.link || "", isActive: banner.isActive, order: banner.order });
        } else {
            setEditingBanner(null);
            setFormData({ image: "", link: "", isActive: true, order: banners.length });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBanner(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await mediaUpload(file);
            setFormData(prev => ({ ...prev, image: url }));
            toast.success("Image uploaded!");
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
            if (editingBanner) {
                const { data } = await axios.put(`${backendUrl}/ad-banners/${editingBanner.id}`, formData);
                if (data.success) {
                    toast.success("Ad Banner updated");
                    fetchBanners();
                    handleCloseModal();
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/ad-banners`, formData);
                if (data.success) {
                    toast.success("Ad Banner created");
                    fetchBanners();
                    handleCloseModal();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save banner");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this Ad Banner?")) return;
        try {
            await axios.delete(`${backendUrl}/ad-banners/${id}`);
            toast.success("Banner deleted");
            fetchBanners();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete banner");
        }
    };

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Ad Banners Slider</h1>
                    <p className="text-sm text-slate-500">Manage the advertisement images shown on the homepage slider.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> Add New Ad Banner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-slate-600 text-sm">Image</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Target Link</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Order</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <img src={banner.image} alt="Banner" className="h-16 w-32 object-cover rounded shadow-sm border border-slate-200" />
                                    </td>
                                    <td className="p-4 text-sm text-blue-600 hover:underline">
                                        {banner.link ? <a href={banner.link} target="_blank" rel="noreferrer">{banner.link}</a> : <span className="text-slate-400 no-underline italic">No Link</span>}
                                    </td>
                                    <td className="p-4 text-sm text-slate-700 font-medium">{banner.order}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors mr-2"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No ad banners found. Click "Add New" to create one.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">{editingBanner ? "Edit Ad Banner" : "New Ad Banner"}</h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Banner Image *</label>
                                <div className="flex gap-3">
                                    <input value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                                    <div className="relative">
                                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                        <button type="button" disabled={uploading} className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200 flex items-center gap-2 disabled:opacity-50">
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} Upload
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[11px] text-blue-600 mt-1 font-medium bg-blue-50 px-2 py-1 rounded inline-block">
                                    Recommended: 1920 x 320 px (6:1 ratio)
                                </p>
                                {formData.image && <img src={formData.image} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-lg border border-slate-200 shadow-sm" />}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Link (Optional)</label>
                                <input value={formData.link} onChange={e => setFormData(p => ({ ...p, link: e.target.value }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. /product/123 or https://..." />
                                <p className="text-xs text-slate-500 mt-1">Where the user goes when they click the banner.</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                                    <input type="number" value={formData.order} onChange={e => setFormData(p => ({ ...p, order: Number(e.target.value) }))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="pt-6">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-2 ring-transparent peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-semibold text-gray-900">{formData.isActive ? "Active" : "Hidden"}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={handleCloseModal} className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 min-w-[100px]">
                                {saving ? "Saving..." : "Save Banner"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
