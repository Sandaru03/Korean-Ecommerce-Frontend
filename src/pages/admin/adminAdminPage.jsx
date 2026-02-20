import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function AdminAdminPage() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAdmins = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/users/admins", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmins(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load admins");
            setAdmins([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (email) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL + "/users/admins/" + encodeURIComponent(email), {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Admin deleted successfully");
            setAdmins((prev) => prev.filter((a) => a.email !== email));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete admin");
        }
    };

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white text-sm uppercase">
                                <th className="p-4">First Name</th>
                                <th className="p-4">Last Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4 text-center">Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {admins.length > 0 ? (
                                admins.map((admin, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-100 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{admin.firstName}</td>
                                        <td className="p-4 font-medium text-gray-900">{admin.lastName}</td>
                                        <td className="p-4 text-gray-700">{admin.email}</td>
                                        <td className="p-4 text-gray-700">{admin.phone}</td>
                                        <td className="p-4 flex items-center justify-center">
                                            <BiTrash
                                                className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                                                onClick={() => handleDelete(admin.email)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-6 text-gray-600 font-medium">
                                        No admins found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Link
                to="/admin/newadmin"
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
