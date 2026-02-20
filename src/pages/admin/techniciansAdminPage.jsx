import { useEffect, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function TechnicianAdminPage() {
    const [techs, setTechs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/technicians", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setTechs(res.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load technicians");
                setIsLoading(false);
            });
    }, [isLoading, navigate]);

    function handleDelete(email, e) {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        axios
            .delete(
                import.meta.env.VITE_BACKEND_URL + "/technicians/" + encodeURIComponent(email),
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                toast.success("Technician deleted successfully");
                setIsLoading(true);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to delete technician");
            });
    }

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
                                <th className="p-4">Salary</th>
                                <th className="p-4">Speciality</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {techs.map((t) => (
                                <tr
                                    key={t.email}
                                    className="border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="p-4 font-medium text-gray-900">{t.firstName}</td>
                                    <td className="p-4 font-medium text-gray-900">{t.lastName}</td>
                                    <td className="p-4 text-gray-700">{t.email}</td>
                                    <td className="p-4 text-gray-700">{t.phone}</td>
                                    <td className="p-4 text-gray-700">{t.salary}</td>
                                    <td className="p-4 text-gray-700">{t.speciality || "-"}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <BiTrash
                                                className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                                                onClick={(e) => handleDelete(t.email, e)}
                                                title="Delete"
                                            />
                                            <BiEditAlt
                                                onClick={() =>
                                                    navigate("/admin/updatetechnician", { state: t })
                                                }
                                                className="bg-gray-700 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-gray-900 transition"
                                                title="Edit"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {techs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-gray-500">
                                        No technicians found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Link
                to="/admin/newtechnician"
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
                title="Add new technician"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
