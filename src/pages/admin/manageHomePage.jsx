import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageHomePage() {
  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [loading, setLoading] = useState(false);
  
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
         setSearchQuery("");
         setSearchResults([]);
         setSelectedTopicId(null);
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
            <div key={topic.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Topic Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
                  <button 
                    onClick={() => handleToggleActive(topic)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${topic.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {topic.active ? 'Active' : 'Hidden'}
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
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
                           <img src={product.image} className="w-12 h-12 object-cover rounded bg-gray-50" />
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.price}</p>
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
                      
                      {/* Search Results Dropdown */}
                      {searchQuery.length > 1 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                           {searchResults.length === 0 ? (
                             <div className="p-3 text-sm text-gray-500">No products found.</div>
                           ) : (
                             searchResults.map(product => (
                               <button 
                                 key={product.id}
                                 onClick={() => handleAddProductToTopic(topic.id, product)}
                                 className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                               >
                                 <img src={product.image} className="w-10 h-10 object-cover rounded bg-gray-50" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.price}</p>
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
