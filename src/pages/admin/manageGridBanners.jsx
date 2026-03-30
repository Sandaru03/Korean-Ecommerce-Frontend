import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaImage, FaLink, FaSave } from "react-icons/fa";
import Loader from "../../components/admin-utils/loader";
import uploadFile from "../../utils/mediaUpload";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageGridBanners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/grid-banners`);
            if (data.success && data.banners) {
                // Ensure we have exactly 6 banners in state, mapping 1-6 positions
                const initializedBanners = Array.from({ length: 6 }, (_, i) => {
                    const existing = data.banners.find(b => b.position === i + 1);
                    return existing || { id: `temp-${i+1}`, position: i + 1, image: "", link: "#" };
                });
                setBanners(initializedBanners);
            }
        } catch (error) {
            console.error("Error fetching grid banners:", error);
            toast.error("Failed to load grid banners");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBanner = async (index, banner) => {
        try {
            setSaving(prev => ({ ...prev, [index]: true }));

            // Determine image url: from file or from text
            let finalImageUrl = banner.image;
            if (banner.file) {
                const toastId = toast.loading(`Uploading image for position ${banner.position}...`);
                finalImageUrl = await uploadFile(banner.file);
                toast.dismiss(toastId);
            }

            const token = localStorage.getItem("token");
            const { data } = await axios.put(
                `${backendUrl}/grid-banners/${banner.id}`,
                { image: finalImageUrl, link: banner.link },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(`Banner ${banner.position} saved!`);
                setBanners(prev => prev.map((b, i) => i === index ? { ...data.banner, file: null } : b));
            }
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error(`Failed to save banner ${banner.position}`);
        } finally {
            setSaving(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleBannerChange = (index, field, value) => {
        setBanners(prev => {
            const newBanners = [...prev];
            newBanners[index] = { ...newBanners[index], [field]: value };
            return newBanners;
        });
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Admin</p>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <FaImage className="text-blue-500" />
                    Manage Homepage Grid Banners
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    Update the 6 banners displayed in the dynamic grid section beneath the categories.
                    Positions 1-2 are the large top banners. Positions 3-6 are the smaller bottom banners.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner, index) => (
                    <div key={banner.position} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex flex-col items-end shadow-sm">
                            <span>Pos {banner.position} {banner.position <= 2 ? "(Large)" : "(Small)"}</span>
                            <span className="text-yellow-200">{banner.position <= 2 ? "1000 x 360 px" : "500 x 480 px"}</span>
                        </div>
                        
                        {/* Image Preview */}
                        <div className="w-full h-40 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center">
                            {banner.file ? (
                                <img src={URL.createObjectURL(banner.file)} alt={`Preview ${banner.position}`} className="w-full h-full object-cover" />
                            ) : banner.image ? (
                                <img src={banner.image} alt={`Banner ${banner.position}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <FaImage className="text-3xl mb-2 opacity-50" />
                                    <span className="text-sm font-medium">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-3 flex-1">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Image Source</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleBannerChange(index, 'file', e.target.files[0]);
                                                handleBannerChange(index, 'image', "");
                                            }
                                        }}
                                        className="flex-1 text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <span className="text-xs text-slate-400 self-center">OR</span>
                                    <input
                                        type="text"
                                        value={banner.image || ""}
                                        placeholder="Image URL"
                                        onChange={(e) => {
                                            handleBannerChange(index, 'image', e.target.value);
                                            handleBannerChange(index, 'file', null);
                                        }}
                                        className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                                    <FaLink /> Redirect Link
                                </label>
                                <input
                                    type="text"
                                    value={banner.link || ""}
                                    placeholder="e.g. /category/skin-care"
                                    onChange={(e) => handleBannerChange(index, 'link', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={() => handleSaveBanner(index, banner)}
                            disabled={saving[index]}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors disabled:bg-slate-400 text-sm font-semibold"
                        >
                            <FaSave /> {saving[index] ? "Saving..." : "Save Banner"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
