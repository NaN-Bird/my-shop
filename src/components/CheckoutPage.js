import React, { useState } from "react";

export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        quantity: 1,
        comment: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ✅ Тут ти можеш зберегти у localStorage або відправити на сервер
        console.log("Замовлення:", formData);
        alert("Дякуємо! Ми скоро з вами зв’яжемося 📞");
    };

    return (
        <section className="checkout-page">
            <h1>Оформлення замовлення 🛍️</h1>
            <form onSubmit={handleSubmit} className="checkout-form">
                <label>
                    Ім’я та прізвище:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>

                <label>
                    Телефон:
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </label>

                <label>
                    Email (опційно):
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>

                <label>
                    Кількість:
                    <input type="number" name="quantity" value={formData.quantity} min="1" onChange={handleChange} required />
                </label>

                <label>
                    Коментар:
                    <textarea name="comment" value={formData.comment} onChange={handleChange}></textarea>
                </label>

                <button type="submit">Відправити замовлення</button>
            </form>
        </section>
    );
}
