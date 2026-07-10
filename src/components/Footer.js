import React from "react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2 className="footer-logo">P T S H K A</h2>
                <ul className="footer-nav">
                    <li><a href="#catalog">Каталог</a></li>
                    <li><a href="#contacts">Контакти</a></li>
                    <li><a href="#about">Про нас</a></li>
                </ul>
                <div className="footer-social">
                    <a href="https://facebook.com">FB</a>
                    <a href="https://instagram.com">IG</a>
                </div>
            </div>
            <p className="footer-copy">© 2026 MyShop. Всі права захищені.</p>
        </footer>
    );
}
