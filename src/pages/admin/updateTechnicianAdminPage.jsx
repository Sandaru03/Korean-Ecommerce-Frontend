import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateTechnicianAdminPage() {
    const location = useLocation();
    const tech = location.state || {};
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(tech.firstName || "");
    const [lastName, setLastName] = useState(tech.lastName || "");
    const [email] = useState(tech.email || "");
    const [phone, setPhone] = useState(tech.phone || "Not Given");
    const [salary, setSalary] = useState(tech.salary || "");
    const [speciality, setSpeciality] = useState(tech.speciality || "");
    const [newPassword, setNewPassword] = useState("");

    async function handleSubmit() {
        if (!firstName || !lastName || !email || !salary) {
            toast.error("Please fill all the fields");
            return;
        }

        const salaryNum = Number(salary);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            toast.error("Salary should be a positive number");
            return;
        }

        if (newPassword && newPassword.length < 6) {
            toast.error("New password should be at least 6 characters");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You are not login");
            navigate("/login");
            return;
        }

        const payload = {
            firstName,
            lastName,
            phone: phone || "Not Given",
            salary: salary.toString(),      // backend schema keeps salary as String
            speciality: speciality || "",
            ...(newPassword ? { password: newPassword } : {}) // backend hashes if provided
        };

        try {
            console.log("Updating technician with:", payload);
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/technicians/${encodeURIComponent(email)}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Technician Updated:", res.data);
            toast.success("Technician successfully updated");
            navigate("/admin/technicians");
        } catch (error) {
            console.error("Error updating technician:", error);
            console.error("Message:", error.message);
            console.error("Response data:", error.response?.data);
            console.error("Status:", error.response?.status);

            if (error.response?.status === 404) {
                toast.error("Technician not found, check email");
            } else if (error.response?.status === 403) {
                toast.error("Access denied. Use Admin token");
            } else if (error.response?.status === 500) {
                toast.error("Server error. Check backend logs");
            } else if (error.response?.status === 401) {
                toast.error("Unauthorized. Token invalid or expired");
            } else {
                toast.error(error.response?.data?.message || "Technician update failed");
            }
        }
    }

    if (!tech.email) {
        toast.error("Technician data is not given");
        navigate("/admin/technicians");
        return null;
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
            <div className="w-full max-w-[600px] h-[720px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center mb-4">Update Technician</h2>

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
                    <label className="text-sm font-semibold">Salary *</label>
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full border-[2px] h-[40px] rounded-md px-2"
                        min="0"
                        required
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold">New Password (optional)</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
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
                        Update Technician
                    </button>
                </div>
            </div>
        </div>
    );
}
