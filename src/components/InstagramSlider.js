import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

export default function InstagramSlider() {
    const media = [
        { type: "image", src: "/assets/insta1.webp" },
        { type: "image", src: "/assets/insta2.webp" },
        { type: "image", src: "/assets/insta3.webp" },
        { type: "image", src: "/assets/insta4.webp" },
        { type: "video", src: "/assets/insta5.mp4" },
        { type: "image", src: "/assets/insta6.jpg" },
        { type: "video", src: "/assets/insta7.mp4" },
    ];

    return (
        <section className="instagram-slider">
            <h2>Ми в Instagram 📸</h2>
            <Swiper
                modules={[Autoplay]}

                spaceBetween={10}
                slidesPerView={3}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
            >
                {media.map((item, index) => (
                    <SwiperSlide key={index}>
                        <a
                            href="https://instagram.com/твій_профіль"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.type === "image" ? (
                                <img src={item.src} alt={`Instagram ${index + 1}`} />
                            ) : (
                                <video src={item.src} autoPlay muted loop playsInline />
                            )}
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
