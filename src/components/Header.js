import React, { useEffect, useState } from "react";
import "./Header.css";
// import { FaPhoneAlt, FaShoppingCart } from "react-icons/fa";
import { FaPhoneAlt, FaShoppingCart, FaHeart } from "react-icons/fa"; // 🔹 додаємо FaHeart
import { Link } from "react-router-dom"; // додаємо Link

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="container">
                <div className="logo">P T A S H K A</div>
                <nav className="nav">
                    <Link to="/" data-text="Головна">Головна</Link>
                    <Link to="/collection" data-text="Наша колекція">Наша колекція</Link>
                    <Link to="/about" data-text="Про нас">Про нас</Link>
                    <Link to="/services" data-text="Доставка">Доставка</Link>
                    <Link to="/contact" data-text="Контакти">Контакти</Link>
                </nav>
                <div className="actions">
                    <div className="phone-block">
                        <FaPhoneAlt className="icon" />
                        <a href="tel:+380501006507" className="phone-number">+38 (050) 100‑65‑07</a>
                    </div>
                    <FaHeart className="icon heart" />   {/* 🔹 нова іконка */}
                    <FaShoppingCart className="icon cart" />
                </div>
            </div>
        </header>
    );
}
