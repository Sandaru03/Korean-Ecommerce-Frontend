import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaSave, FaTimes, FaSearch, FaPrint, FaTruck, FaTrash } from "react-icons/fa";
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
    const [generatingWaybills, setGeneratingWaybills] = useState(false);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkStatus, setBulkStatus] = useState("pending");
    const [destination, setDestination] = useState("all"); // 'all' | 'srilanka' | 'international'
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ open: false, orderIds: [] });
    const [deletingOrders, setDeletingOrders] = useState(false);
    const [isEditingCustomer, setIsEditingCustomer] = useState(false);
    const [customerForm, setCustomerForm] = useState({
        name: "",
        phone: "",
        secondaryPhone: "",
        address: "",
        city: "",
    });
    const [savingCustomer, setSavingCustomer] = useState(false);

    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const openOrderModal = (order) => {
        setOrderStatus(order.status);
        setOrderNotes(order.notes || "");
        setClickOrder(order);
        setCustomerForm({
            name: order.name || "",
            phone: order.phone || "",
            secondaryPhone: order.secondaryPhone || "",
            address: order.address || "",
            city: order.city || "",
        });
        setIsEditingCustomer(false);
        setPopupVisible(true);
    };

    const handleSaveCustomerDetails = async () => {
        if (!clickOrder) return;
        setSavingCustomer(true);
        try {
            await axios.put(
                `${backendUrl}/orders/${clickOrder.orderId}`,
                customerForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Customer details updated successfully");
            setClickOrder((prev) => ({ ...prev, ...customerForm }));
            setOrders((prev) =>
                prev.map((o) =>
                    o.orderId === clickOrder.orderId ? { ...o, ...customerForm } : o
                )
            );
            setIsEditingCustomer(false);
        } catch (err) {
            console.error("Failed to update customer details:", err);
            toast.error("Failed to update customer details");
        } finally {
            setSavingCustomer(false);
        }
    };

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
            if (destination && destination !== "all") params.append("destination", destination);

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
    }, [page, limit, search, fromDate, toDate, destination]);

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

    const handleDeleteOrders = async () => {
        const orderIds = deleteConfirmModal.orderIds;
        if (!orderIds || orderIds.length === 0) return;

        setDeletingOrders(true);
        const currentToken = localStorage.getItem("token");

        try {
            if (orderIds.length === 1) {
                await axios.delete(`${backendUrl}/orders/${orderIds[0]}`, {
                    headers: { Authorization: `Bearer ${currentToken}` }
                });
            } else {
                await axios.delete(`${backendUrl}/orders/bulk`, {
                    headers: { Authorization: `Bearer ${currentToken}` },
                    data: { orderIds }
                });
            }

            toast.success(
                orderIds.length === 1 
                    ? `Order #${orderIds[0]} deleted successfully` 
                    : `${orderIds.length} orders deleted successfully`
            );

            // Remove deleted orders from selection
            setSelectedOrders(prev => prev.filter(id => !orderIds.includes(id)));

            // If deleted order is open in details modal, close it
            if (clickOrder && orderIds.includes(clickOrder.orderId)) {
                setPopupVisible(false);
                setClickOrder(null);
            }

            setDeleteConfirmModal({ open: false, orderIds: [] });
            fetchOrders();
        } catch (error) {
            console.error("Failed to delete order(s):", error);
            toast.error(error.response?.data?.message || "Failed to delete order(s)");
        } finally {
            setDeletingOrders(false);
        }
    };

    const handleCreateWaybills = async (specificOrderIds = null) => {
        const rawTargetIds = specificOrderIds || selectedOrders;
        if (!rawTargetIds || rawTargetIds.length === 0) {
            toast.error("Please select at least one order to create waybills");
            return;
        }

        // Filter to Sri Lanka domestic orders only (Fardar is domestic only)
        const targetOrders = orders.filter(o => rawTargetIds.includes(o.orderId));
        const slOrders = targetOrders.filter(o => !o.country || o.country.toLowerCase().includes("sri lanka"));
        const targetIds = slOrders.length > 0 ? slOrders.map(o => o.orderId) : rawTargetIds;

        if (targetOrders.length > 0 && slOrders.length === 0) {
            toast.error("Fardar Courier waybills can only be created for Sri Lanka domestic orders. International orders are handled via overseas couriers (DHL/FedEx).");
            return;
        }

        if (slOrders.length > 0 && slOrders.length < rawTargetIds.length) {
            toast("Skipped international order(s) — Fardar is Sri Lanka domestic only.", { icon: "ℹ️" });
        }

        const confirmMsg = `Send ${targetIds.length} Sri Lanka domestic order(s) to Fardar Courier & generate printable waybill stickers?`;
        if (!window.confirm(confirmMsg)) return;

        setGeneratingWaybills(true);
        const loadingToast = toast.loading(`Processing ${targetIds.length} orders with courier API...`);

        try {
            const res = await axios.post(
                `${backendUrl}/orders/courier/generate-waybills`,
                { orderIds: targetIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loadingToast);

            if (res.data.success) {
                const emailNotice = res.data.emailSent ? ` (PDF emailed to ${res.data.recipientEmail})` : "";
                toast.success(
                    `Waybills generated! (${res.data.newlyCreatedCount} new, ${res.data.reusedCount} reused).${emailNotice}`,
                    { duration: 6000 }
                );

                // Immediate local state update for instant UI feedback
                if (res.data.orders && res.data.orders.length > 0) {
                    const wbMap = new Map(res.data.orders.map(o => [o.orderId, o.waybillNo]));
                    setOrders(prev => prev.map(ord => {
                        if (wbMap.has(ord.orderId)) {
                            return { ...ord, waybillNo: wbMap.get(ord.orderId), waybillStatus: "sent" };
                        }
                        return ord;
                    }));
                }

                // If modal is open for one of the updated orders, update clickOrder waybillNo
                if (clickOrder && targetIds.includes(clickOrder.orderId)) {
                    const found = res.data.orders?.find(o => o.orderId === clickOrder.orderId);
                    if (found) {
                        setClickOrder(prev => ({
                            ...prev,
                            waybillNo: found.waybillNo,
                            waybillStatus: "sent",
                        }));
                    }
                }

                // Open printable PDF in new tab if available, or HTML preview
                if (res.data.pdfUrl) {
                    window.open(res.data.pdfUrl, "_blank");
                } else {
                    window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${targetIds.join(",")}`, "_blank");
                }

                if (res.data.errors && res.data.errors.length > 0) {
                    const errDetails = res.data.errors.map(e => `${e.orderId}: ${e.error}`).join("; ");
                    toast.error(`Courier warnings: ${errDetails}`, { duration: 8000 });
                }

                // Refresh orders from server and clear selection
                setSelectedOrders([]);
                fetchOrders();
            } else {
                toast.error(res.data.message || "Failed to generate waybills");
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error("Error generating waybills:", err);
            const errMsg = err.response?.data?.message || "Failed to generate courier waybills";
            toast.error(errMsg);
        } finally {
            setGeneratingWaybills(false);
        }
    };

    const handlePreviewWaybills = (specificOrderIds = null) => {
        const targetIds = specificOrderIds || selectedOrders;
        if (!targetIds || targetIds.length === 0) {
            toast.error("Please select at least one order to preview waybills");
            return;
        }

        // Filter to Sri Lanka orders if selection has mixed
        const targetOrders = orders.filter(o => targetIds.includes(o.orderId));
        const slOrders = targetOrders.filter(o => !o.country || o.country.toLowerCase().includes("sri lanka"));

        if (slOrders.length === 0 && targetOrders.length > 0) {
            toast.error("Waybills can only be previewed for Sri Lanka domestic orders");
            return;
        }

        const previewIds = (slOrders.length > 0 ? slOrders.map(o => o.orderId) : targetIds);
        window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${previewIds.join(",")}`, "_blank");
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

            {/* 🔹 Destination Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Destination:</span>
                    <button
                        onClick={() => { setDestination("all"); setPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            destination === "all"
                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                        }`}
                    >
                        <span>🌐</span> All Destinations
                    </button>
                    <button
                        onClick={() => { setDestination("srilanka"); setPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            destination === "srilanka"
                                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                        }`}
                    >
                        <span>🇱🇰</span> Sri Lanka (Domestic)
                    </button>
                    <button
                        onClick={() => { setDestination("international"); setPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            destination === "international"
                                ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                        }`}
                    >
                        <span>🌍</span> International (Overseas)
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=sample`, "_blank")}
                        className="px-3 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/90 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Test how a full 9-sticker A4 sheet looks with sample data without sending anything to courier"
                    >
                        <FaEye className="text-indigo-600 text-xs" />
                        <span>Test Waybill (Sample A4)</span>
                    </button>
                    <div className="text-xs text-gray-500 font-medium hidden sm:block">
                        Showing: <span className="font-bold text-gray-800">{destination === "all" ? "All Orders" : destination === "srilanka" ? "Sri Lanka Orders Only" : "International Orders Only"}</span>
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
                                        onClick={() => openOrderModal(order)}
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
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-gray-900 text-sm">{order.name}</span>
                                                    {(() => {
                                                        const country = (order.country || "Sri Lanka").trim();
                                                        const isSL = country.toLowerCase() === "sri lanka" || country.toLowerCase().includes("sri lanka");
                                                        return isSL ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                🇱🇰 Sri Lanka
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                                                🌍 {country}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                {/* Waybill badge if present */}
                                                {order.waybillNo ? (
                                                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200"
                                                            title={`Waybill Status: ${order.waybillStatus || "sent"}`}
                                                        >
                                                            <FaTruck className="text-[10px] text-indigo-500" /> WB: {order.waybillNo}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${order.orderId}`, "_blank");
                                                            }}
                                                            className="p-1 hover:bg-indigo-100 text-indigo-600 rounded text-xs transition-colors"
                                                            title="Print Waybill Sticker"
                                                        >
                                                            <FaPrint className="text-[10px]" />
                                                        </button>
                                                    </div>
                                                ) : (!order.country || order.country.toLowerCase().includes("sri lanka")) ? (
                                                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="Not registered on courier dashboard yet">
                                                            <FaTruck className="text-[9px] text-amber-500" /> No WB
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${order.orderId}`, "_blank");
                                                            }}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors"
                                                            title="Preview Waybill Sticker (Shows NOT CREATED IN COURIER)"
                                                        >
                                                            <FaEye className="text-[10px] text-indigo-500" /> Preview WB
                                                        </button>
                                                    </div>
                                                ) : null}
                                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-[10px] shrink-0" /> <span className="truncate max-w-[260px]">{order.address}</span>
                                                </span>
                                                {order.postalCode && (
                                                    <span className="text-[10px] text-gray-500 font-medium">
                                                        📮 Postal: <strong className="text-gray-700">{order.postalCode}</strong>
                                                    </span>
                                                )}
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
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         openOrderModal(order);
                                                     }}
                                                     className="p-2.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl transition-all shadow-sm"
                                                     title="View/Edit Details"
                                                 >
                                                     <FaEye />
                                                 </button>
                                                 <button
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setDeleteConfirmModal({ open: true, orderIds: [order.orderId] });
                                                     }}
                                                     className="p-2.5 bg-gray-100 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-all shadow-sm"
                                                     title="Delete Order"
                                                 >
                                                     <FaTrash className="text-xs" />
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
                    
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Courier Waybill Preview Button (Test without sending) */}
                        <button
                            type="button"
                            onClick={() => handlePreviewWaybills()}
                            className="bg-slate-800 hover:bg-slate-700 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                            title="Preview 9-per-A4 waybill stickers for selected orders without sending to courier"
                        >
                            <FaEye className="text-cyan-400 text-sm" />
                            <span>Preview Waybill</span>
                        </button>

                        {/* Courier Waybill Creation Button */}
                        {destination === "srilanka" ? (
                            <button
                                onClick={() => handleCreateWaybills()}
                                disabled={generatingWaybills || saving}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                title="Create parcels on Fardar courier and generate 9-per-A4 sticker sheet"
                            >
                                {generatingWaybills ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Sending to Courier...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTruck className="text-base" />
                                        <span>Create Waybill & Send to Courier</span>
                                    </>
                                )}
                            </button>
                        ) : destination === "all" ? (
                            <button
                                onClick={() => handleCreateWaybills()}
                                disabled={generatingWaybills || saving}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                title="Create Fardar courier waybills for Sri Lanka orders in selection"
                            >
                                {generatingWaybills ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTruck className="text-base" />
                                        <span>Create Courier Waybill (SL)</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="text-xs text-amber-300 font-bold px-3 py-1.5 bg-amber-950/60 border border-amber-800/80 rounded-xl flex items-center gap-1.5">
                                <span>⚠️</span> Fardar waybills for Sri Lanka orders only
                            </div>
                        )}

                        <div className="h-6 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

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
                            disabled={saving || generatingWaybills}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            {saving ? "Updating..." : "Update All Status"}
                        </button>

                        <button
                            onClick={() => setDeleteConfirmModal({ open: true, orderIds: [...selectedOrders] })}
                            disabled={saving || generatingWaybills || deletingOrders}
                            className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                            title="Delete selected orders"
                        >
                            <FaTrash className="text-sm" />
                            <span>Delete</span>
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
            {popupVisible && clickOrder && (() => {
                const country = (clickOrder.country || "Sri Lanka").trim();
                const isDomesticOrder = country.toLowerCase() === "sri lanka" || country.toLowerCase().includes("sri lanka");
                return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="shrink-0 px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    Order <span className="text-indigo-600">{clickOrder.orderId}</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <FaCalendarAlt /> Placed on {new Date(clickOrder.date).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmModal({ open: true, orderIds: [clickOrder.orderId] })}
                                    className="px-3.5 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"
                                    title="Delete this order"
                                >
                                    <FaTrash className="text-xs" />
                                    <span>Delete Order</span>
                                </button>
                                <button
                                    className="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-full flex items-center justify-center transition-all shadow-sm"
                                    onClick={() => setPopupVisible(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-8 custom-scrollbar">
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
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FaUser className="text-blue-500" /> Customer Information
                                            </h3>
                                            {!isEditingCustomer ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCustomerForm({
                                                            name: clickOrder.name || "",
                                                            phone: clickOrder.phone || "",
                                                            secondaryPhone: clickOrder.secondaryPhone || "",
                                                            address: clickOrder.address || "",
                                                            city: clickOrder.city || "",
                                                        });
                                                        setIsEditingCustomer(true);
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition-colors"
                                                    title="Edit customer details (Phone, Address, etc.)"
                                                >
                                                    <FaEdit className="text-xs" /> Edit Info
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveCustomerDetails}
                                                        disabled={savingCustomer}
                                                        className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                                                    >
                                                        <FaSave className="text-xs" /> {savingCustomer ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditingCustomer(false)}
                                                        disabled={savingCustomer}
                                                        className="px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!isEditingCustomer ? (
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
                                                        <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Primary Phone</p>
                                                        <p className={`font-bold ${isDomesticOrder && (!clickOrder.phone || clickOrder.phone.replace(/[^0-9]/g, "").length !== 10) ? "text-amber-600" : "text-gray-800"}`}>
                                                            {clickOrder.phone || "Not provided"}
                                                        </p>
                                                        {isDomesticOrder && clickOrder.phone && clickOrder.phone.replace(/[^0-9]/g, "").length !== 10 && (
                                                            <span className="inline-block text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded mt-1">
                                                                ⚠️ Invalid SL phone ({clickOrder.phone.replace(/[^0-9]/g, "").length} digits). Fardar Courier requires 10 digits for Sri Lanka deliveries! Click "Edit Info" to fix.
                                                            </span>
                                                        )}
                                                    </div>
                                                    {clickOrder.secondaryPhone && (
                                                        <div>
                                                            <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Secondary Phone</p>
                                                            <p className="font-bold text-gray-800">{clickOrder.secondaryPhone}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Delivery Address</p>
                                                    <p className="font-bold text-gray-800 text-sm leading-relaxed">{clickOrder.address}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-indigo-200 shadow-sm animate-in fade-in duration-150">
                                                <div>
                                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerForm.name}
                                                        onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1">
                                                            Primary Phone <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={customerForm.phone}
                                                            onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                                                            placeholder="0771234567"
                                                            className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                                        />
                                                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                                                            {isDomesticOrder ? "10 digits required for Sri Lanka courier (e.g. 077XXXXXXX)" : "International format accepted (e.g. +1 555-0123)"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1">
                                                            Secondary Phone
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={customerForm.secondaryPhone}
                                                            onChange={(e) => setCustomerForm(prev => ({ ...prev, secondaryPhone: e.target.value }))}
                                                            placeholder="Optional"
                                                            className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-wider block mb-1">
                                                        Delivery Address
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={customerForm.address}
                                                        onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                                                        className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                            {/* Destination & Country */}
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200/60">
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Delivery Destination</p>
                                                    {(() => {
                                                        const country = (clickOrder.country || "Sri Lanka").trim();
                                                        const isSL = country.toLowerCase() === "sri lanka" || country.toLowerCase().includes("sri lanka");
                                                        return isSL ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                                                                🇱🇰 Sri Lanka (Domestic)
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mt-1">
                                                                🌍 {country} (International)
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Postal / ZIP Code</p>
                                                    <p className="font-bold text-gray-800 text-sm mt-1">
                                                        {clickOrder.postalCode ? clickOrder.postalCode : <span className="text-gray-400 font-normal italic">Optional / Not provided</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    {/* Courier Information: Fardar Domestic vs International */}
                                    {isDomesticOrder ? (
                                        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-[13px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                                                    <FaTruck className="text-emerald-600" /> Courier Waybill (Fardar SL)
                                                </h3>
                                                {clickOrder.waybillNo && (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${clickOrder.orderId}`, "_blank")}
                                                        className="px-3 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                                        title="Print Waybill Sticker"
                                                    >
                                                        <FaPrint className="text-xs" /> Print Sticker
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Waybill Number</p>
                                                    <p className="font-black text-emerald-700 text-base mt-0.5">
                                                        {clickOrder.waybillNo ? (
                                                            clickOrder.waybillNo
                                                        ) : (
                                                            <span className="text-red-600 text-xs font-black uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-md border border-red-200 inline-block">
                                                                ⚠️ Not Created in Courier
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-gray-400 uppercase font-black tracking-tighter">Waybill Status</p>
                                                    <p className="font-bold text-gray-800 text-xs mt-1">
                                                        {clickOrder.waybillStatus ? (
                                                            <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 text-emerald-700 font-bold uppercase text-[10px]">
                                                                {clickOrder.waybillStatus}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic">None</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* If domestic order and no waybill yet, offer preview and create */}
                                            {!clickOrder.waybillNo && (
                                                <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(`${backendUrl}/orders/courier/preview-waybills?orderIds=${clickOrder.orderId}`, "_blank")}
                                                        className="flex-1 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                                        title="Preview how this waybill sticker looks without sending to courier"
                                                    >
                                                        <FaEye className="text-emerald-600 text-xs" />
                                                        <span>Preview Waybill</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCreateWaybills([clickOrder.orderId])}
                                                        disabled={generatingWaybills}
                                                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                                    >
                                                        {generatingWaybills ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaTruck className="text-xs" />}
                                                        <span>{generatingWaybills ? "Sending..." : "Create & Send"}</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-[13px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                                                    🌍 International Shipment
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase">
                                                    Overseas
                                                </span>
                                            </div>
                                            <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                                This order is destined for <strong>{country}</strong>. It is handled via overseas courier (DHL / FedEx / EMS), not Fardar Domestic Courier.
                                            </p>
                                            <div className="bg-white/80 rounded-xl p-3 border border-amber-200/80 text-xs text-amber-800 space-y-1">
                                                <p>• <strong>Courier:</strong> Dispatched via international shipping partner</p>
                                                <p>• <strong>Fardar API:</strong> Excluded (operates within Sri Lanka only)</p>
                                                <p>• <strong>Customer Phone:</strong> Foreign/overseas numbers are fully accepted</p>
                                            </div>
                                        </div>
                                    )}

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
                                                                src={item.image || item.images?.[0] || "/default-product.jpg"}
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
                );
            })()}

            {/* 🔹 Delete Confirmation Modal */}
            {deleteConfirmModal.open && (
                <div 
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => {
                        if (!deletingOrders) setDeleteConfirmModal({ open: false, orderIds: [] });
                    }}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 border border-red-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                                <FaTrash className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight">
                                    {deleteConfirmModal.orderIds.length === 1 
                                        ? `Delete Order #${deleteConfirmModal.orderIds[0]}` 
                                        : `Delete ${deleteConfirmModal.orderIds.length} Orders`}
                                </h3>
                                <p className="text-xs text-red-500 font-semibold mt-1">⚠️ Permanent database deletion</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            Are you sure you want to permanently delete {deleteConfirmModal.orderIds.length === 1 ? (
                                <>order <strong className="text-gray-900 font-mono">#{deleteConfirmModal.orderIds[0]}</strong></>
                            ) : (
                                <><strong className="text-gray-900 font-bold">{deleteConfirmModal.orderIds.length} selected orders</strong></>
                            )} from the database? This action cannot be undone.
                        </p>

                        {deleteConfirmModal.orderIds.length > 1 && (
                            <div className="max-h-24 overflow-y-auto bg-gray-50 rounded-xl p-2.5 text-xs text-gray-500 font-mono space-y-1 custom-scrollbar border border-gray-100">
                                {deleteConfirmModal.orderIds.map(id => (
                                    <span key={id} className="inline-block bg-white px-2 py-0.5 rounded border border-gray-200 mr-1.5 mb-1 text-[11px] font-bold text-gray-700">
                                        #{id}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                disabled={deletingOrders}
                                onClick={() => setDeleteConfirmModal({ open: false, orderIds: [] })}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deletingOrders}
                                onClick={handleDeleteOrders}
                                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-60"
                            >
                                {deletingOrders ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="text-xs" />
                                        <span>Yes, Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
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
