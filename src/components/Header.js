import React, { useEffect, useState } from "react";
import "./Header.css";
import { FaPhoneAlt, FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header({ favorites = [], cart = [] }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="container">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>P T A S H K A</Link>
                </div>

                {/* Бургер-кнопка */}
                <button className="burger-btn" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Навігація */}
                <nav className={`nav ${menuOpen ? "open" : ""}`}>
                    <Link to="/" data-text="Головна" onClick={closeMenu}>Головна</Link>
                    <Link to="/collection" data-text="Наша колекція" onClick={closeMenu}>Наша колекція</Link>
                    <Link to="/about" data-text="Про нас" onClick={closeMenu}>Про нас</Link>
                    <Link to="/delivery" data-text="Доставка" onClick={closeMenu}>Доставка</Link>
                    <Link to="/contacts" data-text="Контакти" onClick={closeMenu}>Контакти</Link>
                </nav>

                <div className="actions">
                    <a href="tel:+380501006507" className="phone-block">
                        <FaPhoneAlt className="icon" />
                        <span className="phone-number">+38 (050) 100-65-07</span>
                    </a>

                    <Link to="/favorites" className="favorites-link">
                        <FaHeart className="icon heart" />
                        <span className="favorites-count">{favorites.length}</span>
                    </Link>

                    <Link to="/cart" className="cart-link">
                        <FaShoppingCart className="icon cart" />
                        <span className="cart-count">{cart.length}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}