import React from "react";
import "./CartPage.css";

export default function CartPage({ cart, removeFromCart }) {
    const total = cart.reduce(
        (sum, item) => sum + parseFloat(item.price.replace("$", "")),
        0
    );

    if (cart.length === 0) {
        return (
            <section className="cart-page">
                <h1>Ваш кошик 🛒</h1>
                <p>Кошик порожній</p>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <h1>Ваш кошик 🛒</h1>
            <div className="cart-grid">
                {cart.map((item) => (
                    <div key={item.id} className="cart-card">
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.price}</p>
                        <button onClick={() => removeFromCart(item.id)}>Видалити</button>
                    </div>
                ))}
            </div>
            <h2>Разом: ${total.toFixed(2)}</h2>
        </section>
    );
}
