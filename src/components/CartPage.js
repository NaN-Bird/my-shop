import    React from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ cart, updateQuantity, removeFromCart }) {
    const total = cart.reduce(
        (sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.quantity,
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
                        <Link to={`/products/${item.category}/${item.id}`}>
                            <img src={item.image} alt={item.name} className="cart-image" />
                        </Link>

                        <h3>{item.name}</h3>
                        <p>{item.price}</p>

                        <div className="quantity-controls">
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>

                            <span className="qty-value">{item.quantity}</span>

                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>

                        <button onClick={() => removeFromCart(item.id)}>Видалити</button>
                    </div>
                ))}
            </div>
            <h2>Разом: ${total.toFixed(2)}</h2>
            <Link to="/checkout">
                <button className="checkout-btn">Оформити замовлення</button>
            </Link>
        </section>
    );
}
