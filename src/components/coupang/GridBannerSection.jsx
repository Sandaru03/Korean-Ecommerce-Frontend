import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function GridBannerSection() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/grid-banners`);
                if (data.success && data.banners) {
                    // Sort banners by position 1 through 6
                    const sorted = [...data.banners].sort((a, b) => a.position - b.position);
                    setBanners(sorted);
                }
            } catch (error) {
                console.error("Error fetching grid banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading || banners.length === 0) return null;

    // Filter banners that actually have images
    const activeBanners = banners.filter(b => b.image);
    if (activeBanners.length === 0) return null;

    // Positions 1 & 2 are top row, 3-6 are bottom row
    const topBanners = banners.filter(b => b.position === 1 || b.position === 2);
    const bottomBanners = banners.filter(b => b.position >= 3 && b.position <= 6);

    const renderBannerCard = (banner, desktopHeightClass = "md:h-[200px]") => {
        if (!banner.image) return null;

        return (
            <Link 
                key={banner.id} 
                to={banner.link || "#"} 
                className={`relative block w-full bg-white border border-[#eaeaea] overflow-hidden group hover:shadow-md transition-shadow duration-300 ${desktopHeightClass}`}
            >
                {/* The image itself */}
                <img 
                    src={banner.image} 
                    alt={`Promotion ${banner.position}`} 
                    className="w-full h-auto md:h-full object-contain block transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                
                {/* The little gray arrow box at the bottom left */}
                <div className="absolute bottom-3 left-3 w-7 h-7 bg-[#cccccc] flex items-center justify-center opacity-90 group-hover:bg-[#ff1268] transition-colors duration-300">
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>
            </Link>
        );
    };

    return (
        <section className="mb-4 md:mb-14">
            <div className="flex flex-col gap-4">
                {/* Top Row: 2 Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topBanners.map(b => renderBannerCard(b, "md:h-[180px]"))}
                </div>

                {/* Bottom Row: 4 Banners */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bottomBanners.map(b => renderBannerCard(b, "md:h-[240px]"))}
                </div>
            </div>
        </section>
    );
}
