import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                // Беремо перші 2 категорії
                setCategories(data.slice(0, 2));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження категорій:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="hero">
                <div className="hero-loading">⏳ Завантаження...</div>
            </section>
        );
    }

    if (categories.length < 2) {
        return (
            <section className="hero">
                <div className="hero-loading">
                    Додайте мінімум 2 категорії в адмінці, щоб вони з'явилися тут
                </div>
            </section>
        );
    }

    return (
        <section className="hero">
            {categories.map((category, index) => (
                <div
                    key={category._id}
                    className={`hero-block ${index === 0 ? "men" : "women"}`}
                >
                    <Link to={`/products/${category.slug}`} className="hero-link">
                        <img
                            src={category.image || "https://via.placeholder.com/800x600?text=No+Image"}
                            alt={category.name}
                            className="hero-img"
                        />
                        <div className={`hero-banner ${index === 0 ? "men-banner" : "women-banner"}`}>
                            <span className="banner-text">{category.name}</span>
                            <span className="banner-link">КУПУВАТИ</span>
                        </div>
                    </Link>
                </div>
            ))}
        </section>
    );
}