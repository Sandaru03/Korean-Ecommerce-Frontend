import { X, Plus, Minus } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function SideCart() {
    const { 
        cart, 
        isCartOpen, 
        setIsCartOpen, 
        updateQty, 
        removeFromCart, 
        subtotal, 
        deliveryFee,
        grandTotal,
        totalItems
    } = useCart()
    const { formatPrice } = useCurrency()
    const navigate = useNavigate()

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isCartOpen])

    if (!isCartOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sliding Panel */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                        <p className="text-sm text-gray-500 mt-1">{totalItems} items</p>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <X className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-lg font-medium text-gray-500">Your cart is empty.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 items-start relative group">
                                <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-2 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={item.image || "/placeholder.png"} 
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-8">
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{item.name}</h3>
                                    <p className="font-bold text-primary text-sm mb-3">{formatPrice(item.price)}</p>
                                    
                                    {/* Qty Controls */}
                                    <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                                        <button 
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                            className="px-3 py-1 text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors rounded-l-lg disabled:opacity-50"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold text-gray-700">
                                            {item.qty}
                                        </span>
                                        <button 
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                            className="px-3 py-1 text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors rounded-r-lg"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="absolute right-0 top-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span className="flex items-center">
                                    Delivery
                                    {totalItems > 0 && totalItems < 3 && (
                                        <span className="text-primary text-[11px] ml-2 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                                            Add {3 - totalItems} more {3 - totalItems === 1 ? 'item' : 'items'} for FREE
                                        </span>
                                    )}
                                </span>
                                <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "FREE"}</span>
                            </div>
                            <div className="flex justify-between font-black text-lg text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total:</span>
                                <span>{formatPrice(grandTotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsCartOpen(false)
                                navigate('/cart')
                            }}
                            className="w-full h-[52px] bg-primary hover:bg-red-700 text-white font-bold text-base rounded-xl transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 mt-4"
                        >
                            View Cart & Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
