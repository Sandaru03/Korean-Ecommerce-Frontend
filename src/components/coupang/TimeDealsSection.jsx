import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CommonProductCard } from "@/components/coupang/CommonProductCard";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Live countdown hook
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!targetDate) { setTimeLeft(null); return; }

        const calc = () => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft({ expired: true, h: "00", m: "00", s: "00" });
            const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
            setTimeLeft({ expired: false, h, m, s });
        };

        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return timeLeft;
}

function CountdownTimer({ targetDate }) {
    const t = useCountdown(targetDate);
    if (!t) return null;
    if (t.expired) {
        return (
            <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                Deal Ended
            </span>
        );
    }
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:block">Ends in</span>
            {[t.h, t.m, t.s].map((unit, i) => (
                <span key={i} className="flex items-center gap-0.5">
                    <span className="min-w-[32px] text-center bg-[#111] text-white text-[13px] font-black rounded-md px-1.5 py-0.5 tabular-nums">
                        {unit}
                    </span>
                    {i < 2 && <span className="text-[#111] font-black text-sm">:</span>}
                </span>
            ))}
        </div>
    );
}

export function TimeDealsSection() {
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${backendUrl}/time-deals`)
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
    const isDealExpired = deal.dealEndsAt && new Date(deal.dealEndsAt).getTime() <= Date.now();

    return (
        <section className="mb-14">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5 px-0">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-[22px] font-black text-[#111] tracking-tight">{deal.title}</h2>
                    {!isDealExpired && deal.dealEndsAt && (
                        <CountdownTimer targetDate={deal.dealEndsAt} />
                    )}
                </div>
                {isDealExpired && (
                    <span className="text-xs text-red-500 font-semibold">Deal has ended</span>
                )}
            </div>

            {/* Products — Desktop: 5 per row, Mobile: 2-row swippable grid */}
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
