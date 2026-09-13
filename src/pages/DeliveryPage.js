import React, { useEffect } from "react";
import "./DeliveryPage.css";

export default function DeliveryPage() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("delivery-animate");
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll(".delivery-card, .delivery-block").forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="delivery-page-wrapper">
            {/* Hero */}
            <section className="delivery-hero">
                <div className="delivery-container">
                    <h1 className="delivery-hero-title">🚚 Доставка та оплата</h1>
                    <p className="delivery-hero-sub">
                        Ми робимо все, щоб ваше замовлення прийшло швидко та зручно
                    </p>
                </div>
            </section>

            {/* Способи доставки */}
            <section className="delivery-section">
                <div className="delivery-container">
                    <h2 className="delivery-section-title">Способи доставки</h2>
                    <div className="delivery-grid">
                        <div className="delivery-card">
                            <div className="delivery-icon">📦</div>
                            <h3>Нова Пошта</h3>
                            <p>Доставка по всій Україні у відділення або поштомат</p>
                            <ul className="delivery-list">
                                <li>⏱ 1–3 дні</li>
                                <li>💰 від 60 грн</li>
                                <li>📱 трек-номер у SMS</li>
                            </ul>
                        </div>

                        <div className="delivery-card">
                            <div className="delivery-icon">🚀</div>
                            <h3>Кур'єрська доставка</h3>
                            <p>Адресна доставка по місту та області</p>
                            <ul className="delivery-list">
                                <li>⏱ 1–2 дні</li>
                                <li>💰 від 80 грн</li>
                                <li>🏠 приїдемо до вас додому</li>
                            </ul>
                        </div>

                        <div className="delivery-card">
                            <div className="delivery-icon">🏪</div>
                            <h3>Самовивіз</h3>
                            <p>Заберіть замовлення самостійно з нашого шоуруму</p>
                            <ul className="delivery-list">
                                <li>⏱ безкоштовно</li>
                                <li>📍 м. Харків, пр. Науки, 64</li>
                                <li>🕒 Пн–Пт: 10:00–19:00</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Оплата */}
            <section className="delivery-payment">
                <div className="delivery-container">
                    <h2 className="delivery-section-title">💳 Способи оплати</h2>
                    <div className="delivery-payment-grid">
                        <div className="delivery-block">
                            <div className="payment-icon">💳</div>
                            <h3>Карткою онлайн</h3>
                            <p>Visa, Mastercard, Google Pay, Apple Pay</p>
                        </div>
                        <div className="delivery-block">
                            <div className="payment-icon">🏦</div>
                            <h3>Безготівковий розрахунок</h3>
                            <p>Для юридичних осіб та ФОП</p>
                        </div>
                        <div className="delivery-block">
                            <div className="payment-icon">📱</div>
                            <h3>Оплата частинами</h3>
                            <p>Монобанк, ПриватБанк, Оплата частинами</p>
                        </div>
                        <div className="delivery-block">
                            <div className="payment-icon">💵</div>
                            <h3>Готівкою при отриманні</h3>
                            <p>Оплата кур'єру або у відділенні</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="delivery-faq">
                <div className="delivery-container">
                    <h2 className="delivery-section-title">❓ Часті запитання</h2>
                    <div className="delivery-faq-grid">
                        <div className="delivery-card faq-item">
                            <h3>Скільки коштує доставка?</h3>
                            <p>Вартість залежить від способу доставки та ваги замовлення. При замовленні від 2000 грн — доставка безкоштовна!</p>
                        </div>
                        <div className="delivery-card faq-item">
                            <h3>Як відстежити замовлення?</h3>
                            <p>Після відправлення ви отримаєте SMS із трек-номером. Відстежуйте на сайті Нової Пошти.</p>
                        </div>
                        <div className="delivery-card faq-item">
                            <h3>Чи можна змінити адресу доставки?</h3>
                            <p>Так, якщо замовлення ще не відправлено. Зв'яжіться з нами за телефоном або в чаті.</p>
                        </div>
                        <div className="delivery-card faq-item">
                            <h3>Що робити, якщо товар не підійшов?</h3>
                            <p>Протягом 14 днів ви можете обміняти товар або повернути кошти. Детальніше на сторінці "Обмін та повернення".</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}