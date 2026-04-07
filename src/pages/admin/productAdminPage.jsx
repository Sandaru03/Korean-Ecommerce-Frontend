import { useEffect, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function ProductAdminPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setisLoading] = useState(true);

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

    return (
        <div className="w-full h-full p-6 bg-gray-50">
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
                            {products.map((product, index) => (
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
                                                // Auth check removed
                                                axios
                                                    .delete(
                                                        import.meta.env.VITE_BACKEND_URL +
                                                        "/products/" +
                                                        product.productId
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            <Link
                to={"/admin/newproduct"}
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
