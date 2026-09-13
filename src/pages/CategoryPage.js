import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./CategoryPage.css";

export default function CategoryPage({ favorites, toggleFavorite }) {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Завантажуємо категорії (щоб знайти назву)
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((categories) => {
                const found = categories.find((c) => c.slug === category);
                if (found) setCategoryName(found.name);
            })
            .catch((err) => console.error("Помилка категорій:", err));

        // Завантажуємо товари
        fetch("http://localhost:5000/products")
            .then((res) => res.json())
            .then((data) => {
                const filtered = data.filter((p) => p.category === category);
                setProducts(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження:", err);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <section className="category-page">
                <h1>Завантаження...</h1>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return (
            <section className="category-page">
                <h1>{categoryName || "Категорія"}</h1>
                <p>Товарів у цій категорії поки немає.</p>
            </section>
        );
    }

    return (
        <section className="category-page">
            <h1>{categoryName || "Категорія"}</h1>
            <div className="products-row">
                {products.map((item) => (
                    <ProductCard
                        key={item._id}
                        item={item}
                        category={category}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ item, category, favorites, toggleFavorite }) {
    const isFavorite = favorites.includes(item._id);

    return (
        <div className="product-card">
            <div className="product-image">
                <Link to={`/products/${category}/${item._id}`}>
                    <img
                        src={item.image || "https://via.placeholder.com/300x400?text=No+Image"}
                        alt={item.name}
                    />
                </Link>
                <FaHeart
                    className={`heart-icon ${isFavorite ? "active" : ""}`}
                    onClick={() => toggleFavorite(item)}
                />
            </div>
            <div className="product-info">
                <h3>{item.name}</h3>
                <p>{item.price} грн</p>
            </div>
        </div>
    );
}