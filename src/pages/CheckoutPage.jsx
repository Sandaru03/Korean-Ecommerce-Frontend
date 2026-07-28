import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { Loader2, ImagePlus, X, MessageCircle, Mail, ChevronLeft, Building2, CreditCard } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

export default function CheckoutPage() {
    const navigate = useNavigate()
    const { cart, clearCart, totalItems, subtotal, deliveryFee, grandTotal } = useCart()
    const { formatPrice } = useCurrency()

    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("Sri Lanka")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [addressLine, setAddressLine] = useState("")
    const [apartment, setApartment] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [phone, setPhone] = useState("")
    const [saveInfo, setSaveInfo] = useState(false)

    const [orderEmail, setOrderEmail] = useState("orders@yourbusiness.com")
    const [whatsappNumber, setWhatsappNumber] = useState("")
    const [loadingUser, setLoadingUser] = useState(true)

    const [paymentMethod, setPaymentMethod] = useState("bank") // 'bank' or 'online'
    const [sendingEmail, setSendingEmail] = useState(false)
    const [isSavingOrder, setIsSavingOrder] = useState(false)
    const [slipFile, setSlipFile] = useState(null)
    const [slipPreview, setSlipPreview] = useState(null)
    const [slipUrl, setSlipUrl] = useState(null)
    const [uploadingSlip, setUploadingSlip] = useState(false)

    // Redirect to cart if empty
    useEffect(() => {
        if (cart.length === 0) {
            navigate("/cart", { replace: true })
        }
    }, [cart.length, navigate])

    // Fetch user and config data
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { setLoadingUser(false); return }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const { firstName, lastName, phone: userPhone, email: userEmail, addressLine: uAddress, apartment: uApartment, city: uCity, postalCode: uPostalCode, country: uCountry } = res.data
                if (firstName && firstName !== "Not Provided") setFirstName(firstName)
                if (lastName && lastName !== "Not Provided") setLastName(lastName)
                if (userEmail && userEmail !== "Not Provided") setEmail(userEmail)
                if (userPhone && userPhone !== "Not Given" && userPhone !== "Not Provided") setPhone(userPhone)
                if (uAddress) setAddressLine(uAddress)
                if (uApartment) setApartment(uApartment)
                if (uCity) setCity(uCity)
                if (uPostalCode) setPostalCode(uPostalCode)
                if (uCountry) setCountry(uCountry)
            })
            .catch(() => { /* silently ignore */ })
            .finally(() => setLoadingUser(false))

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/app-configs`)
            .then(res => {
                if (res.data.orderEmail) setOrderEmail(res.data.orderEmail)
                if (res.data.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber)
            })
            .catch(err => console.error("Failed to fetch config:", err))
    }, [])

    const orderLines = cart.map(item =>
        `• ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}`
    ).join("\n")

    const deliveryLine = deliveryFee > 0
        ? `\nDelivery Fee: ${formatPrice(deliveryFee)} (${totalItems} items)`
        : "\nDelivery: Free"
        
    const buildFullName = () => `${firstName} ${lastName}`.trim()
    const buildFullAddress = () => `${addressLine}${apartment ? `, ${apartment}` : ''}, ${city}${postalCode ? ` - ${postalCode}` : ''}, ${country}`

    async function saveOrderToDb() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please log in to place an order.")
            return null
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                items: cart.map(item => ({ productId: item.productId, qty: item.qty })),
                address: buildFullAddress(),
                phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (saveInfo) {
                try {
                    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
                        firstName, lastName, phone, addressLine, apartment, city, postalCode, country
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } catch (err) {
                    console.error("Failed to update profile:", err)
                }
            }

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

    async function uploadSlipToServer() {
        if (!slipFile) return null
        setUploadingSlip(true)
        try {
            const formData = new FormData()
            formData.append("images", slipFile)
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload/local`, formData)
            const url = res.data.urls?.[0]
            if (url) setSlipUrl(url)
            return url
        } catch (err) {
            console.error("Slip upload failed:", err)
            toast.error("Failed to upload payment slip. Please try again.")
            return null
        } finally {
            setUploadingSlip(false)
        }
    }

    function handleSlipSelect(e) {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.")
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be under 10 MB.")
            return
        }
        setSlipFile(file)
        setSlipPreview(URL.createObjectURL(file))
        setSlipUrl(null)
    }

    function removeSlip() {
        setSlipFile(null)
        if (slipPreview) URL.revokeObjectURL(slipPreview)
        setSlipPreview(null)
        setSlipUrl(null)
    }

    const validateOrder = () => {
        if (!email || !lastName || !addressLine || !city || !phone) {
            toast.error("Please fill in all required delivery details.")
            return false
        }
        if (paymentMethod === 'bank' && !slipFile && !slipUrl) {
            toast.error("Please upload the payment slip for bank transfer.")
            return false
        }
        return true
    }

    async function handleWhatsApp() {
        if (!validateOrder()) return
        if (!whatsappNumber) {
            toast.error("WhatsApp number is not configured yet.")
            return
        }

        let finalSlipUrl = slipUrl
        if (paymentMethod === 'bank' && slipFile && !slipUrl) {
            finalSlipUrl = await uploadSlipToServer()
            if (!finalSlipUrl) return
        }

        const finalSlipLine = finalSlipUrl ? `\n\n📎 *Payment Slip:* ${finalSlipUrl}` : ""
        const finalSummary =
            `🛒 *New Order*\n\n` +
            `*Name:* ${buildFullName()}\n` +
            `*Phone:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Address:* ${buildFullAddress()}\n\n` +
            `*Items:*\n${orderLines}\n` +
            `${deliveryLine}\n` +
            `*Total: ${formatPrice(grandTotal)}*` +
            finalSlipLine

        const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalSummary)}`
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
            window.location.href = url
        }

        clearCart()
        window.scrollTo({ top: 0, behavior: "instant" })
        toast.success("Order recorded and WhatsApp opened! 🎉")
        navigate("/")
    }

    async function handleEmail() {
        if (!validateOrder()) return

        let finalSlipUrl = slipUrl
        if (paymentMethod === 'bank' && slipFile && !slipUrl) {
            finalSlipUrl = await uploadSlipToServer()
            if (!finalSlipUrl) return 
        }
        
        setIsSavingOrder(true)
        const order = await saveOrderToDb()
        if (!order) {
            setIsSavingOrder(false)
            return
        }
        
        setSendingEmail(true)
        
        const summaryText =
            `🛒 *New Order*\n\n` +
            `*Name:* ${buildFullName()}\n` +
            `*Phone:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Address:* ${buildFullAddress()}\n\n` +
            `*Items:*\n${orderLines}\n` +
            `${deliveryLine}\n` +
            `*Total: ${formatPrice(grandTotal)}*` +
            (finalSlipUrl ? `\n\n📎 *Payment Slip:* ${finalSlipUrl}` : "")

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app-configs/send-order-email`, {
                summary: summaryText,
                email: null,
                slipImageUrl: finalSlipUrl || null,
                orderData: {
                    name: buildFullName(),
                    phone,
                    email,
                    address: buildFullAddress(),
                    items: cart.map(item => ({
                        name: item.name,
                        image: item.image || null,
                        price: item.price,
                        qty: item.qty
                    })),
                    subtotal,
                    deliveryFee,
                    grandTotal,
                    totalItems
                }
            })
            clearCart()
            window.scrollTo({ top: 0, behavior: "instant" })
            toast.success("Order saved and email sent! 📧")
            navigate("/")
        } catch (err) {
            console.error("Email send failed:", err)
            clearCart()
            window.scrollTo({ top: 0, behavior: "instant" })
            toast.success("Order saved successfully! 🎉")
            toast.error("Admin notification failed, but your order is recorded.", { duration: 5000 })
            navigate("/")
        } finally {
            setSendingEmail(false)
            setIsSavingOrder(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
            <Header />

            <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-8 py-8 flex-1">
                <Link to="/cart" className="inline-flex items-center gap-1 text-[#555] hover:text-primary transition-colors text-[14px] font-medium mb-6">
                    <ChevronLeft className="h-4 w-4" /> Back to Cart
                </Link>

                <h1 className="text-3xl font-black text-[#111] mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column: Form & Payment */}
                    <div className="flex-1 w-full space-y-6">
                        
                        {/* Delivery Details */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#eee] overflow-hidden">
                            <div className="p-6 space-y-8">
                                {/* Contact Section */}
                                <div>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h2 className="text-xl font-bold text-[#111]">Contact</h2>
                                        {!localStorage.getItem("token") && (
                                            <Link to="/login" className="text-[14px] text-primary hover:underline font-medium">Sign in</Link>
                                        )}
                                        {loadingUser && (
                                            <span className="flex items-center gap-1 text-[12px] text-[#999]">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading profile…
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div>
                                    <h2 className="text-xl font-bold text-[#111] mb-4">Delivery</h2>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <label className="absolute text-[11px] text-[#555] top-1.5 left-3">Country/Region</label>
                                            <select
                                                value={country}
                                                onChange={e => setCountry(e.target.value)}
                                                className="w-full border border-[#ddd] rounded-md px-3 pb-2 pt-6 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none bg-white transition-all text-[#333]"
                                            >
                                                <option>Sri Lanka</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="First name (optional)"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last name"
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={addressLine}
                                            onChange={e => setAddressLine(e.target.value)}
                                            className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Apartment, suite, etc. (optional)"
                                            value={apartment}
                                            onChange={e => setApartment(e.target.value)}
                                            className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postal code (optional)"
                                                value={postalCode}
                                                onChange={e => setPostalCode(e.target.value)}
                                                className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                            />
                                        </div>

                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                        />

                                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={saveInfo}
                                                onChange={e => setSaveInfo(e.target.checked)}
                                                className="w-4 h-4 rounded border-[#ddd] text-primary focus:ring-primary cursor-pointer"
                                            />
                                            <span className="text-[14px] text-[#333]">Save this information for next time</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#eee] overflow-hidden">
                            <div className="bg-[#fafafa] px-6 py-4 border-b border-[#eee]">
                                <h2 className="font-bold text-[#111] text-[16px]">Payment Method</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Method Selector */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                                            paymentMethod === 'bank' 
                                            ? 'border-primary bg-red-50/50' 
                                            : 'border-[#eee] hover:border-[#ddd] bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-full ${paymentMethod === 'bank' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <span className={`font-bold ${paymentMethod === 'bank' ? 'text-primary' : 'text-[#333]'}`}>Bank Transfer</span>
                                        </div>
                                        <p className="text-[12px] text-[#666] leading-snug">Transfer directly to our bank account and upload your receipt.</p>
                                    </button>

                                    <button 
                                        onClick={() => setPaymentMethod('online')}
                                        className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                                            paymentMethod === 'online' 
                                            ? 'border-primary bg-red-50/50' 
                                            : 'border-[#eee] hover:border-[#ddd] bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-full ${paymentMethod === 'online' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <span className={`font-bold ${paymentMethod === 'online' ? 'text-primary' : 'text-[#333]'}`}>Online Payment</span>
                                        </div>
                                        <p className="text-[12px] text-[#666] leading-snug">Pay securely with Credit/Debit card.</p>
                                        
                                        <div className="flex items-center gap-[6px] mt-3">
                                            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6fd255c9aad5eeaad21fd6f7f7b4fdbdb1a35ce83b89cca12a187f00.svg" alt="Visa" className="h-[22px] w-[34px] object-contain border border-black/5 rounded-[3px]" />
                                            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d4efa50cf8626e8553c2b311353fbf67485f9c1a2b88d1.svg" alt="Mastercard" className="h-[22px] w-[34px] object-contain border border-black/5 rounded-[3px]" />
                                            <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0831827e90cd7bcda2836adc42a912ebedf545dead35b20.svg" alt="Amex" className="h-[22px] w-[34px] object-contain border border-black/5 rounded-[3px]" />
                                        </div>
                                    </button>
                                </div>

                                {/* Bank Details UI */}
                                {paymentMethod === 'bank' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4">
                                            <div className="flex items-center gap-2 text-blue-800 border-b border-blue-100 pb-3">
                                                <span className="text-[18px]">🏦</span>
                                                <p className="font-black text-[14px] uppercase tracking-tight">Commercial Bank (කොමර්ෂල් බැංකුව)</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest mb-1">Account Name</span>
                                                    <span className="text-[12px] font-bold text-slate-800 leading-tight">WEERASINGHE MUDIYANSELAGE KARUNADASA</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest mb-1">Account Number</span>
                                                    <span className="text-[15px] font-black text-blue-700 tracking-wider">8029797826</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest mb-1">Branch</span>
                                                    <span className="text-[13px] font-bold text-slate-800 uppercase">KATANA</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-2">
                                            <p className="font-bold text-[#111] text-[14px]">Upload Payment Slip <span className="text-primary ml-1">*</span></p>
                                            {!slipPreview ? (
                                                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#ddd] rounded-xl py-8 cursor-pointer hover:border-primary hover:bg-red-50/30 transition-all group">
                                                    <ImagePlus className="h-10 w-10 text-[#bbb] group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                                    <span className="text-[14px] text-[#777] group-hover:text-primary transition-colors font-medium">Click to upload payment slip</span>
                                                    <span className="text-[12px] text-[#aaa]">JPG, PNG — Max 10 MB</span>
                                                    <input type="file" accept="image/*" onChange={handleSlipSelect} className="hidden" />
                                                </label>
                                            ) : (
                                                <div className="relative border border-[#eee] rounded-xl overflow-hidden bg-[#f8f8f8] inline-block">
                                                    <img src={slipPreview} alt="Payment slip" className="max-w-full max-h-[300px] object-contain rounded-xl" />
                                                    <button
                                                        onClick={removeSlip}
                                                        className="absolute top-3 right-3 bg-white hover:bg-red-50 border border-[#eee] rounded-full p-2 shadow-md transition-colors group"
                                                    >
                                                        <X className="h-4 w-4 text-[#555] group-hover:text-primary" />
                                                    </button>
                                                    {uploadingSlip && (
                                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Online Payment Gateway Message */}
                                {paymentMethod === 'online' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-5">
                                        <div className="bg-[#fcfcfc] border border-[#eee] rounded-xl p-6 text-center">
                                            <div className="flex justify-center mb-3">
                                                <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <h3 className="text-[#111] font-bold text-[15px] mb-2">Secure Online Payment</h3>
                                            <p className="text-[#666] text-[13px]">
                                                After clicking "Place Order", you will be securely redirected to our payment gateway to complete your purchase.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-6 space-y-4">
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#eee] p-6">
                            <h3 className="font-bold text-[#111] text-[18px] mb-4 pb-3 border-b border-[#eee]">Order Summary</h3>
                            
                            {/* Items Preview */}
                            <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-start gap-3 text-[13px]">
                                        <div className="w-12 h-12 bg-[#f5f5f5] rounded-md overflow-hidden shrink-0 border border-[#eee]">
                                            <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#333] leading-snug line-clamp-2">{item.name}</p>
                                            <p className="text-[#777] mt-0.5">Qty: {item.qty}</p>
                                        </div>
                                        <div className="shrink-0 font-bold text-[#111]">
                                            {formatPrice(item.price * item.qty)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#eee] pt-4 space-y-3 text-[14px]">
                                <div className="flex justify-between text-[#555]">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="font-semibold text-[#111]">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[#555]">
                                    <span>Delivery</span>
                                    {deliveryFee > 0 ? (
                                        <span className="font-semibold text-primary">{formatPrice(deliveryFee)}</span>
                                    ) : (
                                        <span className="font-semibold text-[#16a34a]">FREE</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t-2 border-[#111] mt-4 pt-4 flex justify-between items-baseline mb-6">
                                <span className="font-bold text-[#111] text-[16px]">Total</span>
                                <p className="font-black text-[28px] text-[#111] leading-none">{formatPrice(grandTotal)}</p>
                            </div>

                            {/* Checkout Buttons */}
                            {paymentMethod === 'bank' ? (
                                <div className="space-y-3">
                                    <p className="font-bold text-[#111] text-[13px] text-center mb-1">Place Your Order Via</p>
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
                                        {isSavingOrder && !sendingEmail ? "Processing..." : "Order via WhatsApp"}
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
                                        {isSavingOrder ? "Processing..." : (sendingEmail ? "Sending Email..." : "Order via Email")}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-in fade-in duration-300">
                                    <button
                                        onClick={() => {
                                            toast.info("Payment Gateway Integration is coming soon! For now, please use Bank Transfer.");
                                        }}
                                        className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#111] hover:bg-[#333] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-gray-200"
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        Proceed to Payment
                                    </button>
                                    <p className="text-center text-[12px] text-[#666]">
                                        You will be redirected to our secure payment partner.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}
