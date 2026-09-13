import React, {useState, useEffect} from "react";
import "./ContactsPage.css";

export default function ContactsPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: ""
    });

    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("contacts-animate");
                }
            });
        }, {threshold: 0.2});

        document.querySelectorAll(".contacts-card, .contacts-block").forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // ===== ВІДПРАВКА В TELEGRAM =====
    const sendToTelegram = async (data) => {
        const BOT_TOKEN = "8589707761:AAG1a4g0rIO3JhUDuzTzBYiIuTVUGSJUvVM";
        const CHAT_ID = "822534152";

        const message = `
📬 **НОВЕ ПОВІДОМЛЕННЯ З САЙТУ!**

👤 **Ім'я:** ${data.name}
📞 **Телефон:** ${data.phone}

💬 **Повідомлення:**
${data.message}
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "Markdown"
                })
            });
            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error("❌ Помилка відправки в Telegram:", error);
            return false;
        }
    };

    // ===== ОБРОБКА ФОРМИ =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.message) {
            setStatus("❌ Будь ласка, заповніть всі поля");
            return;
        }

        // Валідація телефону
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            setStatus("❌ Введіть коректний номер телефону (не менше 10 цифр)");
            return;
        }

        setIsLoading(true);

        // 🔹 Відправляємо в Telegram
        const success = await sendToTelegram(formData);

        setIsLoading(false);

        if (success) {
            setStatus("✅ Дякуємо! Ми зв'яжемося з вами найближчим часом.");
            setFormData({name: "", phone: "", message: ""});
        } else {
            setStatus("❌ Помилка відправки. Спробуйте ще раз або зателефонуйте нам.");
        }
    };

    return (
        <div className="contacts-page-wrapper">

            {/* Hero */}
            <section className="contacts-hero">
                <div className="contacts-container">
                    <h1 className="contacts-hero-title">📬 Контакти</h1>
                    <p className="contacts-hero-sub">
                        Ми завжди на зв'язку. Напишіть, зателефонуйте або приїжджайте в гості!
                    </p>
                </div>
            </section>

            {/* Контактна інформація + Форма */}
            <section className="contacts-main">
                <div className="contacts-container contacts-grid">

                    {/* Ліва колонка — контакти */}
                    <div className="contacts-info">
                        <div className="contacts-card">
                            <div className="contacts-icon">📍</div>
                            <h3>Адреса</h3>
                            <p>м. Харків, пр. Науки, 64</p>
                            <p className="contacts-sub">Пн–Пт: 10:00 – 19:00</p>
                        </div>

                        <div className="contacts-card">
                            <div className="contacts-icon">📞</div>
                            <h3>Телефон</h3>
                            <a href="tel:+380501006507" className="contacts-link">+38 050 100 65 07</a>
                        </div>

                        <div className="contacts-card">
                            <div className="contacts-icon">✉️</div>
                            <h3>Email</h3>
                            <a href="mailto:ptashka.com.ua@gmail.com"
                               className="contacts-link">ptashka.com.ua@gmail.com</a>
                        </div>

                        <div className="contacts-card">
                            <div className="contacts-icon">🌐</div>
                            <h3>Ми в соцмережах</h3>
                            <div className="contacts-social">
                                <a
                                    href="https://www.instagram.com/ptashka_ukrain/"
                                    className="social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📸 Instagram
                                </a>
                                <a
                                    href="https://facebook.com"
                                    className="social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📘 Facebook
                                </a>
                                <a
                                    href="https://t.me/твій_нікнейм"
                                    className="social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📱 Telegram
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Права колонка — форма */}
                    <div className="contacts-form-block">
                        <div className="contacts-card contacts-form-card">
                            <h2>💬 Напишіть нам</h2>
                            <p>Відповімо протягом 24 годин</p>
                            <form onSubmit={handleSubmit} className="contacts-form">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше ім'я"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="contacts-input"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Ваш телефон"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="contacts-input"
                                    required
                                />
                                <textarea
                                    name="message"
                                    placeholder="Ваше повідомлення..."
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="contacts-textarea"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="contacts-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "⏳ Відправляємо..." : "Надіслати"}
                                </button>
                                {status && <p className="contacts-status">{status}</p>}
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            <section className="contacts-map">
                <div className="contacts-container">
                    <h2 className="contacts-section-title">🗺️ Ми на мапі</h2>
                    <div className="contacts-map-wrapper">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d640.6642554865514!2d36.22030856963412!3d50.036522259610365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTDCsDAyJzExLjUiTiAzNsKwMTMnMTUuNCJF!5e0!3m2!1sru!2sua!4v1789215189003!5m2!1sru!2sua"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                            title="Мапа — P T A S H K A"
                        ></iframe>
                    </div>
                </div>
            </section>

        </div>
    );
}