import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/coupang/header"
import { Footer } from "@/components/coupang/footer"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { Loader2, ImagePlus, X, MessageCircle, Mail, ChevronLeft, Building2, CreditCard, ChevronRight, ShieldCheck } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import toast from "react-hot-toast"
import axios from "axios"
import DistrictCitySelector from "@/components/common/DistrictCitySelector"
import deliveryData from "@/data/sriLankaDeliveryZones.json"
import { getDistrictDeliveryFee, calculatePackagingAndWeight, DISTRICT_DELIVERY_FEES } from "@/data/districtDeliveryRates"

export default function CheckoutPage() {
    const navigate = useNavigate()
    const { 
        cart, clearCart, totalItems, subtotal, deliveryFee, grandTotal,
        totalProductWeight: contextProductWeight,
        destinationType: cartDestinationType, setDestinationType: setCartDestinationType
    } = useCart()
    const { formatPrice } = useCurrency()

    const [email, setEmail] = useState("")
    const [destinationType, setDestinationType] = useState(cartDestinationType || "srilanka") // 'srilanka' or 'international'
    const [country, setCountry] = useState(cartDestinationType === "international" ? "" : "Sri Lanka")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [addressLine, setAddressLine] = useState("")
    const [apartment, setApartment] = useState("")
    const [district, setDistrict] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [phone, setPhone] = useState("")
    const [secondaryPhone, setSecondaryPhone] = useState("")
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
    const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState(false)

    function handleDestinationChange(type) {
        setDestinationType(type)
        if (setCartDestinationType) setCartDestinationType(type)
        if (type === "srilanka") {
            setCountry("Sri Lanka")
        } else {
            if (country === "Sri Lanka") setCountry("")
            setDistrict("")
        }
    }

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
                if (res.data.secondaryPhone && res.data.secondaryPhone !== "Not Given" && res.data.secondaryPhone !== "Not Provided") setSecondaryPhone(res.data.secondaryPhone)
                if (uAddress) setAddressLine(uAddress)
                if (uApartment) setApartment(uApartment)
                if (uCity) {
                    setCity(uCity)
                    // Auto-detect district if uCity matches any district's city list
                    if (deliveryData?.citiesByDistrict) {
                        for (const [distName, cityList] of Object.entries(deliveryData.citiesByDistrict)) {
                            if (cityList.some(c => c.name.toLowerCase() === uCity.toLowerCase())) {
                                setDistrict(distName)
                                break
                            }
                        }
                    }
                }
                if (uPostalCode) setPostalCode(uPostalCode)
                if (uCountry) {
                    if (uCountry.trim().toLowerCase() !== "sri lanka") {
                        setDestinationType("international")
                        if (setCartDestinationType) setCartDestinationType("international")
                        setCountry(uCountry)
                    } else {
                        setDestinationType("srilanka")
                        if (setCartDestinationType) setCartDestinationType("srilanka")
                        setCountry("Sri Lanka")
                    }
                }
            })
            .catch(() => { /* silently ignore */ })
            .finally(() => setLoadingUser(false))

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/app-configs`)
            .then(res => {
                if (res.data.orderEmail) setOrderEmail(res.data.orderEmail)
                if (res.data.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber)
            })
            .catch(err => console.error("Failed to fetch config:", err))
    }, [setCartDestinationType])

    const isDomestic = destinationType === "srilanka"
    const isFreeDelivery = isDomestic && subtotal >= 20000
    
    // Product net weight and packaging calculations
    const totalProductWeight = cart.reduce((sum, item) => sum + (Number(item.weight) || 0) * item.qty, 0)
    const packagingInfo = calculatePackagingAndWeight(totalProductWeight)
    const effectiveDeliveryFee = getDistrictDeliveryFee(district, subtotal, destinationType, totalProductWeight)
    const effectiveGrandTotal = subtotal + effectiveDeliveryFee

    const orderLines = cart.map(item =>
        `• ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}`
    ).join("\n")

    const weightDetail = packagingInfo.grossWeight > 0
        ? ` (${packagingInfo.grossWeight >= 1000 ? `${(packagingInfo.grossWeight / 1000).toFixed(2)}kg` : `${packagingInfo.grossWeight}g`} in ${packagingInfo.boxes} ${packagingInfo.boxes === 1 ? 'box' : 'boxes'})`
        : ""

    const deliveryLine = isDomestic
        ? (effectiveDeliveryFee > 0 
            ? `\nDelivery Fee: ${formatPrice(effectiveDeliveryFee)}${district ? ` (${district})` : ""}${weightDetail}` 
            : "\nDelivery: Free (Orders over LKR 20,000)")
        : "\nDelivery: Free (International)"
        
    const buildFullName = () => `${firstName} ${lastName}`.trim()
    const buildFullAddress = () => {
        const parts = [addressLine]
        if (apartment) parts.push(apartment)
        if (city) parts.push(city)
        if (isDomestic && district) parts.push(district)
        if (postalCode) parts.push(postalCode)
        parts.push(isDomestic ? "Sri Lanka" : country)
        return parts.filter(Boolean).join(", ")
    }

    async function saveOrderToDb() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please log in to place an order.")
            return null
        }

        const finalCountry = destinationType === "srilanka" ? "Sri Lanka" : (country.trim() || "International")
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                items: cart.map(item => ({ productId: item.productId, qty: item.qty })),
                address: buildFullAddress(),
                country: finalCountry,
                district: isDomestic ? district : null,
                city,
                postalCode: postalCode.trim() || null,
                phone,
                secondaryPhone,
                paymentMethod,
                email,
                firstName,
                lastName,
                deliveryFee: effectiveDeliveryFee,
                totalWeight: packagingInfo.grossWeight,
                boxesCount: packagingInfo.boxes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (saveInfo) {
                try {
                    await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
                        firstName, lastName, phone, secondaryPhone, addressLine, apartment, city, postalCode, country: finalCountry
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
        if (!email || !lastName || !addressLine || !phone) {
            toast.error("Please fill in all required delivery details (including phone number).")
            return false
        }
        if (destinationType === "srilanka") {
            if (!district) {
                toast.error("Please select your District.")
                return false
            }
            if (!city) {
                toast.error("Please select your Town/City.")
                return false
            }
        } else {
            if (!city || !city.trim()) {
                toast.error("Please enter your City.")
                return false
            }
            if (!country || !country.trim() || country.trim().toLowerCase() === "sri lanka") {
                toast.error("Please enter the destination country for international delivery.")
                return false
            }
            if (!postalCode || !postalCode.trim()) {
                toast.error("Postal / ZIP code is mandatory for international deliveries.")
                return false
            }
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
        const phoneLine = secondaryPhone 
            ? `*Primary Phone:* ${phone}\n*Secondary Phone:* ${secondaryPhone}` 
            : `*Phone:* ${phone}`
        const destinationLine = destinationType === "srilanka" 
            ? `*Delivery:* Sri Lanka (Domestic)${district ? `\n*District:* ${district}` : ""}${city ? `\n*Town/City:* ${city}` : ""}` 
            : `*Delivery:* ${country.trim()} (International)${postalCode ? `\n*Postal Code:* ${postalCode.trim()}` : ""}`

        const finalSummary =
            `🛒 *New Order*\n\n` +
            `*Name:* ${buildFullName()}\n` +
            `${phoneLine}\n` +
            `${destinationLine}\n` +
            `*Email:* ${email}\n` +
            `*Address:* ${buildFullAddress()}\n\n` +
            `*Items:*\n${orderLines}\n` +
            `${deliveryLine}\n` +
            `*Total: ${formatPrice(effectiveGrandTotal)}*` +
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
        
        const phoneLine = secondaryPhone 
            ? `*Primary Phone:* ${phone}\n*Secondary Phone:* ${secondaryPhone}` 
            : `*Phone:* ${phone}`
        const destinationLine = destinationType === "srilanka" 
            ? `*Delivery:* Sri Lanka (Domestic)${district ? `\n*District:* ${district}` : ""}${city ? `\n*Town/City:* ${city}` : ""}` 
            : `*Delivery:* ${country.trim()} (International)${postalCode ? `\n*Postal Code:* ${postalCode.trim()}` : ""}`

        const summaryText =
            `🛒 *New Order*\n\n` +
            `*Name:* ${buildFullName()}\n` +
            `${phoneLine}\n` +
            `${destinationLine}\n` +
            `*Email:* ${email}\n` +
            `*Address:* ${buildFullAddress()}\n\n` +
            `*Items:*\n${orderLines}\n` +
            `${deliveryLine}\n` +
            `*Total: ${formatPrice(effectiveGrandTotal)}*` +
            (finalSlipUrl ? `\n\n📎 *Payment Slip:* ${finalSlipUrl}` : "")

        const finalCountry = destinationType === "srilanka" ? "Sri Lanka" : (country.trim() || "International")

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/app-configs/send-order-email`, {
                summary: summaryText,
                email: email || null,
                slipImageUrl: finalSlipUrl || null,
                orderData: {
                    name: buildFullName(),
                    phone,
                    secondaryPhone,
                    email,
                    country: finalCountry,
                    postalCode: postalCode.trim() || null,
                    address: buildFullAddress(),
                    items: cart.map(item => ({
                        name: item.name,
                        image: item.image || null,
                        price: item.price,
                        qty: item.qty
                    })),
                    subtotal,
                    deliveryFee: effectiveDeliveryFee,
                    grandTotal: effectiveGrandTotal,
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
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#eee] overflow-visible">
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
                                    <div className="space-y-4">
                                        {/* Destination Selector */}
                                        <div className="space-y-2">
                                            <label className="block text-[13px] font-bold text-[#111]">
                                                Where should your package be delivered? <span className="text-primary">*</span>
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDestinationChange("srilanka")}
                                                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                                        destinationType === "srilanka"
                                                            ? "border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary shadow-sm"
                                                            : "border-[#ddd] bg-white text-[#555] hover:border-gray-400 font-medium"
                                                    }`}
                                                >
                                                    <span className="text-2xl">🇱🇰</span>
                                                    <div>
                                                        <p className="text-[14px] leading-snug">Deliver to Sri Lanka</p>
                                                        <p className="text-[11px] text-gray-500 font-normal">Domestic Delivery</p>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDestinationChange("international")}
                                                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                                        destinationType === "international"
                                                            ? "border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary shadow-sm"
                                                            : "border-[#ddd] bg-white text-[#555] hover:border-gray-400 font-medium"
                                                    }`}
                                                >
                                                    <span className="text-2xl">🌍</span>
                                                    <div>
                                                        <p className="text-[14px] leading-snug">Another Country</p>
                                                        <p className="text-[11px] text-gray-500 font-normal">International Delivery</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Country display / input */}
                                        {destinationType === "international" ? (
                                            <div>
                                                <label className="block text-[12px] font-bold text-[#333] mb-1">
                                                    Destination Country <span className="text-primary">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter country name (e.g. Australia, United Kingdom, USA, Maldives)"
                                                    value={country === "Sri Lanka" ? "" : country}
                                                    onChange={e => setCountry(e.target.value)}
                                                    className="w-full border-2 border-primary/40 rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#888] bg-white font-medium"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <label className="absolute text-[11px] text-[#555] top-1.5 left-3">Country / Region</label>
                                                <div className="w-full border border-[#ddd] bg-gray-50/90 rounded-md px-3 pb-2 pt-6 text-[14px] font-semibold text-[#333] flex items-center gap-2">
                                                    <span>🇱🇰</span> Sri Lanka (Domestic Delivery)
                                                </div>
                                            </div>
                                        )}

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

                                        {destinationType === "srilanka" ? (
                                            <>
                                                <DistrictCitySelector
                                                    selectedDistrict={district}
                                                    selectedCity={city}
                                                    onSelectDistrict={setDistrict}
                                                    onSelectCity={setCity}
                                                />
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Postal code (optional)"
                                                        value={postalCode}
                                                        onChange={e => setPostalCode(e.target.value)}
                                                        className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={city}
                                                    onChange={e => setCity(e.target.value)}
                                                    className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                                />
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Postal / ZIP code *"
                                                        value={postalCode}
                                                        onChange={e => setPostalCode(e.target.value)}
                                                        className="w-full border-2 border-amber-400 bg-amber-50/40 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#888] font-medium"
                                                    />
                                                    <span className="text-[10px] text-amber-700 font-semibold block mt-1">Required for international</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <input
                                                    type="tel"
                                                    placeholder="Primary Phone *"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="tel"
                                                    placeholder="Secondary Phone (optional)"
                                                    value={secondaryPhone}
                                                    onChange={e => setSecondaryPhone(e.target.value)}
                                                    className="w-full border border-[#ddd] rounded-md px-3 py-3 text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#666]"
                                                />
                                            </div>
                                        </div>

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
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${paymentMethod === 'online' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <span className={`font-bold ${paymentMethod === 'online' ? 'text-primary' : 'text-[#333]'}`}>Online Payment</span>
                                            </div>
                                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
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
                                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-center space-y-3">
                                            <div className="flex justify-center">
                                                <div className="h-12 w-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shadow-inner">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-800 px-2.5 py-0.5 rounded-full mb-1">Coming Soon</span>
                                                <h3 className="text-[#111] font-bold text-[15px]">Direct Card Payments Under Integration</h3>
                                            </div>
                                            <p className="text-[#666] text-[13px] max-w-md mx-auto leading-relaxed">
                                                Our automated gateway for Visa, Mastercard, and Amex is currently being finalized. For now, please use <strong>Bank Transfer</strong> to complete your order.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('bank')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-red-800 transition shadow-sm"
                                            >
                                                <Building2 className="w-3.5 h-3.5" /> Switch to Bank Transfer
                                            </button>
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
                                <div className="flex justify-between items-center text-[#555]">
                                    <div>
                                        <span>Delivery</span>
                                        {packagingInfo.grossWeight > 0 && isDomestic && (
                                            <span className="block text-[11px] text-gray-400 font-normal">
                                                Weight: {packagingInfo.grossWeight >= 1000 ? `${(packagingInfo.grossWeight / 1000).toFixed(2)} kg` : `${packagingInfo.grossWeight}g`} ({packagingInfo.boxes} {packagingInfo.boxes === 1 ? 'box' : 'boxes'})
                                            </span>
                                        )}
                                    </div>
                                    {effectiveDeliveryFee > 0 ? (
                                        <div className="text-right">
                                            <span className="font-semibold text-primary">{formatPrice(effectiveDeliveryFee)}</span>
                                            {district ? (
                                                <span className="block text-[11px] text-gray-500 font-normal">{district} District</span>
                                            ) : (
                                                <span className="block text-[10px] text-gray-400 font-normal">Base fee</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <span className="font-bold text-[#16a34a]">FREE</span>
                                            {isDomestic && (
                                                <span className="block text-[10px] text-[#16a34a] font-medium">Over {formatPrice(20000)}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t-2 border-[#111] mt-4 pt-4 flex justify-between items-baseline mb-6">
                                <span className="font-bold text-[#111] text-[16px]">Total</span>
                                <p className="font-black text-[28px] text-[#111] leading-none">{formatPrice(effectiveGrandTotal)}</p>
                            </div>

                            {/* Checkout Buttons */}
                            {paymentMethod === 'bank' ? (
                                <div className="space-y-3 pt-1">
                                    {/* Modern Header */}
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                                            Place Your Order Via
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                            <ShieldCheck className="h-3 w-3" /> Secure Order
                                        </span>
                                    </div>

                                    {/* Primary Button: WhatsApp */}
                                    <button
                                        onClick={handleWhatsApp}
                                        disabled={isSavingOrder || sendingEmail}
                                        className="group relative w-full p-3.5 bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(22,163,74,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-between text-left overflow-hidden border border-emerald-400/30"
                                    >
                                        {/* Subtle ambient lighting on hover */}
                                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                                        <div className="flex items-center gap-3.5 min-w-0 z-10">
                                            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
                                                {isSavingOrder && !sendingEmail ? (
                                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                                ) : (
                                                    <FaWhatsapp className="h-6 w-6 text-white drop-shadow-sm" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-extrabold text-[15px] leading-tight text-white tracking-tight block">
                                                    {isSavingOrder && !sendingEmail ? "Processing Order..." : "Order via WhatsApp"}
                                                </span>
                                                <p className="text-[11px] text-emerald-100 truncate font-medium mt-0.5">
                                                    Direct chat & instant payment verification
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2 z-10" />
                                    </button>

                                    {/* Primary Button: Email (Matching WhatsApp UI) */}
                                    <button
                                        onClick={handleEmail}
                                        disabled={isSavingOrder || sendingEmail}
                                        className="group relative w-full p-3.5 bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-between text-left overflow-hidden border border-blue-400/30"
                                    >
                                        {/* Subtle ambient lighting on hover */}
                                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                                        <div className="flex items-center gap-3.5 min-w-0 z-10">
                                            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
                                                {isSavingOrder || sendingEmail ? (
                                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                                ) : (
                                                    <Mail className="h-6 w-6 text-white drop-shadow-sm" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-extrabold text-[15px] leading-tight text-white tracking-tight block">
                                                    {isSavingOrder ? "Processing..." : (sendingEmail ? "Sending Email..." : "Order via Email")}
                                                </span>
                                                <p className="text-[11px] text-blue-100 truncate font-medium mt-0.5">
                                                    Receive order confirmation to your inbox
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2 z-10" />
                                    </button>

                                    {/* Trust micro-text */}
                                    <div className="pt-1.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
                                        <span>📎</span>
                                        <span>Your bank slip will be automatically attached</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-in fade-in duration-300">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentGatewayModal(true)}
                                        className="w-full flex items-center justify-center gap-3 h-[52px] bg-[#111] hover:bg-[#333] text-white font-bold text-[15px] rounded-xl transition-colors shadow-md shadow-gray-200"
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        Proceed to Payment
                                    </button>
                                    <p className="text-center text-[12px] text-amber-700 font-medium">
                                        Card payment gateway is coming soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Modal Popup */}
            {showPaymentGatewayModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowPaymentGatewayModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setShowPaymentGatewayModal(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Icon Header */}
                        <div className="flex flex-col items-center text-center space-y-3 pt-2">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            
                            <span className="inline-block text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                                Coming Soon 🚀
                            </span>

                            <h3 className="text-xl font-black text-gray-900">
                                Card Payment Gateway
                            </h3>

                            <p className="text-sm text-gray-600 leading-relaxed px-2">
                                Our automated online payment gateway for <strong className="text-gray-900">Visa, Mastercard & Amex</strong> is currently under integration and will be available soon!
                            </p>

                            <div className="w-full bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 text-xs text-gray-700 text-left space-y-1 my-1">
                                <p className="font-bold text-gray-900 flex items-center gap-1.5">
                                    <span>💡</span> How to order right now:
                                </p>
                                <p className="text-gray-600 pl-5">
                                    Please choose <strong>Bank Transfer</strong> to transfer directly to our account and place your order instantly via <strong>WhatsApp</strong> or <strong>Email</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 space-y-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod('bank')
                                    setShowPaymentGatewayModal(false)
                                    toast.success("Switched to Bank Transfer!")
                                }}
                                className="w-full h-12 bg-primary hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-red-200/50 flex items-center justify-center gap-2"
                            >
                                <Building2 className="w-4 h-4" />
                                Switch to Bank Transfer & Place Order
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPaymentGatewayModal(false)}
                                className="w-full h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    )
}
