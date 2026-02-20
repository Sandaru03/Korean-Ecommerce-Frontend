import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddSupplier() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [item, setItem] = useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        // Required validations
        if (!firstName || !lastName || !email) {
            toast.error("Please fill all required fields");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const supplierData = {
            firstName,
            lastName,
            email,
            phone: phone || "Not Given",
            item,
            // Password will be set to default ("supplier123") in the backend
        };

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/suppliers",
                supplierData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Supplier added successfully");
            navigate("/admin/supplier");
        } catch (err) {
            console.error("Error adding supplier:", err);
            const msg =
                err?.response?.data?.message || "Failed to add supplier";
            toast.error(msg);
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[600px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-4">Add New Supplier</h2>

                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">First Name *</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border-[2px] h-[40px] rounded-md px-2"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-semibold">Last Name *</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border-[2px] h-[40px] rounded-md px-2"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
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
                        Add Supplier
                    </button>
                </div>
            </div>
        </div>
    );
}
