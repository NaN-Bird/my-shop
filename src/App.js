import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// ===== КОМПОНЕНТИ =====
import Header from "./components/Header";
import Footer from "./components/Footer";
import FavoritesPage from "./components/FavoritesPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";

// ===== СТОРІНКИ =====
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import DeliveryPage from "./pages/DeliveryPage";
import ContactsPage from "./pages/ContactsPage";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories";
import ReviewsPage from "./pages/ReviewsPage";
import AdminReviews from "./pages/AdminReviews";
import AdminInstagram from "./pages/AdminInstagram";


// ===== ЗАХИСТ МАРШРУТІВ =====
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    // ===== FAVORITES (з localStorage) =====
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        try {
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ===== CART (з localStorage) =====
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        try {
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ===== ЗБЕРЕЖЕННЯ В localStorage =====
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ===== ДОДАТИ В КОШИК =====
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id
                        ? {...item, quantity: (item.quantity || 1) + 1}
                        : item
                );
            }
            return [...prev, {...product, quantity: 1}];
        });
    };

    // ===== ВИДАЛИТИ З КОШИКА =====
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
    };

    // ===== ОНОВИТИ КІЛЬКІСТЬ =====
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item._id === id ? {...item, quantity: newQuantity} : item
            )
        );
    };

    // ===== ОЧИЩЕННЯ КОШИКА =====
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    // ===== ДОДАТИ/ВИДАЛИТИ З ОБРАНИХ =====
    const toggleFavorite = (product) => {
        setFavorites((prev) =>
            prev.includes(product._id)
                ? prev.filter((id) => id !== product._id)
                : [...prev, product._id]
        );
    };

    return (
        <Router>
            <div className="wrapper">
                <Header favorites={favorites} cart={cart}/>
                <main>
                    <Routes>
                        {/* ===== ПУБЛІЧНІ МАРШРУТИ ===== */}
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/collection" element={<CollectionPage/>}/>
                        <Route
                            path="/products/:category"
                            element={
                                <CategoryPage
                                    favorites={favorites}
                                    toggleFavorite={toggleFavorite}
                                />
                            }
                        />
                        <Route
                            path="/products/:category/:id"
                            element={
                                <ProductPage
                                    favorites={favorites}
                                    toggleFavorite={toggleFavorite}
                                    addToCart={addToCart}
                                />
                            }
                        />
                        <Route
                            path="/favorites"
                            element={
                                <FavoritesPage
                                    favorites={favorites}
                                    toggleFavorite={toggleFavorite}
                                />
                            }
                        />
                        <Route
                            path="/cart"
                            element={
                                <CartPage
                                    cart={cart}
                                    removeFromCart={removeFromCart}
                                    updateQuantity={updateQuantity}
                                />
                            }
                        />
                        <Route
                            path="/checkout"
                            element={<CheckoutPage cart={cart} clearCart={clearCart}/>}
                        />
                        <Route path="/about" element={<AboutPage/>}/>
                        <Route path="/delivery" element={<DeliveryPage/>}/>
                        <Route path="/contacts" element={<ContactsPage/>}/>

                        {/* ===== АДМІНКА (ЗАХИЩЕНА) ===== */}
                        <Route path="/admin/login" element={<AdminLogin/>}/>
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminPanel/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute>
                                    <AdminOrders/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/categories"
                            element={
                                <ProtectedRoute>
                                    <AdminCategories/>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route
                            path="/admin/reviews"
                            element={
                                <ProtectedRoute>
                                    <AdminReviews />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/instagram"
                            element={
                                <ProtectedRoute>
                                    <AdminInstagram />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}