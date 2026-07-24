import { Link } from "react-router-dom";
import { PackagePlus, ArrowRight } from "lucide-react";

export function RequestProductCTA() {
    return (
        <section className="mx-auto max-w-[1040px] px-4 mb-14 md:mb-16">
            <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-primary to-rose-700 text-white shadow-xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-rose-400 opacity-30 blur-2xl pointer-events-none"></div>
                
                <div className="relative z-10 px-6 py-10 sm:py-12 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    <div className="flex items-center gap-6 text-center md:text-left flex-col sm:flex-row">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 shrink-0 shadow-inner">
                            <PackagePlus className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-[28px] font-black tracking-tight mb-2">
                                Looking for a specific product?
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
                                Can't find your favorite Korean skincare item in our catalog? Let us know, and our team will do our best to source it exclusively for you!
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Link 
                            to="/request-product" 
                            className="group flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-rose-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Request a Product
                            <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
