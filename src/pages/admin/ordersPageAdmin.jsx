import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import Paginator from "../../components/admin-utils/paginator";
import Loader from "../../components/admin-utils/loader";
import toast from "react-hot-toast";
 

export default function OrdersPageAdmin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickOrder, setClickOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("pending");
    const [ordernotes, setOrderNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${backendUrl}/orders/${page}/${limit}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        fetchOrders();
    }, [page, limit]);

    const handleUpdateOrder = async () => {
        if (!clickOrder) return;
        setSaving(true);
        try {
            await axios.put(
                `${backendUrl}/orders/${clickOrder.orderId}`,
                { status: orderStatus, notes: ordernotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order Updated Successfully");
            fetchOrders();
            setPopupVisible(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update order");
        } finally {
            setSaving(false);
        }
    };

    const quickUpdate = async (id, newStatus) => {
        if (!window.confirm(`Mark order ${id} as ${newStatus}?`)) return;
        setSaving(true);
        try {
            await axios.put(
                `${backendUrl}/orders/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Order ${newStatus} successfully`);
            fetchOrders();
            setPopupVisible(false);
        } catch (err) {
            console.error(err);
            toast.error(`Failed to update order to ${newStatus}`);
        } finally {
            setSaving(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <FaCheckCircle className="text-sm" />;
            case "cancelled":
                return <FaTimesCircle className="text-sm" />;
            default:
                return <FaExclamationCircle className="text-sm" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBoxArchive className="text-indigo-500" /> Manage Orders
                </h1>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-medium">
                    Total Orders Found: {orders.length} (Page {page} of {totalPages || 1})
                </div>
            </div>

            {loading ? (
                <div className="w-full py-20 flex justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr
                                            key={order.orderId}
                                            onClick={() => {
                                                setOrderStatus(order.status);
                                                setOrderNotes(order.notes);
                                                setClickOrder(order);
                                                setPopupVisible(true);
                                            }}
                                            className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 font-bold text-indigo-600 text-sm">
                                                {order.orderId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-sm">{order.name}</span>
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-[10px]" /> {order.address}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[12px] text-gray-600 flex items-center gap-1.5 font-medium">
                                                        <FaEnvelope className="text-[10px] text-gray-400" /> {order.email}
                                                    </span>
                                                    <span className="text-[12px] text-gray-600 flex items-center gap-1.5 font-medium">
                                                        <FaPhone className="text-[10px] text-gray-400" /> {order.phone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5 border ${getStatusStyle(order.status)} uppercase tracking-tighter`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[12px] text-gray-500 font-medium">
                                                {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-black text-gray-900">LKR {order.total.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {(order.status === "cancelled" || order.status === "completed") && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); quickUpdate(order.orderId, "pending"); }}
                                                            className="p-2.5 bg-gray-100 hover:bg-amber-600 hover:text-white text-amber-600 rounded-xl transition-all shadow-sm"
                                                            title="Reset to Pending"
                                                        >
                                                            <FaExclamationCircle />
                                                        </button>
                                                    )}
                                                    {order.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); quickUpdate(order.orderId, "completed"); }}
                                                                className="p-2.5 bg-gray-100 hover:bg-green-600 hover:text-white text-green-600 rounded-xl transition-all shadow-sm"
                                                                title="Mark as Completed"
                                                            >
                                                                <FaCheckCircle />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); quickUpdate(order.orderId, "cancelled"); }}
                                                                className="p-2.5 bg-gray-100 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-all shadow-sm"
                                                                title="Mark as Cancelled"
                                                            >
                                                                <FaTimesCircle />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-20">
                                            <FaBoxArchive className="mx-auto text-4xl text-gray-100 mb-2" />
                                            <p className="text-gray-400 font-medium italic">No orders found matching this view.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
                        <Paginator
                            currentPage={page}
                            totalPages={totalPages}
                            setCurrentPage={setPage}
                            limit={limit}
                            setLimit={setLimit}
                        />
                    </div>
                </div>
            )}

            {/* 🔹 Detailed Order Modal */}
            {popupVisible && clickOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    Order <span className="text-indigo-600">{clickOrder.orderId}</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <FaCalendarAlt /> Placed on {new Date(clickOrder.date).toLocaleString()}
                                </p>
                            </div>
                            <button
                                className="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-full flex items-center justify-center transition-all shadow-sm"
                                onClick={() => setPopupVisible(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Customer Column */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaUser className="text-blue-500" /> Customer Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Full Name</p>
                                                <p className="font-bold text-gray-800">{clickOrder.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Email Address</p>
                                                <p className="font-bold text-gray-800 text-sm">{clickOrder.email}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Phone</p>
                                                    <p className="font-bold text-gray-800">{clickOrder.phone}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Delivery Address</p>
                                                <p className="font-bold text-gray-800 text-sm leading-relaxed">{clickOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Column within Customer Col for mobile logic */}
                                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaEdit className="text-indigo-500" /> Order Status & Notes
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Current Status</label>
                                                <select
                                                    className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                                    value={orderStatus}
                                                    onChange={(e) => setOrderStatus(e.target.value)}
                                                >
                                                    <option value="pending">🟡 Pending</option>
                                                    <option value="completed">🟢 Completed</option>
                                                    <option value="cancelled">🔴 Cancelled</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Internal Notes</label>
                                                <textarea
                                                    className="w-full h-24 p-3 bg-white border border-indigo-100 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-none"
                                                    placeholder="Add any internal update notes here..."
                                                    value={ordernotes}
                                                    onChange={(e) => setOrderNotes(e.target.value)}
                                                ></textarea>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleUpdateOrder}
                                                    disabled={saving || (orderStatus === clickOrder.status && ordernotes === clickOrder.notes)}
                                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
                                                >
                                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaSave />}
                                                    {saving ? "Updating..." : "Save Changes"}
                                                </button>
                                                {clickOrder.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => quickUpdate(clickOrder.orderId, "completed")}
                                                            disabled={saving}
                                                            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200"
                                                            title="Complete Now"
                                                        >
                                                            <FaCheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => quickUpdate(clickOrder.orderId, "cancelled")}
                                                            disabled={saving}
                                                            className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200"
                                                            title="Cancel Now"
                                                        >
                                                            <FaTimesCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                {(clickOrder.status === "cancelled" || clickOrder.status === "completed") && (
                                                    <button
                                                        onClick={() => quickUpdate(clickOrder.orderId, "pending")}
                                                        disabled={saving}
                                                        className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-200"
                                                        title="Reset to Pending"
                                                    >
                                                        <FaExclamationCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Column */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex-1 flex flex-col">
                                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FaBoxArchive className="text-indigo-500" /> Itemized Summary
                                        </h3>
                                        <div className="space-y-4 flex-1">
                                            {clickOrder.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 group hover:border-indigo-100 hover:shadow-sm transition-all"
                                                >
                                                    <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                        <img
                                                            src={item.image || "/default-product.jpg"}
                                                            alt=""
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{item.productName}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">Qty: {item.qty} × LKR {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-black text-gray-900 text-sm">LKR {(item.price * item.qty).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-sm font-bold text-gray-400">Grand Total</span>
                                                <span className="text-2xl font-black text-indigo-600">LKR {clickOrder.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Sticky if needed) */}
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple internal loader for the button
function Loader2({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}
