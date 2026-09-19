import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage({ cart = [], clearCart }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        comment: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);

    // ===== ПРИ ЗАВАНТАЖЕННІ ПЕРЕВІРЯЄМО =====
    useEffect(() => {
        const savedOrder = localStorage.getItem("lastOrder");
        const savedCart = localStorage.getItem("cart");
        const cartIsEmpty = !savedCart || JSON.parse(savedCart).length === 0;

        if (savedOrder && cartIsEmpty) {
            try {
                const parsed = JSON.parse(savedOrder);
                setOrderSummary(parsed);
                setIsSubmitted(true);
            } catch (e) {
                console.error("Помилка читання збереженого замовлення:", e);
            }
        } else if (!cartIsEmpty) {
            setIsSubmitted(false);
            setOrderSummary(null);
        }
    }, [cart]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ===== ГЕНЕРАЦІЯ НОМЕРА ЗАМОВЛЕННЯ =====
    const generateOrderNumber = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        return `#${year}${month}${day}-${random}`;
    };

    // ===== ЗБЕРЕЖЕННЯ В ІСТОРІЮ =====
    const saveOrderToHistory = (order) => {
        const savedHistory = localStorage.getItem("orderHistory");
        let history = [];
        if (savedHistory) {
            try {
                history = JSON.parse(savedHistory);
            } catch (e) {
                console.error("Помилка читання історії:", e);
            }
        }
        const updatedHistory = [order, ...history];
        localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));
    };

    // ===== ВІДПРАВКА В TELEGRAM =====
    const sendToTelegram = async (orderData) => {
        const BOT_TOKEN = "8589707761:AAG1a4g0rIO3JhUDuzTzBYiIuTVUGSJUvVM";
        const CHAT_ID = "822534152";

        let itemsText = "❌ Товари не вказано";
        let total = 0;

        if (cart && cart.length > 0) {
            itemsText = cart.map(item => {
                const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
                const quantity = item.quantity || 1;
                total += price * quantity;
                return `- ${item.name} × ${quantity} = ${(price * quantity).toLocaleString()} грн`;
            }).join("\n");
            total = cart.reduce((sum, item) => {
                const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
                return sum + price * (item.quantity || 1);
            }, 0);
        }

        const message = `
🛍️ **НОВЕ ЗАМОВЛЕННЯ!**
📋 **№:** ${orderData.orderNumber}

👤 **Ім'я:** ${orderData.name}
📞 **Телефон:** ${orderData.phone}
📧 **Email:** ${orderData.email || "Не вказано"}
📝 **Коментар:** ${orderData.comment || "Немає"}

📦 **Товари:** 
${itemsText}

💰 **Сума:** ${total.toLocaleString()} грн
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "Markdown"
                })
            });
            const data = await response.json();
            return data.ok;
        } catch (error) {
            console.error("❌ Помилка відправки:", error);
            return false;
        }
    };

    // ===== ВІДПРАВКА ФОРМИ =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            alert("Будь ласка, введіть коректний номер телефону (не менше 10 цифр)");
            return;
        }

        setIsLoading(true);

        const currentCart = [...cart];
        const total = currentCart.reduce((sum, item) => {
            const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
            return sum + price * (item.quantity || 1);
        }, 0);

        const orderNumber = generateOrderNumber();
        const orderData = {
            orderNumber: orderNumber,
            items: currentCart,
            total: total,
            name: formData.name,
            phone: formData.phone,
            email: formData.email || "Не вказано",
            comment: formData.comment || "Немає",
            date: new Date().toLocaleString("uk-UA")
        };

        const success = await sendToTelegram(orderData);

        setIsLoading(false);

        if (success) {
            // ===== ЗБЕРІГАЄМО В БД (MongoDB) =====
            try {
                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderNumber: orderData.orderNumber,
                        customer: {
                            name: orderData.name,
                            phone: orderData.phone,
                            email: orderData.email,
                            comment: orderData.comment,
                        },
                        items: orderData.items.map(item => ({
                            productId: item._id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image,
                        })),
                        total: orderData.total,
                        status: "new",
                    }),
                });
                const data = await response.json();
                console.log("✅ Замовлення збережено в БД:", data);
            } catch (error) {
                console.error("❌ Помилка збереження замовлення:", error);
            }

            // ===== ЗБЕРІГАЄМО В LOCALSTORAGE =====
            localStorage.setItem("lastOrder", JSON.stringify(orderData));

            // ===== ЗБЕРІГАЄМО В ІСТОРІЮ =====
            saveOrderToHistory(orderData);

            // ===== ПОКАЗУЄМО ЧЕК =====
            setOrderSummary(orderData);
            setIsSubmitted(true);

            // ===== ОЧИЩУЄМО ФОРМУ =====
            setFormData({ name: "", phone: "", email: "", comment: "" });

            // ===== ОЧИЩУЄМО КОШИК =====
            if (clearCart) {
                clearCart();
            } else {
                localStorage.removeItem("cart");
            }
        } else {
            alert("❌ Сталася помилка при відправці замовлення. Спробуйте ще раз або зв'яжіться з нами за телефоном.");
        }
    };

    // ===== ДРУК =====
    const handlePrint = () => {
        window.print();
    };

    // ===== НОВЕ ЗАМОВЛЕННЯ =====
    const handleNewOrder = () => {
        localStorage.removeItem("lastOrder");
        setIsSubmitted(false);
        setOrderSummary(null);
        window.location.href = "/collection";
    };

    // ===== СТОРІНКА З ЧЕКОМ =====
    if (isSubmitted && orderSummary) {
        return (
            <section className="checkout-page success" id="order-receipt">
                <div className="success-message">
                    <h1>✅ Дякуємо за замовлення!</h1>
                    <p className="order-number">📋 Номер замовлення: <strong>{orderSummary.orderNumber}</strong></p>
                    <p className="order-date">📅 {orderSummary.date}</p>

                    <p className="confirmation-text">
                        Ми отримали ваше замовлення і скоро зв'яжемося з вами для підтвердження.
                    </p>

                    <div className="order-summary">
                        <h2>📋 Ваше замовлення</h2>
                        <div className="order-items">
                            {orderSummary.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span className="order-item-name">{item.name}</span>
                                    <span className="order-item-qty">× {item.quantity || 1}</span>
                                    <span className="order-item-price">
                                        {( (item.price) * (item.quantity || 1) ).toLocaleString()} грн
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="order-total">
                            <strong>Разом:</strong> {orderSummary.total.toLocaleString()} грн
                        </div>
                        <div className="order-contact">
                            <p><strong>👤 Ім'я:</strong> {orderSummary.name}</p>
                            <p><strong>📞 Телефон:</strong> {orderSummary.phone}</p>
                            <p><strong>📧 Email:</strong> {orderSummary.email}</p>
                            <p><strong>📝 Коментар:</strong> {orderSummary.comment}</p>
                        </div>
                    </div>

                    <div className="receipt-actions">
                        <button className="btn-print" onClick={handlePrint}>
                            🖨️ Роздрукувати
                        </button>
                        <button className="btn-new-order" onClick={handleNewOrder}>
                            🛍️ Нове замовлення
                        </button>
                        <Link to="/" className="btn-home">На головну</Link>
                    </div>
                </div>
            </section>
        );
    }

    // ===== ФОРМА ОФОРМЛЕННЯ =====
    return (
        <section className="checkout-page">
            <h1>Оформлення замовлення 🛍️</h1>
            <p className="checkout-subtitle">Заповніть форму, і ми зв'яжемося з вами найближчим часом</p>

            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label>Ваше Ім’я *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Іван Петренко"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Телефон *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+38 050 123 45 67"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email (опційно)</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                    />
                </div>

                <div className="form-group">
                    <label>Коментар до замовлення</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Додаткові побажання..."
                        rows="4"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? "⏳ Відправляємо..." : "📩 Відправити замовлення"}
                </button>
            </form>
        </section>
    );
}