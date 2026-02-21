import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function CartPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login", { state: { from: "/cart" } })
        }
    }, [navigate])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h1>
                <p className="text-gray-500">Cart functionality coming soon.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}
