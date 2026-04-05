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
        <div className="w-full py-4 md:py-12 px-2">
            {/* Desktop Horizontal View */}
            <div className="hidden md:flex relative items-center justify-between">
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
                                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform-gpu
                                    ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : ''}
                                    ${isActive ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-300 scale-110 ring-4 ring-emerald-50' : ''}
                                    ${isFuture ? 'bg-white text-gray-300 border-2 border-gray-100' : ''}
                                `}
                            >
                                <Icon 
                                    size={24} 
                                    className={`${isActive ? 'animate-pulse' : ''} ${step.id === 'processing' && isActive ? 'animate-spin-slow' : ''}`} 
                                />
                            </div>

                            {/* Label */}
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-25 text-center">
                                <p 
                                    className={`
                                        text-[11px] font-black uppercase tracking-tighter transition-colors duration-300 leading-tight
                                        ${isActive ? 'text-gray-900' : 'text-gray-400'}
                                        ${isCompleted ? 'text-gray-600' : ''}
                                    `}
                                >
                                    {step.label}
                                </p>
                                {isActive && <div className="h-0.5 w-6 bg-emerald-500 mx-auto mt-1 rounded-full" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Vertical View */}
            <div className="md:hidden space-y-4 px-4">
                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isFuture = idx > activeIndex;

                    return (
                        <div key={step.id} className="relative flex items-start gap-4">
                            {/* Connector Line */}
                            {idx < STEPS.length - 1 && (
                                <div className={`absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2 z-0 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                            )}

                            {/* Icon Container */}
                            <div 
                                className={`
                                    relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0
                                    ${isCompleted ? 'bg-emerald-500 text-white shadow-md' : ''}
                                    ${isActive ? 'bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-50 scale-110' : ''}
                                    ${isFuture ? 'bg-white text-gray-300 border-2 border-gray-100' : ''}
                                `}
                            >
                                <Icon 
                                    size={18} 
                                    className={`${isActive ? 'animate-pulse' : ''} ${step.id === 'processing' && isActive ? 'animate-spin-slow' : ''}`} 
                                />
                            </div>

                            {/* Label and Info */}
                            <div className="pt-2">
                                <p 
                                    className={`
                                        text-xs font-bold uppercase tracking-tight transition-colors duration-300
                                        ${isActive ? 'text-gray-900 font-black' : 'text-gray-400'}
                                        ${isCompleted ? 'text-gray-600' : ''}
                                    `}
                                >
                                    {step.label}
                                </p>
                                {isActive && <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Current Status</p>}
                                {isCompleted && <p className="text-[10px] text-gray-400">Step Completed</p>}
                            </div>
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
