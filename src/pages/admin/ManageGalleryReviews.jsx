import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageGalleryReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/gallery-reviews/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching gallery reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("images", selectedFile);

      const uploadRes = await axios.post(`${backendUrl}/upload/local`, formData);
      const imageUrl = uploadRes.data.urls[0];

      const { data } = await axios.post(`${backendUrl}/gallery-reviews`, {
        image: imageUrl,
        isActive: true,
        order: reviews.length
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (data.success) {
        toast.success("Review image added successfully");
        setReviews([...reviews, data.review]);
        setPreview(null);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading review:", error);
      toast.error("Failed to add review image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review image?")) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/gallery-reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (data.success) {
        toast.success("Review deleted");
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleToggleActive = async (review) => {
    try {
      const { data } = await axios.put(`${backendUrl}/gallery-reviews/${review.id}`, {
        isActive: !review.isActive
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (data.success) {
        setReviews(reviews.map(r => r.id === review.id ? { ...r, isActive: !review.isActive } : r));
        toast.success(review.isActive ? "Hidden from gallery" : "Shown in gallery");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Review Gallery Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage the image-based review slider on the home page.</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Add New Review Image
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <label className={`
                relative flex flex-col items-center justify-center aspect-[4/5] w-full 
                rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                ${preview ? 'border-primary bg-red-50/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}
              `}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 p-6 text-center">
                    <Upload className="w-10 h-10 mb-3" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Select review image</span>
                    <span className="text-[11px] mt-1 opacity-60">Recommendation: 800x1000px</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                
                {preview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase">Change Image</span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex-1 space-y-6 pt-2">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Image Requirements</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    High quality screenshots of customer feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    Aspect ratio of 4:5 is recommended for best display
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    Max file size: 5MB
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" /> Save to Gallery
                    </>
                  )}
                </button>
                
                {preview && (
                  <button
                    onClick={() => { setPreview(null); setSelectedFile(null); }}
                    className="px-6 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Existing Reviews Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
            Current Gallery ({reviews.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">No reviews in the gallery yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className={`group relative bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-xl ${review.isActive ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
                  <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
                    <img src={review.image} alt="Gallery Review" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => handleToggleActive(review)}
                      className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-colors ${review.isActive ? 'bg-white/90 text-green-600 hover:bg-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      title={review.isActive ? "Hide from site" : "Show on site"}
                    >
                      {review.isActive ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 bg-white/90 text-red-500 rounded-full shadow-lg backdrop-blur-md hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!review.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xl tracking-widest">Hidden</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
