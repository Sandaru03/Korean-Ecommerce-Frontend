import { useEffect, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import Loader from "../../components/admin-utils/loader";

export default function ProductAdminPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            axios
                .get(import.meta.env.VITE_BACKEND_URL + "/products")
                .then((res) => {
                    setProducts(res.data);
                    setisLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to load products");
                    setisLoading(false);
                });
        }
    }, [isLoading]);

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
            (product.name && product.name.toLowerCase().includes(query)) ||
            (product.productId && product.productId.toLowerCase().includes(query))
        );
    });

    return (
        <div className="w-full h-full p-6 bg-gray-50 flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">Products Management</h1>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Product ID or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
                    <table className="w-full text-left border-collapse">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-gray-800 text-white text-sm uppercase">
                                <th className="p-4">Image</th>
                                <th className="p-4">Product ID</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Label Price</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-100 transition-colors"
                                    >
                                        {/* Image */}
                                        <td className="p-4">
                                            <img
                                                src={product.images?.[0] || "/default-product.jpg"}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover shadow"
                                            />
                                        </td>

                                        {/* Product ID */}
                                        <td className="p-4 text-gray-700">{product.productId}</td>

                                        {/* Product Name */}
                                        <td className="p-4 font-medium text-gray-900">
                                            {product.name}
                                        </td>

                                        {/* Label Price */}
                                        <td className="p-4 text-gray-500">
                                            LKR {product.labellPrice}
                                        </td>

                                        {/* Price */}
                                        <td className="p-4 text-red-600 font-semibold">
                                            LKR {product.price}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 flex items-center justify-center gap-3">

                                            <BiTrash
                                                className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                                                onClick={() => {
                                                    if (!window.confirm("Are you sure you want to delete this product?")) return;
                                                    const token = localStorage.getItem("token");
                                                    axios
                                                        .delete(
                                                            import.meta.env.VITE_BACKEND_URL +
                                                            "/products/" +
                                                            product.productId,
                                                            {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            }
                                                        )
                                                        .then((res) => {
                                                            toast.success("Product Deleted Successfully");
                                                            setisLoading(true);
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error deleting product:", error);
                                                            toast.error("Failed to delete product");
                                                        });
                                                }}
                                            />


                                            <BiEditAlt
                                                onClick={() => {
                                                    navigate("/admin/updateproduct", {
                                                        state: product,
                                                    });
                                                }}
                                                className="bg-gray-700 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-gray-900 transition"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}


            <Link
                to={"/admin/newproduct"}
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-50"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
