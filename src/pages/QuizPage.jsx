import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";
import { SkinTypeQuiz } from "@/components/coupang/SkinTypeQuiz";
import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function QuizPage() {
    const [heroImage, setHeroImage] = useState("/skin 2.jpg.jpeg");

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/quiz-banner`);
                if (data.success && data.banner && data.banner.quizPageImage) {
                    setHeroImage(data.banner.quizPageImage);
                }
            } catch (err) {
                console.error("Error fetching quiz banner config:", err);
            }
        };
        fetchBanner();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white overflow-x-clip">
            <Header />
            
            {/* Custom Hero Section for Quiz Page */}
            <div className="bg-gradient-to-br from-[#fff1f1] to-[#fdfbfb] py-12 md:py-20 border-b border-[#ffe4e4]">
                <div className="mx-auto max-w-[1040px] px-4 text-center md:text-left flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex-1 space-y-5">
                        <span className="inline-block px-4 py-1.5 bg-white text-primary text-[12px] font-black rounded-full shadow-sm tracking-wider uppercase border border-[#ffe4e4]">
                            Skin Assessment
                        </span>
                        <h1 className="text-3xl md:text-[44px] font-black text-[#111] tracking-tight leading-[1.15]">
                            Discover Your True <br className="hidden md:block" />
                            <span className="text-primary">Skin Profile</span>
                        </h1>
                        <p className="text-[#555] text-[15px] md:text-[17px] max-w-[500px] mx-auto md:mx-0 leading-relaxed font-medium">
                            Take our expertly crafted quiz to uncover your unique skin type and receive personalized Korean skincare recommendations tailored exactly to your needs.
                        </p>
                    </div>
                    <div className="flex-1 w-full max-w-[320px] md:max-w-none">
                        <div className="relative w-full rounded-[32px] overflow-hidden bg-white shadow-2xl p-2 md:p-3">
                             <img 
                                src={heroImage} 
                                alt="Skin Assessment" 
                                className="w-full h-auto block rounded-[24px] shadow-lg" 
                            />
                            {/* Decorative elements */}
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10"></div>
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Section */}
            <div className="mx-auto max-w-[1040px] px-4 py-8 md:py-12">
                <SkinTypeQuiz />
            </div>

            <Footer />
        </div>
    );
}
