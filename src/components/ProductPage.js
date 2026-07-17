import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { menProducts } from "../data/menProducts"; // або womenProducts
import "./ProductPage.css";

function ProductPage() {
    const { id } = useParams();
    const product = menProducts.find((p) => p.id.toString() === id);

    const [selectedSize, setSelectedSize] = useState(null);

    if (!product) {
        return (
            <>
                <Header />
                <main className="product-page">
                    <p>Товар не знайдено</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="product-page">
                <div className="product-container">
                    <div className="product-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="price">{product.price}</p>
                        <p className="description">{product.description}</p>
                        <p className="sku">SKU: {product.sku}</p>
                        <p className="category">Category: {product.category}</p>

                        {/* 🔹 Клікабельні розміри */}
                        <div className="sizes">
                            {["XS","S", "M", "L", "XL","XXL"].map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <button className="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ProductPage;
