import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Mail, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"


function fmt(num) {
    return new Intl.NumberFormat("en-IN").format(num)
}

function CheckoutModal({ onClose, cart, subtotal, deliveryFee, grandTotal, totalItems }) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [whatsappNumber, setWhatsappNumber] = useState("94771234567")
    const [orderEmail, setOrderEmail] = useState("orders@yourbusiness.com")
    const [loadingUser, setLoadingUser] = useState(true)
    const [sendingEmail, setSendingEmail] = useState(false)
    const [isSavingOrder, setIsSavingOrder] = useState(false)
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

        // Fetch config from backend
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/config`)
            .then(res => {
                if (res.data.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber)
                if (res.data.orderEmail) setOrderEmail(res.data.orderEmail)
            })
            .catch(err => console.error("Failed to fetch config:", err))
    }, [])


    const orderLines = cart.map(item =>
        `• ${item.name} x${item.qty} — LKR ${fmt(item.price * item.qty)}`
    ).join("\n")

    const deliveryLine = deliveryFee > 0
        ? `\nDelivery Fee: LKR ${fmt(deliveryFee)} (${totalItems} items)`
        : "\nDelivery: Free"

    const summaryText =
        `🛒 *New Order*\n\n` +
        `*Name:* ${name || "—"}\n` +
        `*Phone:* ${phone || "—"}\n` +
        `*Address:* ${address || "—"}\n\n` +
        `*Items:*\n${orderLines}\n` +
        `${deliveryLine}\n` +
        `*Total: LKR ${fmt(grandTotal)}*`

    async function saveOrderToDb() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please log in to place an order.")
            return null
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                items: cart.map(item => ({ productId: item.productId, qty: item.qty })),
                address,
                phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            return res.data
        } catch (err) {
            console.error("Order storage failed:", err)
            if (err.response?.status === 401) {
                toast.error("Your session has expired. Please log in again.")
            } else {
                toast.error("Failed to record order in database. Please try again.")
            }
            return null
        }
    }

    async function handleWhatsApp() {
        if (!name || !phone || !address) {
            toast.error("Please fill in all fields before ordering.")
            return
        }

        // Clean number for wa.me (numbers only)
        const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(summaryText)}`

        // Open window synchronously to bypass popup blockers (esp Safari/mobile)
        const waWindow = window.open('about:blank', '_blank')

        setIsSavingOrder(true)
        const order = await saveOrderToDb()
        setIsSavingOrder(false)
        
        if (!order) {
            if (waWindow) waWindow.close()
            return
        }

        if (waWindow) {
            waWindow.location.href = url
        } else {
            // Fallback if synchronously blocked anyway
            window.location.href = url
        }

        clearCart()
        window.scrollTo({ top: 0, behavior: "instant" })
        toast.success("Order recorded and WhatsApp opened! 🎉")
        onClose()
    }

    async function handleEmail() {
        if (!name || !phone || !address) {
            toast.error("Please fill in all fields before ordering.")
            return
        }
        
        setIsSavingOrder(true)
        const order = await saveOrderToDb()
        if (!order) {
            setIsSavingOrder(false)
            return
        }
        
        setSendingEmail(true)
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/config/send-order-email`, {
                summary: summaryText,
                email: orderEmail
            })
            clearCart()
            window.scrollTo({ top: 0, behavior: "instant" })
            toast.success("Order saved and email sent! 📧")
            onClose()
        } catch (err) {
            console.error("Email send failed:", err)
            toast.error("Order saved, but email notification failed. Please try WhatsApp.")
        } finally {
            setSendingEmail(false)
            setIsSavingOrder(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary px-6 py-4 flex items-center justify-between">
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
                                <span className="font-semibold text-[#111]">LKR {fmt(item.price * item.qty)}</span>
                            </div>
                        ))}
                        <div className="border-t border-[#eee] pt-2 mt-2 space-y-1">
                            <div className="flex justify-between text-[13px] text-[#555]">
                                <span>Subtotal</span>
                                <span>LKR {fmt(subtotal)}</span>
                            </div>
                            {deliveryFee > 0 && (
                                <div className="flex justify-between text-[13px] text-primary font-semibold">
                                    <span>Delivery Fee ({totalItems} items)</span>
                                    <span>LKR {fmt(deliveryFee)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[16px] font-black text-[#111] pt-1 border-t border-[#ddd]">
                                <span>Total</span>
                                <span>LKR {fmt(grandTotal)}</span>
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
                                className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-primary outline-none pr-24"
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
                                className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-primary outline-none pr-24"
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
                            className="w-full border border-[#ddd] rounded-lg px-4 py-3 text-[14px] focus:border-primary outline-none resize-none"
                        />
                    </div>

                    {/* Order Options */}
                    <div className="space-y-3 pt-1">
                        <p className="font-bold text-[#111] text-[14px]">Place Your Order Via</p>
                        <button
                            onClick={handleWhatsApp}
                            disabled={isSavingOrder || sendingEmail}
                            className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#25D366] hover:bg-[#20BB5A] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSavingOrder && !sendingEmail ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <MessageCircle className="h-5 w-5" />
                            )}
                            {isSavingOrder && !sendingEmail ? "Saving Order..." : "Order via WhatsApp"}
                        </button>
                        <button
                            onClick={handleEmail}
                            disabled={isSavingOrder || sendingEmail}
                            className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSavingOrder || sendingEmail ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Mail className="h-5 w-5" />
                            )}
                            {isSavingOrder ? "Saving Order..." : (sendingEmail ? "Sending Email..." : "Order via Email")}
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
    const [contactNumber, setContactNumber] = useState("94742216579")

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/config`)
            .then(res => {
                if (res.data.whatsappNumber) setContactNumber(res.data.whatsappNumber)
            })
            .catch(err => console.error("Failed to fetch contact number:", err))
    }, [])

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

            {/* Floating WhatsApp Button - Upgraded Premium Version - Always Visible */}
            <a 
                href={`https://wa.me/${contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(cart.length > 0 ? "Hi! I have some questions about the items in my cart." : "Hi! I'm browsing your store and have some questions.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 right-10 z-[100] group flex items-center justify-end"
            >
                {/* Friendly Floating Label */}
                <div className="bg-white text-[#111] px-6 py-3 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] mr-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-10 group-hover:translate-x-0 font-bold text-[15px] pointer-events-none border border-[#f0f0f0] whitespace-nowrap tracking-tight ring-1 ring-black/5">
                    Need help? Chat with us! 👋
                </div>

                {/* Animated Button */}
                <div className="relative">
                    {/* Subtle Ping Animation */}
                    <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
                    
                    {/* Main Button with Gradient and Authentic WhatsApp Icon */}
                    <div className="relative bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-4.5 rounded-full shadow-[0_20px_40px_-10px_rgba(37,211,102,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-500 active:scale-95 ring-4 ring-white flex items-center justify-center">
                        <svg 
                            viewBox="0 0 24 24" 
                            className="h-9 w-9 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </div>
                </div>
            </a>

            {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
                    <ShoppingBag className="h-20 w-20 text-[#ddd]" strokeWidth={1} />
                    <p className="text-[22px] font-bold text-[#aaa]">Your cart is empty</p>
                    <p className="text-[14px] text-[#bbb]">Add products from the store to continue.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-primary text-white px-8 py-3 rounded-full font-bold text-[14px] hover:bg-red-800 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>

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
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain bg-[#f8f8f8]" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                                            <ShoppingBag className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[#111] text-[15px] leading-snug mb-1 line-clamp-2">{item.name}</p>
                                    <p className="text-primary font-black text-[18px] mb-3">LKR {fmt(item.price)}</p>

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
                                            className="flex items-center gap-1 text-[13px] text-primary hover:underline"
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Line Total */}
                                <div className="shrink-0 text-right">
                                    <p className="text-[12px] text-[#999]">Item Total</p>
                                    <p className="font-black text-[18px] text-[#111]">LKR {fmt(item.price * item.qty)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 sticky top-6 space-y-4">
                        {/* Delivery Fee Notice */}
                        {totalItems > 0 && totalItems < 3 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
                                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold text-primary">Delivery Fee Applied</p>
                                    <p className="text-[12px] text-primary/80 mt-0.5">
                                        Orders with less than 3 items include a LKR 500 delivery charge. Add {3 - totalItems} more {3 - totalItems === 1 ? 'item' : 'items'} for free delivery!
                                    </p>
                                </div>
                            </div>
                        )}
                        {totalItems >= 3 && (
                            <div className="bg-[#f0fff4] border border-[#b2f5cb] rounded-xl p-4 flex gap-3 items-start">
                                <AlertCircle className="h-5 w-5 text-[#16a34a] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold text-[#16a34a]">Free Delivery!</p>
                                    <p className="text-[12px] text-[#16a34a]/80 mt-0.5">
                                        You've unlocked free delivery for ordering 3 or more items!
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
                                    <span className="font-semibold text-[#111]">LKR {fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[#555]">
                                    <span>Delivery</span>
                                    {deliveryFee > 0 ? (
                                        <span className="font-semibold text-primary">LKR {fmt(deliveryFee)}</span>
                                    ) : (
                                        <span className="font-semibold text-[#16a34a]">FREE</span>
                                    )}
                                </div>
                            </div>
                            <div className="border-t-2 border-[#111] mt-4 pt-4 flex justify-between items-baseline">
                                <span className="font-bold text-[#111] text-[15px]">Total</span>
                                <div className="text-right">
                                    <p className="text-[11px] text-[#999]">LKR</p>
                                    <p className="font-black text-[28px] text-[#111] leading-none">LKR {fmt(grandTotal)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCheckout(true)}
                                className="w-full mt-5 h-[52px] bg-primary hover:bg-red-800 text-white font-bold text-[16px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50"
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
                </>
            )}

            <Footer />
        </div>
    )
}
