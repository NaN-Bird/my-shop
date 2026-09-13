import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "./InstagramSlider.css";

export default function InstagramSlider() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/instagram")
            .then((res) => res.json())
            .then((data) => {
                setMedia(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="instagram-slider">
                <h2>Ми в Instagram 📸</h2>
                <p style={{ textAlign: "center", color: "#888" }}>⏳ Завантаження...</p>
            </section>
        );
    }

    if (media.length === 0) {
        return (
            <section className="instagram-slider">
                <h2>Ми в Instagram 📸</h2>
                <p style={{ textAlign: "center", color: "#888" }}>Фото поки немає</p>
            </section>
        );
    }

    return (
        <section className="instagram-slider">
            <h2>Ми в Instagram 📸</h2>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={5}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                    0: { slidesPerView: 1.2, spaceBetween: 12 },
                    480: { slidesPerView: 2.2, spaceBetween: 16 },
                    768: { slidesPerView: 3.2, spaceBetween: 20 },
                    1024: { slidesPerView: 4.2, spaceBetween: 24 },
                    1280: { slidesPerView: 5, spaceBetween: 30 },
                }}
            >
                {media.map((item, index) => (
                    <SwiperSlide key={item._id}>
                        <a
                            href={item.link || "https://www.instagram.com/ptashka_ukrain/"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={item.image} alt={`Instagram ${index + 1}`} />
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}