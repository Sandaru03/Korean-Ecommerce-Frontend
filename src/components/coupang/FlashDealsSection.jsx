import { useState, useEffect } from "react";
import { CommonProductCard } from "@/components/coupang/CommonProductCard";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function FlashDealsSection() {
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${backendUrl}/flash-deals`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.deal?.active && d.deal?.products?.length > 0) {
                    setDeal(d.deal);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || !deal) return null;

    const products = deal.products || [];

    return (
        <section className="mb-0">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 md:mb-5 px-0">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-[22px] font-black text-[#111] tracking-tight">{deal.title}</h2>
                </div>
            </div>

            {/* Products — Desktop: 5 per row, Mobile: 2-row swippable grid (identical to TimeDealsSection) */}
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 overflow-y-hidden">
                <div className="
                    grid grid-rows-2 grid-flow-col gap-3
                    md:grid-rows-1 md:grid-cols-5 md:grid-flow-row md:gap-4
                    min-w-max md:min-w-full
                ">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="w-[160px] md:w-full"
                        >
                            <CommonProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
