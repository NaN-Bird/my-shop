// import React from "react";
// import { Link } from "react-router-dom";
// import "./CartPage.css";
//
// export default function CartPage({ cart, updateQuantity, removeFromCart }) {
//     // Обчислюємо загальну суму (без .replace!)
//     const total = cart.reduce(
//         (sum, item) => {
//             const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
//             return sum + price * (item.quantity || 1);
//         },
//         0
//     );
//
//     if (cart.length === 0) {
//         return (
//             <section className="cart-page">
//                 <h1>🛒 Ваш кошик</h1>
//                 <p>Кошик порожній</p>
//                 <Link to="/collection" className="go-to-collection">
//                     Перейти до колекції
//                 </Link>
//             </section>
//         );
//     }
//
//     return (
//         <section className="cart-page">
//             <h1>🛒 Ваш кошик</h1>
//             <div className="cart-grid">
//                 {cart.map((item) => {
//                     // Переконуємося, що ціна — це число
//                     const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
//                     const formattedPrice = price.toLocaleString("uk-UA");
//
//                     return (
//                         <div key={item._id || item.id} className="cart-card">
//                             <Link to={`/products/${item.category}/${item._id || item.id}`}>
//                                 <img
//                                     src={item.image || "https://via.placeholder.com/300x400?text=No+Image"}
//                                     alt={item.name}
//                                     className="cart-image"
//                                 />
//                             </Link>
//                             <h3>{item.name}</h3>
//                             <p>{formattedPrice} грн</p>
//
//                             <div className="quantity-controls">
//                                 <button
//                                     className="qty-btn"
//                                     onClick={() => {
//                                         const newQty = (item.quantity || 1) - 1;
//                                         if (newQty <= 0) {
//                                             removeFromCart(item._id || item.id);
//                                         } else {
//                                             updateQuantity(item._id || item.id, newQty);
//                                         }
//                                     }}
//                                     disabled={(item.quantity || 1) <= 1}
//                                 >
//                                     −
//                                 </button>
//                                 <span className="qty-value">{item.quantity || 1}</span>
//                                 <button
//                                     className="qty-btn"
//                                     onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
//                                 >
//                                     +
//                                 </button>
//                             </div>
//
//                             <button
//                                 className="remove-btn"
//                                 onClick={() => removeFromCart(item._id || item.id)}
//                             >
//                                 🗑️ Видалити
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//             <div className="cart-total">
//                 <h2>Разом: {total.toLocaleString("uk-UA")} грн</h2>
//                 <Link to="/checkout">
//                     <button className="checkout-btn">Оформити замовлення</button>
//                 </Link>
//             </div>
//         </section>
//     );
// }
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ cart, updateQuantity, removeFromCart }) {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // ===== ЗАВАНТАЖЕННЯ ІСТОРІЇ ЗАМОВЛЕНЬ =====
    useEffect(() => {
        const savedHistory = localStorage.getItem("orderHistory");
        if (savedHistory) {
            try {
                setOrderHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Помилка читання історії:", e);
            }
        }
    }, []);

    // ===== ЗБЕРЕЖЕННЯ ІСТОРІЇ =====
    const saveOrderToHistory = (order) => {
        const updatedHistory = [order, ...orderHistory];
        setOrderHistory(updatedHistory);
        localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));
    };

    const total = cart.reduce(
        (sum, item) => {
            const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
            return sum + price * (item.quantity || 1);
        },
        0
    );

    if (cart.length === 0) {
        return (
            <section className="cart-page">
                <h1>🛒 Ваш кошик</h1>
                <p>Кошик порожній</p>
                <Link to="/collection" className="go-to-collection">
                    Перейти до колекції
                </Link>

                {/* ===== ІСТОРІЯ ЗАМОВЛЕНЬ ===== */}
                {orderHistory.length > 0 && (
                    <div className="order-history">
                        <h2>📋 Історія замовлень</h2>
                        <button
                            className="toggle-history"
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            {showHistory ? "Сховати" : "Показати"} ({orderHistory.length})
                        </button>

                        {showHistory && (
                            <div className="history-list">
                                {orderHistory.map((order, index) => (
                                    <div key={index} className="history-item">
                                        <div className="history-header">
                                            <span className="history-number">
                                                📋 {order.orderNumber}
                                            </span>
                                            <span className="history-date">
                                                📅 {order.date}
                                            </span>
                                            <span className="history-total">
                                                💰 {order.total.toLocaleString()} грн
                                            </span>
                                        </div>
                                        <div className="history-items">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="history-item-detail">
                                                    <span>{item.name}</span>
                                                    <span>× {item.quantity || 1}</span>
                                                    <span>
                                                        {(item.price * (item.quantity || 1)).toLocaleString()} грн
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>
        );
    }

    return (
        <section className="cart-page">
            <h1>🛒 Ваш кошик</h1>
            <div className="cart-grid">
                {cart.map((item) => {
                    const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
                    const formattedPrice = price.toLocaleString("uk-UA");

                    return (
                        <div key={item._id || item.id} className="cart-card">
                            <Link to={`/products/${item.category}/${item._id || item.id}`}>
                                <img
                                    src={item.image || "https://via.placeholder.com/300x400?text=No+Image"}
                                    alt={item.name}
                                    className="cart-image"
                                />
                            </Link>
                            <h3>{item.name}</h3>
                            <p className="price">{formattedPrice} грн</p>

                            <div className="quantity-controls">
                                <button
                                    className="qty-btn"
                                    onClick={() => {
                                        const newQty = (item.quantity || 1) - 1;
                                        if (newQty <= 0) {
                                            removeFromCart(item._id || item.id);
                                        } else {
                                            updateQuantity(item._id || item.id, newQty);
                                        }
                                    }}
                                    disabled={(item.quantity || 1) <= 1}
                                >
                                    −
                                </button>
                                <span className="qty-value">{item.quantity || 1}</span>
                                <button
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="remove-btn"
                                onClick={() => removeFromCart(item._id || item.id)}
                            >
                                🗑️ Видалити
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="cart-total">
                <h2>Разом: {total.toLocaleString("uk-UA")} грн</h2>
                <Link to="/checkout">
                    <button className="checkout-btn">Оформити замовлення</button>
                </Link>
            </div>

            {/* ===== ІСТОРІЯ ЗАМОВЛЕНЬ (у кошику) ===== */}
            {orderHistory.length > 0 && (
                <div className="order-history">
                    <h2>📋 Історія замовлень</h2>
                    <button
                        className="toggle-history"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "Сховати" : "Показати"} ({orderHistory.length})
                    </button>

                    {showHistory && (
                        <div className="history-list">
                            {orderHistory.map((order, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-header">
                                        <span className="history-number">
                                            📋 {order.orderNumber}
                                        </span>
                                        <span className="history-date">
                                            📅 {order.date}
                                        </span>
                                        <span className="history-total">
                                            💰 {order.total.toLocaleString()} грн
                                        </span>
                                    </div>
                                    <div className="history-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="history-item-detail">
                                                <span>{item.name}</span>
                                                <span>× {item.quantity || 1}</span>
                                                <span>
                                                    {(item.price * (item.quantity || 1)).toLocaleString()} грн
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}