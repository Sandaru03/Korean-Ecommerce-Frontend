import React from 'react';
import { CheckCircle2, RefreshCcw, Flag, Rocket, MapPin } from 'lucide-react';

const STEPS = [
    { id: 'pending', label: 'Pending', icon: RefreshCcw },
    { id: 'payment_completed', label: 'Payment completed', icon: CheckCircle2 },
    { id: 'processing', label: 'Processing', icon: RefreshCcw },
    { id: 'shipped', label: 'Shipped', icon: Flag },
    { id: 'in_transit', label: 'In transit', icon: Rocket },
    { id: 'delivered', label: 'Delivered', icon: MapPin },
];

export function OrderProgressTracker({ status }) {
    // Standardize status for comparison
    const currentStatus = status?.toLowerCase().replace(/\s+/g, '_') || 'pending';
    
    // Find index of current status
    const currentIndex = STEPS.findIndex(step => step.id === currentStatus);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="w-full py-12 px-2">
            <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                
                {/* Progress Line */}
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isFuture = idx > activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            {/* Icon Container */}
                            <div 
                                className={`
                                    w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform-gpu
                                    ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : ''}
                                    ${isActive ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-300 scale-110 ring-4 ring-emerald-50' : ''}
                                    ${isFuture ? 'bg-white text-gray-300 border-2 border-gray-100' : ''}
                                `}
                            >
                                <Icon 
                                    size={isActive ? 24 : 20} 
                                    className={`${isActive ? 'animate-pulse' : ''} ${step.id === 'processing' && isActive ? 'animate-spin-slow' : ''}`} 
                                />
                            </div>

                            {/* Label */}
                            <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 w-15 sm:w-25 text-center">
                                <p 
                                    className={`
                                        text-[8px] sm:text-[11px] font-bold sm:font-black uppercase tracking-tighter transition-colors duration-300 leading-tight
                                        ${isActive ? 'text-gray-900' : 'text-gray-400'}
                                        ${isCompleted ? 'text-gray-600' : ''}
                                    `}
                                >
                                    {step.label}
                                </p>
                                {isActive && <div className="h-0.5 w-6 bg-emerald-500 mx-auto mt-1 rounded-full" />}
                            </div>

                            {/* Connecting Line Dots (for mobile specifically or extra detail) */}
                            {idx < STEPS.length - 1 && (
                                <div className={`hidden sm:block absolute top-1/2 left-[calc(100%+0.5rem)] w-4 h-1 -translate-y-1/2 ${isFuture ? 'bg-gray-100' : 'bg-emerald-500/20'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}} />
        </div>
    );
}
