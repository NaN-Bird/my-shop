import React, { useState } from "react";
import "./CategoryPage.css";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom"; // ✅ додаємо Link

export default function CategoryPage({ title, products }) {
    return (
        <section className="category-page">
            <h1>{title}</h1>
            <div className="products-row">
                {products.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ item }) {
    const [favorite, setFavorite] = useState(false);

    return (
        <div className="product-card">
            <div className="product-image">
                {/* ✅ Клік по фото веде на сторінку товару */}
                <Link to={`/product/${item.id}`}>
                    <img src={item.image} alt={item.name} />
                </Link>

                {/* ❤️ Іконка "обране" */}
                <FaHeart
                    className={`heart-icon ${favorite ? "active" : ""}`}
                    onClick={() => setFavorite(!favorite)}
                />
            </div>
            <div className="product-info">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
            </div>
        </div>
    );
}
