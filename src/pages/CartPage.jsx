import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Mail, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

const WHATSAPP_NUMBER = "94771234567" // ← Change this to your WhatsApp number (94 = Sri Lanka code)
const ORDER_EMAIL = "orders@yourbusiness.com" // ← Change this to your order email

function fmt(num) {
    return new Intl.NumberFormat("en-IN").format(num)
}

function CheckoutModal({ onClose, cart, subtotal, deliveryFee, grandTotal, totalItems }) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [loadingUser, setLoadingUser] = useState(true)
    const { clearCart } = useCart()

    // Auto-fill name and phone from the logged-in user's profile
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { setLoadingUser(false); return }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const { firstName, lastName, phone: userPhone } = res.data
                if (firstName || lastName) setName([firstName, lastName].filter(Boolean).join(" "))
                if (userPhone && userPhone !== "Not Given") setPhone(userPhone)
            })
            .catch(() => { /* silently ignore — user can fill manually */ })
            .finally(() => setLoadingUser(false))
    }, [])


    const orderLines = cart.map(item =>
        `• ${item.name} x${item.qty} — Rs. ${fmt(item.price * item.qty)}`
    ).join("\n")

    const deliveryLine = deliveryFee > 0
        ? `\nDelivery Fee: Rs. ${fmt(deliveryFee)} (${totalItems} items)`
        : "\nDelivery: Free"

    const summaryText =
        `🛒 *New Order*\n\n` +
        `*Name:* ${name || "—"}\n` +
        `*Phone:* ${phone || "—"}\n` +
        `*Address:* ${address || "—"}\n\n` +
        `*Items:*\n${orderLines}\n` +
        `${deliveryLine}\n` +
        `*Total: Rs. ${fmt(grandTotal)}*`

    function handleWhatsApp() {
        if (!name || !phone || !address) {
            toast.error("Please fill in all fields before ordering.")
            return
        }
        const encoded = encodeURIComponent(summaryText)
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank")
        clearCart()
        toast.success("Order sent via WhatsApp! 🎉")
        onClose()
    }

    function handleEmail() {
        if (!name || !phone || !address) {
            toast.error("Please fill in all fields before ordering.")
            return
        }
        const subject = encodeURIComponent("New Order — Korean Store")
        const body = encodeURIComponent(summaryText.replace(/\*/g, ""))
        window.open(`mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`)
        clearCart()
        toast.success("Opening email client to send your order!")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#ff1268] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white font-black text-[20px]">Checkout</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-[24px] leading-none">×</button>
                </div>

                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Order Summary */}
                    <div className="bg-[#f8f8f8] rounded-xl p-4 space-y-2">
                        <p className="font-bold text-[#111] text-[14px] mb-2">Order Summary</p>
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-[13px] text-[#555]">
                                <span className="truncate max-w-[70%]">{item.name} × {item.qty}</span>
                                <span className="font-semibold text-[#111]">Rs. {fmt(item.price * item.qty)}</span>
                            </div>
                        ))}
                        <div className="border-t border-[#eee] pt-2 mt-2 space-y-1">
                            <div className="flex justify-between text-[13px] text-[#555]">
                                <span>Subtotal</span>
                                <span>Rs. {fmt(subtotal)}</span>
                            </div>
                            {deliveryFee > 0 && (
                                <div className="flex justify-between text-[13px] text-[#e2211c] font-semibold">
                                    <span>Delivery Fee ({totalItems} items)</span>
                                    <span>Rs. {fmt(deliveryFee)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[16px] font-black text-[#111] pt-1 border-t border-[#ddd]">
                                <span>Total</span>
                                <span>Rs. {fmt(grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-[#111] text-[14px]">Your Details</p>
                            {loadingUser && (
                                <span className="flex items-center gap-1 text-[12px] text-[#999]">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading profile…
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-[#ff1268] outline-none pr-24"
                            />
                            {name && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#f0fff4] text-[#16a34a] font-bold px-2 py-0.5 rounded-full border border-[#b2f5cb]">
                                    From account
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-[#ff1268] outline-none pr-24"
                            />
                            {phone && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#f0fff4] text-[#16a34a] font-bold px-2 py-0.5 rounded-full border border-[#b2f5cb]">
                                    From account
                                </span>
                            )}
                        </div>
                        <textarea
                            placeholder="Delivery Address *"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            rows={3}
                            className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-[#ff1268] outline-none resize-none"
                        />
                    </div>

                    {/* Order Options */}
                    <div className="space-y-3 pt-1">
                        <p className="font-bold text-[#111] text-[14px]">Place Your Order Via</p>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#25D366] hover:bg-[#20BB5A] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-green-200"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Order via WhatsApp
                        </button>
                        <button
                            onClick={handleEmail}
                            className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-blue-200"
                        >
                            <Mail className="h-5 w-5" />
                            Order via Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CartPage() {
    const navigate = useNavigate()
    const { cart, updateQty, removeFromCart, totalItems, subtotal, deliveryFee, grandTotal } = useCart()
    const [showCheckout, setShowCheckout] = useState(false)

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
                    <ShoppingBag className="h-20 w-20 text-[#ddd]" strokeWidth={1} />
                    <p className="text-[22px] font-bold text-[#aaa]">Your cart is empty</p>
                    <p className="text-[14px] text-[#bbb]">Add products from the store to continue.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-[#ff1268] text-white px-8 py-3 rounded-full font-bold text-[14px] hover:bg-[#e00d59] transition"
                    >
                        Continue Shopping
                    </button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
            <Header />

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    cart={cart}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    grandTotal={grandTotal}
                    totalItems={totalItems}
                />
            )}

            {/* Breadcrumb */}
            <div className="bg-white border-b border-[#eee]">
                <div className="mx-auto max-w-[1040px] px-4 py-3 flex items-center gap-2 text-[12px] text-[#777]">
                    <Link to="/" className="hover:text-[#111] transition">Home</Link>
                    <ChevronRight className="h-3 w-3 text-[#ccc]" />
                    <span className="text-[#333] font-medium">Shopping Cart</span>
                </div>
            </div>

            <div className="mx-auto max-w-[1040px] px-4 py-10 w-full">
                <h1 className="text-[28px] font-black text-[#111] mb-8">Shopping Cart <span className="text-[18px] font-normal text-[#999]">({totalItems} items)</span></h1>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white border border-[#eee] rounded-xl p-5 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
                                {/* Image */}
                                <div className="w-[90px] h-[90px] shrink-0 rounded-lg overflow-hidden border border-[#eee] bg-[#f8f8f8]">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                                            <ShoppingBag className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[#111] text-[15px] leading-snug mb-1 line-clamp-2">{item.name}</p>
                                    <p className="text-[#ff1268] font-black text-[18px] mb-3">Rs. {fmt(item.price)}</p>

                                    {/* Qty Controls */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-[#ddd] rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                className="w-9 h-9 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-10 text-center text-[14px] font-bold text-[#111]">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                                className="w-9 h-9 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => { removeFromCart(item.id); toast.success("Item removed") }}
                                            className="flex items-center gap-1 text-[13px] text-[#e2211c] hover:underline"
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Line Total */}
                                <div className="shrink-0 text-right">
                                    <p className="text-[12px] text-[#999]">Item Total</p>
                                    <p className="font-black text-[18px] text-[#111]">Rs. {fmt(item.price * item.qty)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 sticky top-6 space-y-4">
                        {/* Delivery Fee Notice */}
                        {totalItems >= 3 && (
                            <div className="bg-[#fff5f5] border border-[#ffc8c8] rounded-xl p-4 flex gap-3 items-start">
                                <AlertCircle className="h-5 w-5 text-[#e2211c] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold text-[#e2211c]">Delivery Fee Applied</p>
                                    <p className="text-[12px] text-[#e2211c]/80 mt-0.5">
                                        Orders with 3 or more items include a Rs. 500 delivery charge.
                                    </p>
                                </div>
                            </div>
                        )}
                        {totalItems < 3 && (
                            <div className="bg-[#f0fff4] border border-[#b2f5cb] rounded-xl p-4 flex gap-3 items-start">
                                <AlertCircle className="h-5 w-5 text-[#16a34a] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold text-[#16a34a]">Free Delivery!</p>
                                    <p className="text-[12px] text-[#16a34a]/80 mt-0.5">
                                        Orders under 3 items ship free. 3 or more items adds a Rs. 500 delivery fee.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="bg-white rounded-xl border border-[#eee] p-5 shadow-sm">
                            <h3 className="font-bold text-[#111] text-[16px] mb-4 pb-3 border-b border-[#eee]">Order Summary</h3>
                            <div className="space-y-2.5 text-[14px]">
                                <div className="flex justify-between text-[#555]">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="font-semibold text-[#111]">Rs. {fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[#555]">
                                    <span>Delivery</span>
                                    {deliveryFee > 0 ? (
                                        <span className="font-semibold text-[#e2211c]">Rs. {fmt(deliveryFee)}</span>
                                    ) : (
                                        <span className="font-semibold text-[#16a34a]">FREE</span>
                                    )}
                                </div>
                            </div>
                            <div className="border-t-2 border-[#111] mt-4 pt-4 flex justify-between items-baseline">
                                <span className="font-bold text-[#111] text-[15px]">Total</span>
                                <div className="text-right">
                                    <p className="text-[11px] text-[#999]">LKR</p>
                                    <p className="font-black text-[28px] text-[#111] leading-none">Rs. {fmt(grandTotal)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCheckout(true)}
                                className="w-full mt-5 h-[52px] bg-[#ff1268] hover:bg-[#e00d59] text-white font-bold text-[16px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
                            >
                                Proceed to Checkout
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <Link
                                to="/"
                                className="w-full mt-3 h-[44px] border border-[#ddd] text-[#555] font-semibold text-[14px] rounded-xl hover:bg-[#f5f5f5] transition flex items-center justify-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
