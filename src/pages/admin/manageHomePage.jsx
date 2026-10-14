import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X, Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageHomePage() {
  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [bannerPreviews, setBannerPreviews] = useState({}); // { topicId: { index: { file, url } } }
  
  // Product search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/homepage-topics?admin=true`);
      if (data.success) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) {
      toast.error("Please enter a topic title");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/homepage-topics`, {
        title: newTopicTitle,
        active: true,
        products: []
      });
      if (data.success) {
        setTopics([...topics, { ...data.topic, id: data.topic.id, products: [] }]);
        setNewTopicTitle("");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await axios.delete(`${backendUrl}/homepage-topics/${id}`);
      setTopics(topics.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const handleToggleActive = async (topic) => {
    try {
      const { data } = await axios.put(`${backendUrl}/homepage-topics/${topic.id}`, {
        active: !topic.active
      });
      if (data.success) {
        setTopics(topics.map(t => t.id === topic.id ? { ...t, active: !topic.active } : t));
      }
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  const handleBannerSelect = (topicId, index, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setBannerPreviews(prev => ({
      ...prev,
      [topicId]: {
        ...(prev[topicId] || {}),
        [index]: { file, url: previewUrl }
      }
    }));
  };

  const handleSaveBanner = async (topicId, index) => {
    const preview = bannerPreviews[topicId]?.[index];
    if (!preview) return;

    const formData = new FormData();
    formData.append("images", preview.file);

    try {
      setLoading(true);
      const uploadRes = await axios.post(`${backendUrl}/upload/local`, formData);
      const imageUrl = uploadRes.data.urls[0];

      const topic = topics.find(t => t.id === topicId);
      const currentImages = Array.isArray(topic.bannerImages) ? [...topic.bannerImages] : [];
      
      // Ensure the array has enough slots
      while (currentImages.length <= index) {
        currentImages.push(null);
      }
      currentImages[index] = imageUrl;

      const { data } = await axios.put(`${backendUrl}/homepage-topics/${topicId}`, {
        bannerImages: currentImages
      });

      if (data.success) {
        setTopics(topics.map(t => t.id === topicId ? { ...t, bannerImages: currentImages } : t));
        setBannerPreviews(prev => {
          const next = { ...prev };
          const topicNext = { ...(next[topicId] || {}) };
          delete topicNext[index];
          if (Object.keys(topicNext).length === 0) {
            delete next[topicId];
          } else {
            next[topicId] = topicNext;
          }
          return next;
        });
        toast.success(`Banner slot ${index + 1} saved successfully! (750×1250 px)`);
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBanner = async (topicId, index) => {
    if (!window.confirm(`Remove banner from slot ${index + 1}?`)) return;
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const currentImages = Array.isArray(topic.bannerImages) ? [...topic.bannerImages] : [];
    if (index < currentImages.length) {
      currentImages[index] = null;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`${backendUrl}/homepage-topics/${topicId}`, {
        bannerImages: currentImages
      });
      if (data.success) {
        setTopics(topics.map(t => t.id === topicId ? { ...t, bannerImages: currentImages } : t));
        toast.success(`Removed banner from slot ${index + 1}`);
      }
    } catch (error) {
      console.error("Error removing banner:", error);
      toast.error("Failed to remove banner");
    } finally {
      setLoading(false);
    }
  };

  // Debounced Search for Products
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const { data } = await axios.get(`${backendUrl}/products/search/query?q=${searchQuery}`);
          if (data.success) {
             setSearchResults(data.products);
          }
        } catch (error) {
           console.error("Search error", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddProductToTopic = async (topicId, product) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    // Prevent duplicates
    if (topic.products.some(p => p.id === product.id)) return;

    const updatedProductIds = [...topic.products.map(p => p.id), product.id];
    
    try {
      const { data } = await axios.put(`${backendUrl}/homepage-topics/${topicId}`, {
        products: updatedProductIds
      });
      if (data.success) {
         setTopics(topics.map(t => t.id === topicId ? { ...t, products: [...t.products, product] } : t));
         // Clean up search
         setSearchResults(prev => prev.filter(p => p.id !== product.id));
      }
    } catch (error) {
      console.error("Error adding product to topic:", error);
    }
  };

  const handleRemoveProductFromTopic = async (topicId, productId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    const updatedProductIds = topic.products.filter(p => p.id !== productId).map(p => p.id);
    const updatedProducts = topic.products.filter(p => p.id !== productId);

    try {
      const { data } = await axios.put(`${backendUrl}/homepage-topics/${topicId}`, {
        products: updatedProductIds
      });
      if (data.success) {
         setTopics(topics.map(t => t.id === topicId ? { ...t, products: updatedProducts } : t));
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-6">Manage Home Page Topics</h1>
        
        {/* Add Topic Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Topic Title</label>
            <input 
              type="text" 
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="e.g. Today's Deals, Best Sellers"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#ff1268] focus:border-transparent"
            />
          </div>
          <button 
            onClick={handleAddTopic}
            disabled={loading}
            className="bg-[#ff1268] text-white px-6 py-2 rounded-md font-medium hover:bg-[#e0005a] disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Topic
          </button>
        </div>

        {/* Existing Topics */}
        <div className="space-y-8">
          {topics.map(topic => (
            <div key={topic.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
              {/* Topic Header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
                    <button 
                      onClick={() => handleToggleActive(topic)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${topic.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {topic.active ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1">
                    Upload 1 image per slot (Recommended: <strong className="text-gray-800 font-bold">750 × 1250 px</strong>). Unified 3:5 ratio fits both Windows and Mobile with <strong>Zero Crop</strong> and <strong>Zero Blank Spaces</strong>!
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors self-start sm:self-center"
                  title="Delete Topic"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Topic Banners: 3 Slider Slots with Unified 3:5 Aspect Ratio */}
              <div className="bg-slate-50/70 border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Slider Banners (Unified 3:5 Ratio — Fits Windows & Mobile)
                  </span>
                  <span className="text-[11px] text-gray-400 italic">
                    {topic.bannerImages?.filter(Boolean).length > 0 || topic.bannerImage
                      ? "Slider active (changes every 5s)"
                      : "Horizontal strip active"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((idx) => {
                    const savedImg = topic.bannerImages?.[idx] || (idx === 0 ? topic.bannerImage : null) || topic.mobileBannerImages?.[idx];
                    const preview = bannerPreviews[topic.id]?.[idx];

                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col gap-2.5">
                        <div className="flex justify-between items-center pb-1.5 border-b border-gray-100">
                          <span className="text-xs font-black text-gray-800">Slot {idx + 1}</span>
                          {savedImg ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ✓ Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Empty</span>
                          )}
                        </div>

                        {/* Unified 3:5 Thumbnail Uploader */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative group/banner w-full aspect-[3/5] max-h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center shadow-inner">
                            {preview ? (
                              <img src={preview.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover ring-2 ring-primary ring-inset" />
                            ) : savedImg ? (
                              <>
                                <img src={savedImg} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handleRemoveBanner(topic.id, idx)}
                                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-md opacity-0 group-hover/banner:opacity-100 transition-opacity shadow-md"
                                  title="Remove image"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center text-gray-400 p-2 text-center">
                                <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                                <span className="text-[11px] font-bold text-gray-600">Upload Banner</span>
                                <span className="text-[9.5px] font-bold text-blue-600 mt-0.5">750 × 1250 px</span>
                                <span className="text-[8px] text-gray-400 mt-0.5">Unified 3:5 Ratio</span>
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/banner:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer">
                              <Upload className="w-5 h-5 text-white" />
                              <span className="text-[11px] font-bold text-white">Change Image</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleBannerSelect(topic.id, idx, e.target.files[0])}
                              />
                            </label>
                          </div>

                          {preview ? (
                            <button 
                              onClick={() => handleSaveBanner(topic.id, idx)}
                              disabled={loading}
                              className="w-full py-2 bg-primary hover:opacity-90 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50"
                            >
                              {loading ? "Saving..." : "SAVE BANNER"}
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-semibold">750 × 1250 px (Unified)</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topic Products */}
              <div className="p-6">
                <div className="mb-4">
                   <h3 className="text-sm font-medium text-gray-700 mb-3">Products in this topic ({topic.products.length})</h3>
                   
                   {topic.products.length === 0 ? (
                     <p className="text-sm text-gray-500 italic pb-4 border-b border-gray-100">No products added yet.</p>
                   ) : (
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
                       {topic.products.map(product => (
                         <div key={product.id} className="relative flex gap-3 border border-gray-200 rounded p-2 items-center">
                           <img src={product.images?.[0] || "/default-product.jpg"} className="w-12 h-12 object-cover rounded bg-gray-50" />
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">LKR {Number(product.price).toLocaleString()}</p>
                           </div>
                           <button 
                              onClick={() => handleRemoveProductFromTopic(topic.id, product.id)}
                              className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                           >
                              <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                {/* Add Product Search */}
                <div className="relative max-w-xl">
                  {selectedTopicId === topic.id ? (
                    <div className="relative">
                      <div className="flex items-center border border-[#ff1268] rounded-md px-3 py-2 bg-white">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for a product to add..."
                          className="flex-1 outline-none text-sm"
                          autoFocus
                        />
                        <button onClick={() => { setSelectedTopicId(null); setSearchQuery(""); }} className="text-gray-400 hover:text-gray-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Search Results Dropdown — opens upward to avoid viewport clipping */}
                      {searchQuery.length > 1 && (
                        <div className="absolute z-50 w-full bottom-full mb-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-64 overflow-y-auto">
                           {searchResults.length === 0 ? (
                             <div className="p-3 text-sm text-gray-500">No products found.</div>
                           ) : (
                             searchResults.map(product => (
                               <button 
                                 key={product.id}
                                 onClick={() => handleAddProductToTopic(topic.id, product)}
                                 className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                               >
                                 <img src={product.images?.[0] || "/default-product.jpg"} className="w-10 h-10 object-cover rounded bg-gray-50" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">LKR {Number(product.price).toLocaleString()}</p>
                                 </div>
                                 <Plus className="w-4 h-4 text-[#ff1268]" />
                               </button>
                             ))
                           )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setSelectedTopicId(topic.id); setSearchQuery(""); }}
                      className="text-sm text-[#ff1268] font-medium flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add Product to {topic.title}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {topics.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No home page topics created yet. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
