import React from "react";
import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="logo">P T A S H K A</div>
            <nav className="nav">
                <a href="#home" data-text="Home">Home</a>
                <a href="#about" data-text="О нас">О нас</a>
                <a href="#services" data-text="Доставка">Доставка</a>
                <a href="#contact" data-text="Контакти">Контакти</a>
            </nav>
        </header>
    );
}
