import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { menProducts } from "../data/menProducts";
import { womenProducts } from "../data/womenProducts";
import { beddingProducts } from "../data/beddingProducts";
import { pajamasProducts } from "../data/pajamasProducts";
import "./ProductPage.css";

function ProductPage({ favorites = [], toggleFavorite }) {
    const { category, id } = useParams();

    // 🔹 Вибираємо масив залежно від категорії
    let products = [];
    switch (category) {
        case "men":
            products = menProducts;
            break;
        case "women":
            products = womenProducts;
            break;
        case "bedding":
            products = beddingProducts;
            break;
        case "pajamas":
            products = pajamasProducts;
            break;
        default:
            products = [];
    }

    const product = products.find((p) => p.id.toString() === id);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(product?.image);
    const [images, setImages] = useState(product?.images || []);

    if (!product) {
        return (


                <main className="product-page">
                    <p>Товар не знайдено</p>
                </main>


        );
    }

    // 🔹 Swap‑логіка: міняємо місцями головне фото і клікнуте прев’ю
    const handleImageClick = (img) => {
        const oldMain = selectedImage;
        setSelectedImage(img);

        const updatedImages = images.map((i) =>
            i === img ? oldMain : i
        );
        setImages(updatedImages);
    };

    const isFavorite = favorites.includes(product.id);

    return (
        <>
            <main className="product-page">
                <div className="product-container">
                    <div className="product-image">
                        <div className="main-image">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                key={selectedImage}
                                className="fade-in"
                            />
                        </div>

                        {images.length > 0 && (
                            <div className="thumbnails-vertical">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.name} ${index}`}
                                        className={selectedImage === img ? "active" : ""}
                                        onClick={() => handleImageClick(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="price">{product.price}</p>
                        <p className="description">{product.description}</p>
                        <p className="sku">SKU: {product.sku}</p>
                        <p className="category">Category: {product.category}</p>

                        <div className="sizes">
                            {["XS","S","M","L","XL","XXL"].map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <button className="add-to-cart">Додати в кошик</button>

                        {/* ❤️ Кнопка для обраного */}
                        <button
                            className={`favorite-btn ${isFavorite ? "active" : ""}`}
                            onClick={() => toggleFavorite(product)}
                        >
                            {isFavorite ? "Видалити з обраного ❤️" : "Додати в обране 🤍"}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ProductPage;
