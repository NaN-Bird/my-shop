import React, { useEffect } from "react";
import "./AboutPage.css";

export default function AboutPage() {
    useEffect(() => {
        // Анімація появи карток при скролі
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("about-animate");
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll(".about-card, .about-image-block").forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            {/* Hero секція */}
            <section className="about-hero">
                <div className="about-container">
                    <h1 className="about-hero-title">Про нас</h1>
                    <p className="about-hero-sub">
                        Ми створюємо затишок для вашого дому та комфорт для вашого сну
                    </p>
                </div>
            </section>

            {/* Історія */}
            <section className="about-section about-container">
                <div className="about-grid">
                    <div className="about-card">
                        <h2>Наша історія</h2>
                        <p>
                            Народився наш бренд із любові до комфорту та якості. Ми помітили,
                            що справжній затишок починається з дрібниць: м'якої піжами,
                            приємної постільної білизни, турботливо обраних тканин.
                        </p>
                        <p>
                            Сьогодні ми — команда однодумців, які щодня працюють над тим,
                            щоб ваш відпочинок був бездоганним. Кожен виріб ми перевіряємо
                            особисто, бо самі користуємось тим, що продаємо.
                        </p>
                    </div>
                    <div className="about-image-block about-image-history">
                        <div className="about-image-placeholder">
                            📸 Тут буде фото студії / команди
                        </div>
                    </div>
                </div>
            </section>

            {/* Цінності */}
            <section className="about-values">
                <div className="about-container">
                    <h2 className="about-values-title">Наші цінності</h2>
                    <div className="about-values-grid">
                        <div className="about-card value-card">
                            <div className="value-icon">🧵</div>
                            <h3>Якість</h3>
                            <p>Обираємо тільки натуральні тканини та перевіряємо кожен шов</p>
                        </div>
                        <div className="about-card value-card">
                            <div className="value-icon">❤️</div>
                            <h3>Турбота</h3>
                            <p>Ми хочемо, щоб ви почувалися в нашому одязі як вдома</p>
                        </div>
                        <div className="about-card value-card">
                            <div className="value-icon">🌿</div>
                            <h3>Екологічність</h3>
                            <p>Використовуємо еко-пакування та підтримуємо локальних виробників</p>
                        </div>
                        <div className="about-card value-card">
                            <div className="value-icon">💬</div>
                            <h3>Відкритість</h3>
                            <p>Завжди готові відповісти на ваші питання та побажання</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Контакти */}
            <section className="about-contact about-container">
                <div className="about-card about-contact-card">
                    <h2>💌 Напишіть нам</h2>
                    <p>Ми завжди на зв'язку та відповідаємо протягом 24 годин</p>
                    <div className="about-contact-links">
                        <a href="mailto:ptashka.com.ua@gmail.com" className="about-contact-link">
                            📧 ptashka.com.ua@gmail.com
                        </a>
                        <a href="tel:+380501006507" className="about-contact-link">
                            📱 +38 050 100 65 07
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}