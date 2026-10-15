import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(null)

export const FREE_DELIVERY_THRESHOLD = 20000 // Free delivery threshold in LKR
export const STANDARD_DELIVERY_FEE = 400     // Standard delivery fee in LKR

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
                        ? { ...item, qty: item.qty + qty }
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

    // Total item count (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
    // Subtotal in LKR
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    // Free delivery check (subtotal >= 20000 LKR)
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD
    const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
    // Delivery fee: 400 LKR if subtotal < 20000 LKR, FREE (0) if 20000 LKR or more
    const deliveryFee = (subtotal > 0 && !isFreeDelivery) ? STANDARD_DELIVERY_FEE : 0
    // Grand total
    const grandTotal = subtotal + deliveryFee

    return (
        <CartContext.Provider value={{
            cart, addToCart, updateQty, removeFromCart, clearCart,
            totalItems, subtotal, deliveryFee, grandTotal,
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
