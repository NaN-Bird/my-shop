import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminReviews.css";

const API_URL = "http://localhost:5000/reviews";

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        fetch(`${API_URL}/all`)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка:", err);
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
                setReviews(reviews.map((r) => (r._id === updated._id ? updated : r)));
            });
    };

    const deleteReview = (id) => {
        if (!window.confirm("Видалити цей відгук?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setReviews(reviews.filter((r) => r._id !== id)));
    };

    const filteredReviews = filter === "all"
        ? reviews
        : reviews.filter((r) => r.status === filter);

    const renderStars = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

    if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>⏳ Завантаження...</p>;

    return (
        <div className="admin-reviews">
            <div className="reviews-header-admin">
                <h1>💬 Модерація відгуків ({reviews.length})</h1>
                <Link to="/admin" className="btn-back">← Назад до товарів</Link>
            </div>

            {/* Фільтри */}
            <div className="reviews-filters">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    Всі ({reviews.length})
                </button>
                <button
                    className={filter === "pending" ? "active" : ""}
                    onClick={() => setFilter("pending")}
                >
                    ⏳ На модерації ({reviews.filter((r) => r.status === "pending").length})
                </button>
                <button
                    className={filter === "approved" ? "active" : ""}
                    onClick={() => setFilter("approved")}
                >
                    ✅ Схвалені ({reviews.filter((r) => r.status === "approved").length})
                </button>
                <button
                    className={filter === "rejected" ? "active" : ""}
                    onClick={() => setFilter("rejected")}
                >
                    ❌ Відхилені ({reviews.filter((r) => r.status === "rejected").length})
                </button>
            </div>

            {/* Список */}
            {filteredReviews.length === 0 ? (
                <p className="empty-message">Відгуків немає</p>
            ) : (
                <div className="reviews-list-admin">
                    {filteredReviews.map((review) => (
                        <div key={review._id} className={`review-card-admin status-${review.status}`}>
                            <div className="review-card-header">
                                <div>
                                    <div className="review-name">{review.name}</div>
                                    <div className="review-stars">{renderStars(review.rating)}</div>
                                    <div className="review-date">
                                        📅 {new Date(review.createdAt).toLocaleString("uk-UA")}
                                    </div>
                                </div>
                                <span className={`review-status status-${review.status}`}>
                                    {review.status === "pending" && "⏳ На модерації"}
                                    {review.status === "approved" && "✅ Схвалено"}
                                    {review.status === "rejected" && "❌ Відхилено"}
                                </span>
                            </div>

                            <p className="review-text">"{review.text}"</p>

                            <div className="review-actions">
                                {review.status !== "approved" && (
                                    <button
                                        className="btn-approve"
                                        onClick={() => updateStatus(review._id, "approved")}
                                    >
                                        ✅ Схвалити
                                    </button>
                                )}
                                {review.status !== "rejected" && (
                                    <button
                                        className="btn-reject"
                                        onClick={() => updateStatus(review._id, "rejected")}
                                    >
                                        ❌ Відхилити
                                    </button>
                                )}
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteReview(review._id)}
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