import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ManageNavbarCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/categories`);
      if (data.categories) {
        setCategories(data.categories.filter(c => c.parentId === null));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const toggleNavbarVisibility = async (categoryId, currentStatus) => {
    try {
      const { data } = await axios.put(`${backendUrl}/categories/${categoryId}`, {
        showInNavbar: !currentStatus
      });
      if (data.message === "Category updated successfully") {
        setCategories(categories.map(cat => 
          cat.id === categoryId ? { ...cat, showInNavbar: !currentStatus } : cat
        ));
        toast.success(`Category ${!currentStatus ? 'added to' : 'removed from'} navbar`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-2">Navbar Categories</h1>
        <p className="text-gray-600 mb-8">Select which categories should appear in the storefront's top navigation bar.</p>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Search bar */}
          <div className="mb-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            />
          </div>

          {loading ? (
             <div className="flex justify-center p-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Show in Navbar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {category.image && (
                              <img src={category.image} alt="" className="h-10 w-10 min-w-10 rounded-full object-cover mr-4 bg-gray-100" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                              {category.parentId && <div className="text-xs text-gray-500">Subcategory</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleNavbarVisibility(category.id, category.showInNavbar)}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                              category.showInNavbar ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                category.showInNavbar ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
