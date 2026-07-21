import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HeroCategories from "./components/HeroCategories";
import CategoryPage from "./components/CategoryPage";
import ProductPage from "./components/ProductPage";
import FavoritesPage from "./components/FavoritesPage";

import { menProducts } from "./data/menProducts";
import { womenProducts } from "./data/womenProducts";
import { beddingProducts } from "./data/beddingProducts";
import { pajamasProducts } from "./data/pajamasProducts";

export default function App() {
    const [favorites, setFavorites] = useState([]);

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
                {/* ✅ Header завжди отримує favorites */}
                <Header favorites={favorites} />
                <Routes>
                    {/* Головна сторінка */}
                    <Route path="/" element={
                        <>
                            <Hero />
                            <HeroCategories />
                            <Footer />
                        </>
                    } />

                    {/* Категорії */}
                    <Route
                        path="/products/:category"
                        element={<CategoryPage favorites={favorites} toggleFavorite={toggleFavorite} />}
                    />

                    {/* Сторінка товару */}
                    <Route
                        path="/products/:category/:id"
                        element={<ProductPage favorites={favorites} toggleFavorite={toggleFavorite} />}
                    />

                    {/* Обране */}
                    <Route
                        path="/favorites"
                        element={
                            <FavoritesPage
                                favorites={favorites}
                                products={[
                                    ...menProducts,
                                    ...womenProducts,
                                    ...beddingProducts,
                                    ...pajamasProducts
                                ]}
                                toggleFavorite={toggleFavorite}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}
