// import React from "react";
// import { Link } from "react-router-dom";
// import "./FavoritesPage.css";
//
// export default function FavoritesPage({ favorites, products, toggleFavorite }) {
//     // 🔹 Фільтруємо всі товари, щоб залишити тільки ті, що в обраному
//     const favoriteProducts = products.filter((item) => favorites.includes(item.id));
//
//     if (favoriteProducts.length === 0) {
//         return (
//             <section className="favorites-page">
//                 <h1>Обрані товари</h1>
//                 <p>У вас ще немає обраних товарів 🤍</p>
//             </section>
//         );
//     }
//
//     return (
//         <section className="favorites-page">
//             <h1>Обрані товари ❤️</h1>
//             <div className="favorites-grid">
//                 {favoriteProducts.map((item) => (
//                     <div key={item.id} className="favorite-card">
//                         <Link to={`/products/${item.category}/${item.id}`}>
//                             <img src={item.image} alt={item.name} />
//                             <h3>{item.name}</h3>
//                             <p>{item.price}</p>
//                         </Link>
//                         <button
//                             className="remove-btn"
//                             onClick={() => toggleFavorite(item)}
//                         >
//                             Видалити з обраного
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./FavoritesPage.css";

export default function FavoritesPage({ favorites, toggleFavorite }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Завантажуємо всі товари з бекенду
    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження товарів:", err);
                setLoading(false);
            });
    }, []);

    // Фільтруємо тільки ті товари, які є в обраному
    const favoriteProducts = products.filter((product) =>
        favorites.includes(product._id)
    );

    if (loading) {
        return (
            <section className="favorites-page">
                <h1>❤️ Обрані товари</h1>
                <p>Завантаження...</p>
            </section>
        );
    }

    if (favoriteProducts.length === 0) {
        return (
            <section className="favorites-page">
                <h1>❤️ Обрані товари</h1>
                <p>У вас поки немає обраних товарів.</p>
                <Link to="/collection" className="go-to-collection">
                    Перейти до колекції
                </Link>
            </section>
        );
    }

    return (
        <section className="favorites-page">
            <h1>❤️ Обрані товари ({favoriteProducts.length})</h1>
            <div className="favorites-grid">
                {favoriteProducts.map((product) => (
                    <FavoriteCard
                        key={product._id}
                        product={product}
                        toggleFavorite={toggleFavorite}
                        isFavorite={true}
                    />
                ))}
            </div>
        </section>
    );
}

function FavoriteCard({ product, toggleFavorite, isFavorite }) {
    return (
        <div className="favorite-card">
            <Link to={`/products/${product.category}/${product._id}`}>
                <img
                    src={product.image || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>{product.price} грн</p>
            </Link>
            <button
                className="remove-favorite"
                onClick={() => toggleFavorite(product)}
            >
                <FaHeart className="heart-icon active" /> Видалити
            </button>
        </div>
    );
}