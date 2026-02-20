import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../../components/admin-utils/paginator";
import Loader from "../../components/admin-utils/loader";
import toast from "react-hot-toast";

export default function OrdersPageAdmin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickOrder, setClickOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("pending");
    const [ordernotes, setOrderNotes] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${page}/${limit}`
            );
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, limit]);

    return (
        <div className="w-full h-full flex flex-col p-6">
            {loading ? (
                <div className="w-full h-full flex justify-center items-center text-xl font-semibold">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Order ID
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Customer Name
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Email
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Address
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Phone
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Status
                                    </th>
                                    <th className="p-3 text-left font-semibold border-b border-gray-300">
                                        Date
                                    </th>
                                    <th className="p-3 text-right font-semibold border-b border-gray-300">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-300 text-black transition-transform hover:-translate-y-1 duration-200 hover:bg-red-400 hover:text-white cursor-pointer"
                                            onClick={() => {
                                                setOrderStatus(order.status);
                                                setOrderNotes(order.notes);
                                                setClickOrder(order);
                                                setPopupVisible(true);
                                            }}
                                        >
                                            <td className="p-3">{order.orderId}</td>
                                            <td className="p-3">{order.name}</td>
                                            <td className="p-3">{order.email}</td>
                                            <td className="p-3">{order.address}</td>
                                            <td className="p-3">{order.phone}</td>
                                            <td className="p-3">{order.status}</td>
                                            <td className="p-3">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-right font-medium text-gray-800">
                                                $ {order.total}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center p-6 text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* 🔹 Popup */}
                        {popupVisible && clickOrder && (
                            <div className="fixed top-0 left-0 w-full h-full bg-[#00000050] flex justify-center items-center z-50">
                                <div className="w-[700px] h-[80vh] bg-white rounded-2xl shadow-xl relative p-6 flex flex-col">

                                    {/* Save Changes Button */}
                                    {(orderStatus !== clickOrder.status ||
                                        ordernotes !== clickOrder.notes) && (
                                            <button
                                                className="absolute top-3 right-2 w-[150px] h-[40px] bg-gray-700 text-white rounded-lg cursor-pointer"
                                                onClick={async () => {
                                                    try {
                                                        await axios.put(
                                                            `${import.meta.env.VITE_BACKEND_URL}/orders/${clickOrder.orderId}`,
                                                            {
                                                                status: orderStatus,
                                                                notes: ordernotes,
                                                            }
                                                        );
                                                        toast.success("Order Updated Successfully");
                                                        fetchOrders();
                                                        setPopupVisible(false);
                                                    } catch (err) {
                                                        console.error(err);
                                                        toast.error("Failed to update order");
                                                    }
                                                }}
                                            >
                                                Save Changes
                                            </button>
                                        )}


                                    {/* Close Button */}
                                    <button
                                        className="absolute w-[35px] h-[35px] bg-red-500 border-2 border-red-600 text-white top-[-20px] right-[-20px] rounded-full cursor-pointer hover:bg-transparent hover:text-red-500 font-bold flex items-center justify-center"
                                        onClick={() => setPopupVisible(false)}
                                    >
                                        ✕
                                    </button>

                                    {/* 🔹 Scrollable Content */}
                                    <div className="overflow-y-auto pr-2 flex-1">
                                        {/* Order Header */}
                                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                            Order Details -{" "}
                                            <span className="text-red-600">{clickOrder.orderId}</span>
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Placed on: {new Date(clickOrder.date).toLocaleString()}
                                        </p>

                                        {/* Customer Info */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                                Customer Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                                <p>
                                                    <span className="font-medium">Name:</span>{" "}
                                                    {clickOrder.name}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Email:</span>{" "}
                                                    {clickOrder.email}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    {clickOrder.phone}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Address:</span>{" "}
                                                    {clickOrder.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Status */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                                Order Status
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${clickOrder.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : ""
                                                    } ${clickOrder.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : ""
                                                    } ${clickOrder.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : ""
                                                    }`}
                                            >
                                                {clickOrder.status}
                                            </span>
                                            <select
                                                className="ml-4 p-1 border rounded text-gray-700"
                                                value={orderStatus}
                                                onChange={(e) => setOrderStatus(e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                                Notes
                                            </h3>
                                            <p className="text-sm text-gray-600 italic">
                                                {clickOrder.notes}
                                            </p>
                                            <textarea
                                                className="w-full h-[50px] p-2 border rounded mt-2 text-gray-700"
                                                value={ordernotes}
                                                onChange={(e) => setOrderNotes(e.target.value)}
                                            ></textarea>
                                        </div>

                                        {/* Items */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                                Items
                                            </h3>
                                            <div className="space-y-4">
                                                {clickOrder.items.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className="flex items-center gap-4 p-3 border rounded-lg shadow-sm"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.productName}
                                                            className="w-16 h-16 object-cover rounded-md border"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">
                                                                {item.productName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.qty}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-gray-700">
                                                            $ {item.price * item.qty}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total (fixed bottom) */}
                                    <div className="flex justify-between items-center border-t pt-4 mt-2">
                                        <span className="text-xl font-bold text-gray-800">Total</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            $ {clickOrder.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Paginator
                            currentPage={page}
                            totalPages={totalPages}
                            setCurrentPage={setPage}
                            limit={limit}
                            setLimit={setLimit}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
