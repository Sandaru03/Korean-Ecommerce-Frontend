import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateSupplierAdminPage() {
    const location = useLocation();
    const sup = location.state || {};
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(sup.firstName || "");
    const [lastName, setLastName] = useState(sup.lastName || "");
    const [email, setEmail] = useState(sup.email || "");
    const [phone, setPhone] = useState(sup.phone || "Not Given");
    const [item, setItem] = useState(sup.item || "");

    async function handleSubmit() {
        if (!firstName || !lastName || !email) {
            toast.error("Please fill all the required fields");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You are not logged in");
            navigate("/login");
            return;
        }

        const supplierData = {
            firstName,
            lastName,
            phone: phone || "Not Given",
            item: item || "",
            // If you ever add password change, backend will hash it when provided.
            // password: newPassword
        };

        try {
            console.log("Sending supplier update with data:", supplierData);
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/suppliers/${encodeURIComponent(email)}`,
                supplierData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Supplier Updated:", response.data);
            toast.success("Supplier Successfully Updated");
            navigate("/admin/supplier");
        } catch (error) {
            console.error("Error updating supplier:", error);
            console.error("Message:", error.message);
            console.error("Response data:", error.response?.data);
            console.error("Status:", error.response?.status);

            if (error.response?.status === 404) {
                toast.error("Supplier not found. Check email");
            } else if (error.response?.status === 403) {
                toast.error("Access denied. Use Admin token");
            } else if (error.response?.status === 500) {
                toast.error("Server error. Check Backend logs.");
            } else if (error.response?.status === 401) {
                toast.error("Unauthorized. Token invalid or expired.");
            } else {
                toast.error(error.response?.data?.message || "Supplier update failed");
            }
        }
    }

    // If user navigated here directly without state
    if (!sup.email) {
        toast.error("Supplier data is not provided");
        navigate("/admin/supplier");
        return null;
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[600px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-4">Update Supplier</h2>

                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">First Name *</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border-[2px] h-[40px] rounded-md px-2"
                            required
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Last Name *</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border-[2px] h-[40px] rounded-md px-2"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Email *</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full border-[2px] h-[40px] rounded-md px-2 bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Optional"
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Item</label>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        placeholder="What do they supply?"
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                    />
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link
                        to="/admin/supplier"
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                        Update Supplier
                    </button>
                </div>
            </div>
        </div>
    );
}
