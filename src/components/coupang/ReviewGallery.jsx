import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const ReviewGallery = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${backendUrl}/gallery-reviews`);
                if (res.data.success) {
                    setReviews(res.data.reviews);
                }
            } catch (err) {
                console.error("Error fetching gallery reviews:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [backendUrl]);

    if (loading || reviews.length === 0) return null;

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="mx-auto max-w-[1040px] px-4 mb-10 text-center">
                <h2 className="text-[24px] md:text-[32px] font-black text-[#111] tracking-tight uppercase leading-none">
                    What Our Customers Say
                </h2>
                <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full" />
                <p className="text-gray-500 text-sm md:text-base mt-4 font-medium">Real reviews from our amazing community</p>
            </div>

            <div 
                className="relative w-full py-12"
                onMouseEnter={() => {
                    if (swiperRef.current?.autoplay) {
                        swiperRef.current.autoplay.stop();
                    }
                }}
                onMouseLeave={() => {
                    if (swiperRef.current?.autoplay) {
                        swiperRef.current.autoplay.start();
                    }
                }}
            >
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Autoplay, FreeMode]}
                    spaceBetween={16}
                    slidesPerView={'auto'}
                    loop={true}
                    freeMode={true}
                    speed={5000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    onTouchEnd={() => {
                        // Ensure autoplay resumes after swipe
                        setTimeout(() => {
                            if (swiperRef.current?.autoplay && !swiperRef.current.autoplay.running) {
                                swiperRef.current.autoplay.start();
                            }
                        }, 100);
                    }}
                    breakpoints={{
                        768: {
                            spaceBetween: 32,
                        }
                    }}
                    className="review-swiper !overflow-visible"
                >
                    {/* Triple the items to ensure smooth infinite scroll */}
                    {[...reviews, ...reviews, ...reviews].map((review, index) => (
                        <SwiperSlide 
                            key={`${review.id}-${index}`} 
                            style={{ width: 'auto' }}
                        >
                            <div
                                className={`
                                    flex-shrink-0 w-[240px] md:w-[300px] aspect-[4/5] rounded-3xl overflow-hidden 
                                    border-4 border-white shadow-lg
                                    transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:z-10
                                    ${index % 2 === 0 ? '-translate-y-8' : 'translate-y-8'}
                                `}
                            >
                                <img
                                    src={review.image}
                                    alt={`Review ${index}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .review-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
                .review-swiper {
                    cursor: grab;
                }
                .review-swiper:active {
                    cursor: grabbing;
                }
            `}} />
        </section>
    );
};

export default ReviewGallery;
