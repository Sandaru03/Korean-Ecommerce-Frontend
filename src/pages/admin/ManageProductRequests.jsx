import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import Loader from "../../components/admin-utils/loader";

export default function ManageProductRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMsgs, setExpandedMsgs] = useState({});

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${backendUrl}/product-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data.data);
        } catch (error) {
            console.error("Error fetching product requests:", error);
            toast.error("Failed to load product requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product request?")) return;
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backendUrl}/product-requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Request deleted successfully");
            setRequests(requests.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("Failed to delete request");
        }
    };

    const toggleMsg = (id) => {
        setExpandedMsgs((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Product Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage customer requests for new products</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer Details</th>
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No product requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.name}</div>
                                            <div className="text-gray-500">{req.mobileNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.productName}</div>
                                            {req.sourceUrl && (
                                                <a href={req.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                                    View Source
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs break-words">
                                            {req.message ? (
                                                <div>
                                                    <div className={expandedMsgs[req.id] ? "whitespace-pre-wrap" : "truncate"}>
                                                        {req.message}
                                                    </div>
                                                    {req.message.length > 50 && (
                                                        <button 
                                                            onClick={() => toggleMsg(req.id)}
                                                            className="text-blue-600 hover:underline text-xs mt-1 font-medium"
                                                        >
                                                            {expandedMsgs[req.id] ? "Show Less" : "Read More"}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No message</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(req.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete request"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
