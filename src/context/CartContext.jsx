import { createContext, useContext, useState, useEffect } from "react"
import { getDistrictDeliveryFee, calculatePackagingAndWeight, FREE_DELIVERY_THRESHOLD } from "@/data/districtDeliveryRates"

const CartContext = createContext(null)

export { FREE_DELIVERY_THRESHOLD }
export const STANDARD_DELIVERY_FEE = 400     // Standard base delivery fee in LKR

export function CartProvider({ children }) {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart")
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    // Add item to cart — if already exists, increase quantity
    function addToCart(product, qty = 1) {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + qty, weight: Number(product.weight) || Number(item.weight) || 0 }
                        : item
                )
            }
            // Parse images safely
            let images = product.images
            if (typeof images === "string") {
                try { images = JSON.parse(images) } catch { images = [images] }
            }
            if (!Array.isArray(images)) images = []

            return [...prev, {
                id: product.id,
                productId: product.productId,
                name: product.name,
                price: Number(product.price),
                image: images[0] || null,
                weight: Number(product.weight) || 0,
                qty,
            }]
        })
    }

    function updateQty(id, newQty) {
        if (newQty < 1) return removeFromCart(id)
        setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item))
    }

    function removeFromCart(id) {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    function clearCart() {
        setCart([])
    }

    const [destinationType, setDestinationType] = useState(() => {
        try {
            return localStorage.getItem("destinationType") || "srilanka"
        } catch {
            return "srilanka"
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem("destinationType", destinationType)
        } catch {}
    }, [destinationType])

    const isDomestic = destinationType === "srilanka"

    // Total item count (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
    // Subtotal in LKR
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    // Total product weight in grams
    const totalProductWeight = cart.reduce((sum, item) => sum + (Number(item.weight) || 0) * item.qty, 0)
    // Packaging info (boxes, box tare weight, gross shipping weight)
    const packagingInfo = calculatePackagingAndWeight(totalProductWeight)
    // Free delivery check (threshold is 20000 LKR in Sri Lanka)
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD
    const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
    // Delivery fee: based on domestic, subtotal, and total gross weight
    const deliveryFee = (isDomestic && subtotal > 0 && !isFreeDelivery) 
        ? getDistrictDeliveryFee("", subtotal, destinationType, totalProductWeight) 
        : 0
    // Grand total
    const grandTotal = subtotal + deliveryFee

    return (
        <CartContext.Provider value={{
            cart, addToCart, updateQty, removeFromCart, clearCart,
            totalItems, subtotal, totalProductWeight, packagingInfo,
            deliveryFee, grandTotal,
            destinationType, setDestinationType, isDomestic,
            isFreeDelivery, freeDeliveryRemaining,
            freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
            standardDeliveryFee: STANDARD_DELIVERY_FEE,
            isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}
