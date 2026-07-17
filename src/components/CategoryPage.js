import React, { useState } from "react";
import "./CategoryPage.css";
import { FaHeart } from "react-icons/fa";

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
                <img src={item.image} alt={item.name} />
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
