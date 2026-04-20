import { Link } from "react-router-dom";

export function QuizBanner() {
    return (
        <section className="mb-0 relative group overflow-hidden">
            <div className="min-w-full shrink-0 relative">
                <Link to="/quiz" className="block w-full h-full group/item overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />
                    <img 
                        src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop" 
                        alt="Skin Type Quiz" 
                        className="w-full h-[220px] md:h-[420px] object-cover block bg-[#f8f8f8] transition-transform duration-1000 group-hover/item:scale-105" 
                    />
                    <div className="absolute bottom-10 left-10 z-20 transition-all duration-500 transform translate-y-2 group-hover/item:translate-y-0 opacity-0 group-hover/item:opacity-100 hidden md:block">
                        <span className="px-6 py-2 bg-white text-black font-bold rounded-full shadow-lg text-sm uppercase tracking-wider">Take the Quiz</span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
