import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddAdminAdminPage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("Admin");
    const [lastName, setLastName] = useState("User");
    const [phone, setPhone] = useState("Not Given");
    const navigate = useNavigate();

    async function handleSubmit() {
        if (!email) {
            toast.error("Email is required");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/users/create-admin",
                { email, firstName, lastName, phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Admin Added Successfully");
            navigate("/admin/add-admin");
        } catch (err) {
            console.error("Error adding admin:", err);
            toast.error("Failed to add admin");
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[600px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-4">Add New Admin</h2>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                    />
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link
                        to="/admin/add-admin"
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                        Add Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
