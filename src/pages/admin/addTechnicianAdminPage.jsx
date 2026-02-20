import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddTechnicianAdminPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [salary, setSalary] = useState("");
    const [speciality, setSpeciality] = useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!firstName || !lastName || !email || !salary) {
            toast.error("Please fill all required fields");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/technicians",
                {
                    firstName,
                    lastName,
                    email,
                    phone: phone || "Not Given",
                    salary,
                    speciality
                    // password will be set to default (tech123) in backend
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Technician added successfully");
            navigate("/admin/technicians");
        } catch (err) {
            console.error("Error adding technician:", err);
            const msg = err?.response?.data?.message || "Failed to add technician";
            toast.error(msg);
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[600px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-4">Add New Technician</h2>

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
                    <label className="text-sm font-semibold">Salary *</label>
                    <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                        placeholder="e.g., 85000"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">Speciality</label>
                    <input
                        type="text"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        placeholder="e.g., CCTV, Networking"
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                    />
                </div>

                <div className="flex justify-center gap-4 py-4">
                    <Link
                        to="/admin/technicians"
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition"
                    >
                        Cancel
                    </Link>

                    <button
                        onClick={handleSubmit}
                        className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition cursor-pointer"
                    >
                        Add Technician
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Note: Default login password is <span className="font-semibold">tech123</span>.
                </p>
            </div>
        </div>
    );
}
