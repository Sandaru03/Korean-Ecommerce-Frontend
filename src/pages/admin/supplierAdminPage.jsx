import { useEffect, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/admin-utils/loader";

export default function SupplierAdminPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // popup/form state
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [requiredDate, setRequiredDate] = useState("");
    const [note, setNote] = useState(""); // 🆕 new note field
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/suppliers", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSuppliers(res.data || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load suppliers");
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]); // setIsLoading(true) after delete will refetch

    const openRequestPopup = (sup) => {
        setSelectedSupplier(sup);
        setItemName(sup?.item || "");
        setQuantity(1);
        setRequiredDate("");
        setNote(""); // clear note
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setSelectedSupplier(null);
        setItemName("");
        setQuantity(1);
        setRequiredDate("");
        setNote("");
        setSending(false);
    };

    const today = new Date().toISOString().split("T")[0];

    const handleSendRequest = async () => {
        if (!selectedSupplier) return;

        // basic validation
        if (!itemName.trim()) {
            toast.error("Item name is required");
            return;
        }
        const qtyNum = Number(quantity);
        if (!Number.isFinite(qtyNum) || qtyNum <= 0 || !Number.isInteger(qtyNum)) {
            toast.error("Quantity must be a positive whole number");
            return;
        }
        if (!requiredDate) {
            toast.error("Required date is required");
            return;
        }
        if (requiredDate < today) {
            toast.error("Required date cannot be in the past");
            return;
        }

        try {
            setSending(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/suppliers/${encodeURIComponent(
                    selectedSupplier.email
                )}/request`,
                {
                    item: itemName.trim(),
                    quantity: qtyNum,
                    requiredDate,
                    note: note.trim() || null, // 🆕 send note
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Request email sent to supplier");
            closePopup();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send request");
            setSending(false);
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
                                <th className="p-4">Item</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {suppliers.map((sup) => (
                                <tr
                                    key={sup.email}
                                    className="border-b hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => openRequestPopup(sup)}
                                    title="Click to send a request"
                                >
                                    <td className="p-4 font-medium text-gray-900">{sup.firstName}</td>
                                    <td className="p-4 font-medium text-gray-900">{sup.lastName}</td>
                                    <td className="p-4 text-gray-700">{sup.email}</td>
                                    <td className="p-4 text-gray-700">{sup.phone}</td>
                                    <td className="p-4 text-gray-700">{sup.item}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <BiTrash
                                                className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent opening the popup
                                                    const token = localStorage.getItem("token");
                                                    if (!token) {
                                                        navigate("/login");
                                                        return;
                                                    }

                                                    axios
                                                        .delete(
                                                            import.meta.env.VITE_BACKEND_URL +
                                                            "/suppliers/" +
                                                            encodeURIComponent(sup.email),
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        )
                                                        .then(() => {
                                                            toast.success("Supplier deleted successfully");
                                                            setIsLoading(true); // trigger refetch
                                                        })
                                                        .catch((err) => {
                                                            console.error(err);
                                                            toast.error("Failed to delete supplier");
                                                        });
                                                }}
                                            />

                                            <BiEditAlt
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent opening the popup
                                                    navigate("/admin/updatesupplier", { state: sup });
                                                }}
                                                className="bg-gray-700 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-gray-900 transition"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {suppliers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-gray-500">
                                        No suppliers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Link
                to="/admin/newsupplier"
                className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
                title="Add new supplier"
            >
                <HiMiniPlusCircle className="text-5xl" />
            </Link>

            {/* Popup Form */}
            {popupVisible && selectedSupplier && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex justify-center items-center z-50">
                    <div className="w-[700px] max-w-[95%] bg-white rounded-2xl shadow-2xl relative p-6">
                        {/* Close */}
                        <button
                            className="absolute w-[35px] h-[35px] bg-red-500 border-2 border-red-600 text-white top-[-20px] right-[-20px] rounded-full cursor-pointer hover:bg-transparent hover:text-red-500 font-bold flex items-center justify-center"
                            onClick={closePopup}
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold mb-1 text-gray-800">
                            Send Purchase Request
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Supplier:{" "}
                            <span className="font-semibold">
                                {selectedSupplier.firstName} {selectedSupplier.lastName}
                            </span>{" "}
                            (<span className="text-blue-700">{selectedSupplier.email}</span>)
                        </p>

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="e.g., CCTV Camera Model X"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="e.g., 10"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Required Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                                    value={requiredDate}
                                    onChange={(e) => setRequiredDate(e.target.value)}
                                    min={today}
                                />
                            </div>

                            {/* 🆕 Note Field */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Note (Optional)
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-black"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Any special instructions or details..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-end md:col-span-2">
                                <button
                                    className="w-full h-[42px] cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleSendRequest}
                                    disabled={sending}
                                >
                                    {sending ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <p className="text-xs text-gray-500 mt-4">
                            A formatted email with these details will be sent to the supplier.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
