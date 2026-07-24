import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Header } from '@/components/coupang/header';
import { Footer } from '@/components/coupang/footer';

export default function ProductRequestPage() {
    const [formData, setFormData] = useState({
        productName: '',
        sourceUrl: '',
        message: '',
        name: '',
        mobileNumber: ''
    });
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.productName || !formData.name || !formData.mobileNumber) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/product-requests`, formData);
            toast.success("Product request submitted successfully!");
            setFormData({
                productName: '',
                sourceUrl: '',
                message: '',
                name: '',
                mobileNumber: ''
            });
        } catch (error) {
            console.error("Error submitting product request:", error);
            toast.error("Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-primary selection:text-white">
            <Header />

            <div className="relative flex-grow flex items-center justify-center p-4 bg-background overflow-hidden py-16">
                {/* Subtle background circles for a premium feel */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl transition-all duration-[3000ms] animate-pulse delay-1000 pointer-events-none" />

                <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black text-[#111] tracking-tight mb-3">Request a Product</h1>
                        <p className="text-sm text-gray-400 font-medium tracking-tight">Can't find what you're looking for? Let us know and we'll try to get it for you!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="productName" className="text-[13px] font-bold text-[#111] ml-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    placeholder="e.g., Laneige Lip Sleeping Mask"
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="sourceUrl" className="text-[13px] font-bold text-[#111] ml-1">
                                    Source URL <span className="text-gray-400 font-normal">(Where did you see it?)</span>
                                </label>
                                <input
                                    type="url"
                                    id="sourceUrl"
                                    name="sourceUrl"
                                    value={formData.sourceUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-[13px] font-bold text-[#111] ml-1">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Samee and Sandu"
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="mobileNumber" className="text-[13px] font-bold text-[#111] ml-1">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    placeholder="+94 XX XXX XXXX"
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="message" className="text-[13px] font-bold text-[#111] ml-1">
                                    Additional Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Any specific details, variant, shade, etc."
                                    className="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 resize-y"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#2a55ce]'}`}
                        >
                            {loading ? 'Submitting Request...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
