import { useEffect, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function EmployeeAdminPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/employees", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setEmployees(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load employees");
                setIsLoading(false);
            });
    }, [isLoading]);

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
                                <th className="p-4">Role</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((emp, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-100 transition-colors"
                                >
                                    <td className="p-4 font-medium text-gray-900">{emp.firstName}</td>
                                    <td className="p-4 font-medium text-gray-900">{emp.lastName}</td>
                                    <td className="p-4 text-gray-700">{emp.email}</td>
                                    <td className="p-4 text-gray-700">{emp.phone}</td>
                                    <td className="p-4 text-gray-700">{emp.salary}</td>
                                    <td className="p-4 text-gray-700">{emp.role}</td>
                                    <td className="p-4 flex items-center justify-center gap-3">
                                        <BiTrash
                                            className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                                            onClick={() => {
                                                const token = localStorage.getItem("token");
                                                if (!token) {
                                                    navigate("/login");
                                                    return;
                                                }

                                                axios
                                                    .delete(import.meta.env.VITE_BACKEND_URL + "/employees/" + emp.email, {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    })
                                                    .then(() => {
                                                        toast.success("Employee Deleted Successfully");
                                                        setIsLoading(true);
                                                    })
                                                    .catch((err) => {
                                                        console.error(err);
                                                        toast.error("Failed to delete employee");
                                                    });
                                            }}
                                        />

                                        <BiEditAlt
                                            onClick={() => navigate("/admin/updateemployee", { state: emp })}
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
                to="/admin/newemployee"
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
