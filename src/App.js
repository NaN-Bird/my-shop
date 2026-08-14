import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HeroCategories from "./components/HeroCategories";
import CategoryPage from "./components/CategoryPage";
import ProductPage from "./components/ProductPage";
import FavoritesPage from "./components/FavoritesPage";
import CartPage from "./components/CartPage";
import { menProducts } from "./data/menProducts";
import { womenProducts } from "./data/womenProducts";
import { beddingProducts } from "./data/beddingProducts";
import { pajamasProducts } from "./data/pajamasProducts";
import CheckoutPage from "./components/CheckoutPage";
import InstagramSlider from "./components/InstagramSlider";

export default function App() {
    // ✅ Favorites з localStorage
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            try {
                return JSON.parse(savedFavorites);
            } catch (e) {
                console.error("Помилка читання favorites:", e);
                return [];
            }
        }
        return [];
    });

    // ✅ Cart з localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                return parsed.map(item =>
                    item.quantity ? item : { ...item, quantity: 1 }
                );
            } catch (e) {
                console.error("Помилка читання кошика:", e);
                return [];
            }
        }
        return [];
    });

    // ✅ Зберігаємо favorites при кожній зміні
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // ✅ Зберігаємо cart при кожній зміні
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ✅ Додавання у кошик
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    // ✅ Видалення з кошика
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter(item => item.id !== id));
    };

    // ✅ Оновлення кількості
    const updateQuantity = (id, newQuantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // ✅ Додавання/видалення з обраних
    const toggleFavorite = (product) => {
        setFavorites((prev) =>
            prev.includes(product.id)
                ? prev.filter((id) => id !== product.id)
                : [...prev, product.id]
        );
    };

    return (
        <Router>
            <div className="wrapper">
                <Header favorites={favorites} cart={cart} />
                <Routes>
                    <Route path="/" element={<><Hero /><HeroCategories /><InstagramSlider /></>} />
                    <Route path="/products/:category" element={<CategoryPage favorites={favorites} toggleFavorite={toggleFavorite} />} />
                    <Route path="/products/:category/:id" element={<ProductPage favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} />} />
                    <Route path="/favorites" element={<FavoritesPage favorites={favorites} products={[...menProducts, ...womenProducts, ...beddingProducts, ...pajamasProducts]} toggleFavorite={toggleFavorite} />} />
                    <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

