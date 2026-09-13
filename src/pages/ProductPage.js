import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

export default function ProductPage({ favorites, toggleFavorite, addToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [thumbnails, setThumbnails] = useState([]); // додаткові фото

    useEffect(() => {
        fetch(`http://localhost:5000/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Товар не знайдено");
                return res.json();
            })
            .then((data) => {
                console.log("📦 Отримано товар:", data);
                setProduct(data);
                setMainImage(data.image || "https://via.placeholder.com/300x400?text=No+Image");
                setThumbnails(data.images || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Помилка завантаження товару:", err);
                setLoading(false);
            });
    }, [id]);

    // ===== ЛОГІКА "СВОПУ" =====
    const handleThumbnailClick = (clickedImg, index) => {
        // Міняємо місцями головне фото і клікнуте додаткове
        const newMain = clickedImg;
        const newThumbnails = [...thumbnails];
        // Старе головне фото стає на місце клікнутого
        newThumbnails[index] = mainImage;

        setMainImage(newMain);
        setThumbnails(newThumbnails);
    };

    if (loading) {
        return (
            <main className="product-page">
                <div className="product-container">
                    <p>⏳ Завантаження...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-page">
                <div className="product-container">
                    <p>❌ Товар не знайдено</p>
                </div>
            </main>
        );
    }

    const isFavorite = favorites.includes(product._id);

    return (
        <main className="product-page">
            <div className="product-container">
                <div className="product-image">
                    <div className="main-image">
                        {mainImage ? (
                            <img src={mainImage} alt={product.name} />
                        ) : (
                            <p>Немає фото</p>
                        )}
                    </div>
                    {thumbnails.length > 0 && (
                        <div className="thumbnails-vertical">
                            {thumbnails.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className="thumbnail"
                                    onClick={() => handleThumbnailClick(img, index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="price">{product.price} грн</p>
                    <p className="description">{product.description}</p>
                    {product.sku && <p className="sku">SKU: {product.sku}</p>}
                    <p className="category">Категорія: {product.category}</p>
                    <div className="sizes">
                        {(product.sizes || ["XS", "S", "M", "L", "XL", "XXL"]).map((size) => (
                            <button
                                key={size}
                                className={`size-btn ${selectedSize === size ? "active" : ""}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`favorite-btn ${isFavorite ? "active" : ""}`}
                        onClick={() => toggleFavorite(product)}
                    >
                        {isFavorite ? "Видалити з обраного ❤️" : "Додати в обране 🤍"}
                    </button>
                    <button className="add-to-cart" onClick={() => addToCart(product)}>
                        Додати в кошик 🛒
                    </button>
                </div>
            </div>
        </main>
    );
}