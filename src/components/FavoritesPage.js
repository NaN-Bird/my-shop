import React from "react";
import { Link } from "react-router-dom";
import "./FavoritesPage.css";

export default function FavoritesPage({ favorites, products, toggleFavorite }) {
    // 🔹 Фільтруємо всі товари, щоб залишити тільки ті, що в обраному
    const favoriteProducts = products.filter((item) => favorites.includes(item.id));

    if (favoriteProducts.length === 0) {
        return (
            <section className="favorites-page">
                <h1>Обрані товари</h1>
                <p>У вас ще немає обраних товарів 🤍</p>
            </section>
        );
    }

    return (
        <section className="favorites-page">
            <h1>Обрані товари ❤️</h1>
            <div className="favorites-grid">
                {favoriteProducts.map((item) => (
                    <div key={item.id} className="favorite-card">
                        <Link to={`/products/${item.category}/${item.id}`}>
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.price}</p>
                        </Link>
                        <button
                            className="remove-btn"
                            onClick={() => toggleFavorite(item)}
                        >
                            Видалити з обраного
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
