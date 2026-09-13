import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroCategories from "../components/HeroCategories";
import InstagramSlider from "../components/InstagramSlider";
import "./CollectionPage.css";

export default function CollectionPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="collection-page">
                <HeroCategories />
                <div className="loading-text">⏳ Завантаження товарів...</div>
            </div>
        );
    }

    return (
        <div className="collection-page">
            <HeroCategories />
            {/*
            <section className="collection-section">
                <h2 className="collection-title">Всі товари</h2>
                <div className="collection-grid">
                    {products.length === 0 ? (
                        <p className="empty-message">Товарів поки немає</p>
                    ) : (
                        products.map((item) => (
                            <ProductCard key={item._id} item={item} />
                        ))
                    )}
                </div>
            </section>*/}

            <InstagramSlider />
        </div>
    );
}

function ProductCard({ item }) {
    return (
        <div className="collection-card">
            <Link to={`/products/${item.category}/${item._id}`}>
                <img
                    src={item.image || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={item.name}
                />
                <div className="collection-card-info">
                    <h3>{item.name}</h3>
                    <p>{item.price} грн</p>
                </div>
            </Link>
        </div>
    );
}