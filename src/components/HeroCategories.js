import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroCategories.css";

export default function HeroCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження категорій:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="categories">
                <h2 className="categories-title">Наша Колекція</h2>
                <p style={{ textAlign: "center", color: "#888" }}>⏳ Завантаження...</p>
            </section>
        );
    }

    if (categories.length === 0) {
        return (
            <section className="categories">
                <h2 className="categories-title">Наша Колекція</h2>
                <p style={{ textAlign: "center", color: "#888" }}>Категорій поки немає</p>
            </section>
        );
    }

    return (
        <section className="categories">
            <h2 className="categories-title">Наша Колекція</h2>

            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category._id} className="category-card">
                        <Link to={`/products/${category.slug}`}>
                            <img
                                src={category.image || "https://via.placeholder.com/300x400?text=No+Image"}
                                alt={category.name}
                            />
                            <span className="category-label">{category.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}