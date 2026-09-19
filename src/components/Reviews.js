import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Reviews.css";

const API_URL = "/api/reviews";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження відгуків:", err);
                setLoading(false);
            });
    }, []);

    const renderStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
        <section className="reviews-section">
            <div className="reviews-container">
                <h2 className="reviews-title">💬 Відгуки наших клієнтів</h2>

                {loading ? (
                    <p className="reviews-loading">⏳ Завантаження...</p>
                ) : reviews.length === 0 ? (
                    <div className="reviews-empty-block">
                        <p>Поки що немає відгуків. Будьте першим! 🤍</p>
                        <Link to="/reviews" className="btn-add-review">
                            ✍️ Залишити відгук
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="reviews-grid">
                            {reviews.slice(0, 3).map((review) => (
                                <div key={review._id} className="review-card">
                                    <div className="review-card-header">
                                        <div className="review-avatar">
                                            {review.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="review-name">{review.name}</div>
                                            <div className="review-stars">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="review-text">"{review.text}"</p>
                                    <p className="review-date">
                                        📅 {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="reviews-actions">
                            <Link to="/reviews" className="btn-add-review">
                                ✍️ Залишити відгук
                            </Link>
                            {reviews.length > 3 && (
                                <Link to="/reviews" className="btn-all-reviews">
                                    Всі відгуки ({reviews.length}) →
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}