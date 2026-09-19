import React, {useState, useEffect} from "react";
import "./ReviewsPage.css";

const API_URL = "/api/reviews";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        rating: 5,
        text: ""
    });
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ===== ЗАВАНТАЖЕННЯ ВІДГУКІВ =====
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження:", err);
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleRating = (value) => {
        setFormData({...formData, rating: value});
    };

    // ===== ВІДПРАВКА =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.text) {
            setStatus("❌ Будь ласка, заповніть всі поля");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("✅ Дякуємо! Ваш відгук з'явиться після модерації.");
                setFormData({name: "", rating: 5, text: ""});
            } else {
                setStatus("❌ Помилка відправки. Спробуйте ще раз.");
            }
        } catch (error) {
            console.error("Помилка:", error);
            setStatus("❌ Помилка відправки. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    // ===== ЗІРКИ =====
    const renderStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
        <div className="reviews-page-wrapper">
            {/* Hero */}
            <section className="reviews-hero">
                <div className="reviews-container">
                    <h1>💬 Відгуки наших клієнтів</h1>
                    <p>
                        Дякуємо, що обираєте нас! Залиште свій відгук — це допоможе нам стати кращими!
                    </p>
                </div>
            </section>

            {/* Форма + Список */}
            <section className="reviews-main">
                <div className="reviews-container reviews-grid">

                    {/* Форма */}
                    <div className="reviews-form-block">
                        <div className="reviews-card">
                            <h2>📝 Залишити відгук</h2>
                            <form onSubmit={handleSubmit} className="reviews-form">
                                <div className="reviews-form-group">
                                    <label>Ваше ім'я *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Іван Петренко"
                                        required
                                    />
                                </div>

                                <div className="reviews-form-group">
                                    <label>Оцінка *</label>
                                    <div className="reviews-rating-input">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`star ${star <= formData.rating ? "active" : ""}`}
                                                onClick={() => handleRating(star)}
                                            >
                                                ⭐
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="reviews-form-group">
                                    <label>Ваш відгук *</label>
                                    <textarea
                                        name="text"
                                        value={formData.text}
                                        onChange={handleChange}
                                        placeholder="Розкажіть про ваш досвід..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="reviews-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "⏳ Відправляємо..." : "📩 Відправити відгук"}
                                </button>

                                {status && <p className="reviews-status">{status}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Список відгуків */}
                    <div className="reviews-list-block">
                        <h2>📋 Що кажуть клієнти ({reviews.length})</h2>

                        {loading ? (
                            <p className="reviews-loading">⏳ Завантаження...</p>
                        ) : reviews.length === 0 ? (
                            <p className="reviews-empty">
                                Поки що немає відгуків. Будьте першим! 🤍
                            </p>
                        ) : (
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        <div className="review-header">
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
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}