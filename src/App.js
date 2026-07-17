import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HeroCategories from "./components/HeroCategories";
import WomenPage from "./components/WomenPage";
import MenPage from "./components/MenPage"; // 🔹 додаємо імпорт
import ProductPage from "./components/ProductPage";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="wrapper">
                    <Routes>
                        {/* Головна сторінка */}
                        <Route path="/" element={
                            <>
                                <Header />
                                <Hero />
                                <HeroCategories />
                                <Footer />
                            </>
                        } />

                        {/* Сторінка категорії Жінки */}
                        <Route path="/women" element={<WomenPage />} />
                        {/* Сторінка категорії Чоловіки */}
                        <Route path="/men" element={<MenPage />} />
                        <Route path="/product/:id" element={<ProductPage />} />

                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
