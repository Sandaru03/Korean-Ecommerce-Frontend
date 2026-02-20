import { useEffect, useState, useMemo } from "react";
import { BiBlock, BiCheckShield } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function CustomerAdminPage() {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/users/customers")
            .then((res) => {
                setCustomers(res.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load customers");
                setIsLoading(false);
            });
    }, [isLoading, navigate]);

    const filtered = useMemo(() => {
        if (!query.trim()) return customers;
        const q = query.toLowerCase();
        return customers.filter(
            (c) =>
                c.firstName?.toLowerCase().includes(q) ||
                c.lastName?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q) ||
                c.phone?.toLowerCase().includes(q)
        );
    }, [customers, query]);

    function toggleBlock(cus) {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .patch(
                `${import.meta.env.VITE_BACKEND_URL}/users/customers/${encodeURIComponent(
                    cus.email
                )}/block`,
                { isBlock: !cus.isBlock }
            )
            .then((res) => {
                toast.success(res.data?.message || "Updated");
                setIsLoading(true); // reload list
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to update status");
            });
    }

    return (
        <div className="w-full h-full p-6 bg-gray-50">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Customers</h2>

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 w-full max-w-md rounded-lg border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-gray-800"
                    placeholder="Search by name, email or phone…"
                />
            </div>

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
                                <th className="p-4">Verified</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((cus, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-100 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{cus.firstName}</td>
                                    <td className="p-4 font-medium text-gray-900">{cus.lastName}</td>
                                    <td className="p-4 text-gray-700">{cus.email}</td>
                                    <td className="p-4 text-gray-700">{cus.phone}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${cus.isEmailVerified
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {cus.isEmailVerified ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${cus.isBlock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                                }`}
                                        >
                                            {cus.isBlock ? "Blocked" : "Active"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => toggleBlock(cus)}
                                                className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg text-white transition ${cus.isBlock
                                                    ? "bg-gray-700 hover:bg-gray-900"
                                                    : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                                title={cus.isBlock ? "Unblock" : "Block"}
                                            >
                                                {cus.isBlock ? (
                                                    <>
                                                        <BiCheckShield className="text-xl" />
                                                        <span>Unblock</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <BiBlock className="text-xl" />
                                                        <span>Block</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td className="p-6 text-center text-gray-500" colSpan={7}>
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* optional floating action (keep UI consistent with Employees page) */}
            <Link
                to="/signup"
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
                title="Create a new customer (manual)"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>
        </div>
    );
}
