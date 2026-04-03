import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import Paginator from "../../components/admin-utils/paginator";
import Loader from "../../components/admin-utils/loader";
import { OrderProgressTracker } from "../../components/coupang/OrderProgressTracker";
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
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkStatus, setBulkStatus] = useState("pending");

    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchOrders = async () => {
        const currentToken = localStorage.getItem("token");
        if (!currentToken) {
            console.error("No token found in localStorage during fetchOrders");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);

            const queryString = params.toString();
            const url = `${backendUrl}/orders/${page}/${limit}${queryString ? `?${queryString}` : ""}`;

            console.log(`Fetching orders from: ${url}`);

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching orders:", err);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error("Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        
        // Clear selection on page/filter change
        setSelectedOrders([]);

        // Debounce search to avoid too many API calls
        const timeout = setTimeout(() => {
            fetchOrders();
        }, search ? 500 : 0);

        return () => clearTimeout(timeout);
    }, [page, limit, search, fromDate, toDate]);

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

    const handleBulkUpdate = async () => {
        if (selectedOrders.length === 0) return;
        if (!window.confirm(`Update status of ${selectedOrders.length} orders to ${bulkStatus}?`)) return;

        setSaving(true);
        try {
            await axios.put(
                `${backendUrl}/orders/bulk/status`,
                { orderIds: selectedOrders, status: bulkStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${selectedOrders.length} orders updated successfully`);
            setSelectedOrders([]);
            fetchOrders();
        } catch (err) {
            console.error(err);
            toast.error("Failed to bulk update orders");
        } finally {
            setSaving(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.orderId));
        }
    };

    const toggleSelectOrder = (id, e) => {
        e.stopPropagation();
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(itemId => itemId !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase().replace(/\s+/g, '_');
        switch (s) {
            case "payment_completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "processing":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "shipped":
                return "bg-indigo-100 text-indigo-700 border-indigo-200";
            case "in_transit":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "delivered":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase().replace(/\s+/g, '_');
        switch (s) {
            case "payment_completed":
                return <FaCheckCircle className="text-sm" />;
            case "processing":
                return <FaExclamationCircle className="text-sm animate-pulse" />;
            case "shipped":
                return <FaBoxArchive className="text-sm" />;
            case "in_transit":
                return <FaBoxArchive className="text-sm" />; // Could use a truck icon if available
            case "delivered":
                return <FaCheckCircle className="text-sm" />;
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
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search Order ID..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to page 1 on search
                            }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                                className="text-[12px] font-bold text-gray-700 outline-none bg-transparent"
                            />
                        </div>
                        <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                        <div className="flex items-center gap-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                                className="text-[12px] font-bold text-gray-700 outline-none bg-transparent"
                            />
                        </div>
                        {(fromDate || toDate) && (
                            <button
                                onClick={() => { setFromDate(""); setToDate(""); setPage(1); }}
                                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                title="Clear Dates"
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-medium whitespace-nowrap">
                        Orders Found: {orders.length} (Page {page} of {totalPages || 1})
                    </div>
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
                                <th className="px-4 py-4 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </th>
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
                                        className={`hover:bg-gray-50/80 transition-colors group cursor-pointer ${selectedOrders.includes(order.orderId) ? "bg-indigo-50/30" : ""}`}
                                    >
                                        <td className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.orderId)}
                                                onChange={(e) => toggleSelectOrder(order.orderId, e)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </td>
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
                                            <span className="font-black text-gray-900">LKR {Number(order.total || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                             <div className="flex items-center justify-center gap-2">
                                                 <button
                                                     className="p-2.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl transition-all shadow-sm"
                                                     title="View/Edit Details"
                                                 >
                                                     <FaEye />
                                                 </button>
                                             </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-20">
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

        {/* 🔹 Bulk Action Bar */}
        {selectedOrders.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-bottom-10 duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 backdrop-blur-md">
                    <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-xs">
                            {selectedOrders.length}
                        </div>
                        <span className="text-white font-bold text-sm">Orders Selected</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                        >
                            <option value="pending">⏳ Pending</option>
                            <option value="payment_completed">✅ Payment completed</option>
                            <option value="processing">⚙️ Processing</option>
                            <option value="shipped">📦 Shipped</option>
                            <option value="in_transit">🚀 In transit</option>
                            <option value="delivered">🏠 Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                        </select>
                        
                        <button
                            onClick={handleBulkUpdate}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            {saving ? "Updating..." : "Update All Status"}
                        </button>
                        
                        <button
                            onClick={() => setSelectedOrders([])}
                            className="text-slate-400 hover:text-white font-bold text-sm px-2"
                        >
                            Cancel
                        </button>
                    </div>
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
                            <div className="mb-10 bg-gray-50 border border-gray-100 rounded-3xl p-6 shadow-sm">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
                                    <FaExclamationCircle className="text-emerald-500" /> Delivery Progress
                                </h3>
                                <OrderProgressTracker status={clickOrder.status} />
                            </div>

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
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="payment_completed">✅ Payment completed</option>
                                                    <option value="processing">⚙️ Processing</option>
                                                    <option value="shipped">📦 Shipped</option>
                                                    <option value="in_transit">🚀 In transit</option>
                                                    <option value="delivered">🏠 Delivered</option>
                                                    <option value="cancelled">❌ Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={handleUpdateOrder}
                                                    disabled={saving || (orderStatus === clickOrder.status && ordernotes === clickOrder.notes)}
                                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
                                                >
                                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaSave />}
                                                    {saving ? "Updating..." : "Save Changes"}
                                                </button>
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
                                            {(() => {
                                                let items = clickOrder.items;
                                                if (typeof items === "string") {
                                                    try { items = JSON.parse(items); } catch { items = []; }
                                                }
                                                if (!Array.isArray(items)) items = [];
                                                
                                                return items.map((item, idx) => (
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
                                                            <p className="text-[11px] text-gray-400 font-medium">Qty: {item.qty} × LKR {Number(item.price || 0).toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="font-black text-gray-900 text-sm">LKR {(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-sm font-bold text-gray-400">Grand Total</span>
                                                <span className="text-2xl font-black text-indigo-600">LKR {Number(clickOrder.total || 0).toLocaleString()}</span>
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
