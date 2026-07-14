import React, { useEffect, useState } from "react";
import "./Header.css";
import { FaPhoneAlt, FaShoppingCart } from "react-icons/fa";

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
                    <a href="#home" data-text="Головна">Головна</a>
                    <a href="#collection" data-text="Наша колекція">Наша колекція</a>
                    <a href="#about" data-text="Про нас">Про нас</a>
                    <a href="#services" data-text="Доставка">Доставка</a>
                    <a href="#contact" data-text="Контакти">Контакти</a>
                </nav>
                <div className="actions">
                    <div className="phone-block">
                        <FaPhoneAlt className="icon" />
                        <a href="tel:+380501006507" className="phone-number">+38 (050) 100‑65‑07</a>
                    </div>
                    <FaShoppingCart className="icon cart" />
                </div>
            </div>
        </header>
    );
}
