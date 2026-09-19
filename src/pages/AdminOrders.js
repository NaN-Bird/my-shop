import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminOrders.css";

const API_URL = "/api/orders";

const STATUS_OPTIONS = [
    { value: "new", label: "🆕 Нове" },
    { value: "processing", label: "⚙️ В обробці" },
    { value: "shipped", label: "🚚 Відправлено" },
    { value: "completed", label: "✅ Виконано" },
    { value: "cancelled", label: "❌ Скасовано" },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження замовлень:", err);
                setLoading(false);
            });
    };

    const updateStatus = (id, newStatus) => {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((res) => res.json())
            .then((updated) => {
                setOrders(orders.map((o) => (o._id === updated._id ? updated : o)));
            })
            .catch((err) => console.error("Помилка оновлення:", err));
    };

    const deleteOrder = (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити замовлення?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setOrders(orders.filter((o) => o._id !== id)))
            .catch((err) => console.error("Помилка видалення:", err));
    };

    const filteredOrders = filter === "all"
        ? orders
        : orders.filter((o) => o.status === filter);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "40px" }}>⏳ Завантаження замовлень...</p>;
    }

    return (
        <div className="admin-orders">
            <div className="orders-header">
                <h1>📦 Замовлення ({orders.length})</h1>
                <Link to="/admin" className="btn-back">← Назад до товарів</Link>
            </div>

            {/* ===== ФІЛЬТРИ ===== */}
            <div className="orders-filters">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    Всі ({orders.length})
                </button>
                {STATUS_OPTIONS.map((s) => {
                    const count = orders.filter((o) => o.status === s.value).length;
                    return (
                        <button
                            key={s.value}
                            className={filter === s.value ? "active" : ""}
                            onClick={() => setFilter(s.value)}
                        >
                            {s.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* ===== СПИСОК ЗАМОВЛЕНЬ ===== */}
            {filteredOrders.length === 0 ? (
                <p className="empty-message">Замовлень немає</p>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-card-header">
                                <div>
                                    <span className="order-number">📋 {order.orderNumber}</span>
                                    <span className="order-date">
                                        📅 {new Date(order.createdAt).toLocaleString("uk-UA")}
                                    </span>
                                </div>
                                <select
                                    className={`status-select status-${order.status}`}
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="order-customer">
                                <p><strong>👤 Ім'я:</strong> {order.customer.name}</p>
                                <p><strong>📞 Телефон:</strong> {order.customer.phone}</p>
                                {order.customer.email && <p><strong>📧 Email:</strong> {order.customer.email}</p>}
                                {order.customer.comment && <p><strong>📝 Коментар:</strong> {order.customer.comment}</p>}
                            </div>

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span>{item.name}</span>
                                        <span>× {item.quantity}</span>
                                        <span>{(item.price * item.quantity).toLocaleString()} грн</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <span className="order-total">
                                    💰 Разом: <strong>{order.total.toLocaleString()} грн</strong>
                                </span>
                                <button
                                    className="btn-delete-order"
                                    onClick={() => deleteOrder(order._id)}
                                >
                                    🗑️ Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}