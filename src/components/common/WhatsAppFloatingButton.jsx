import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

export function WhatsAppFloatingButton() {
    const location = useLocation();
    const [whatsappNumber, setWhatsappNumber] = useState("94713592022");
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        axios.get(`${backendUrl}/app-configs`)
            .then(res => {
                if (res.data?.whatsappNumber) {
                    setWhatsappNumber(res.data.whatsappNumber);
                }
            })
            .catch(() => {});
    }, []);

    // Only display on Shopping Cart (/cart) and Checkout (/checkout) pages
    const isCartOrCheckout = location.pathname.startsWith("/cart") || location.pathname.startsWith("/checkout");
    if (!isCartOrCheckout) {
        return null;
    }

    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const pageName = location.pathname.startsWith("/checkout") ? "Checkout" : "Cart";
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(`Hi! I'm on the ${pageName} page and need some help with my order.`)}`;

    return (
        <div className="fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom))] md:right-8 md:bottom-8 z-[90] flex flex-col items-end group">
            {/* Pop-up Message from the top of the button */}
            {isOpen && (
                <div className="relative mb-3 bg-white text-[#111] px-4 py-3 rounded-2xl shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18)] border border-[#eee] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 select-none">
                    {/* Online pulsing indicator */}
                    <div className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] md:text-[14px] font-semibold text-[#222] hover:text-[#25D366] transition-colors whitespace-nowrap cursor-pointer"
                    >
                        Need help? Chat with us! 👋
                    </a>

                    {/* Close button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        className="text-[#aaa] hover:text-[#555] p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="Dismiss"
                        aria-label="Dismiss message"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Speech bubble tail pointing down towards WhatsApp button */}
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#eee] rotate-45"></div>
                </div>
            )}

            {/* Hover tooltip if popup was closed */}
            {!isOpen && (
                <div className="relative mb-3 bg-white text-[#111] px-4 py-2 rounded-xl shadow-lg border border-[#eee] text-[13px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap">
                    Chat with us! 👋
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#eee] rotate-45"></div>
                </div>
            )}

            {/* Official WhatsApp Circular Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_28px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Chat with us on WhatsApp"
            >
                <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9 text-white drop-shadow-sm" />
            </a>
        </div>
    );
}
