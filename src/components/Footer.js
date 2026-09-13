import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2 className="footer-logo">P T A S H K A</h2>
                <ul className="footer-nav">
                    <li>
                        <Link to="/collection">Колекція</Link>
                    </li>
                    <li>
                        <Link to="/contacts">Контакти</Link>
                    </li>
                    <li>
                        <Link to="/about">Про нас</Link>
                    </li>

                </ul>
                <div className="footer-social">
                    <a
                        href="https://www.facebook.com/твій_профіль"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="social-fb"
                    >
                        FB
                    </a>
                    <a
                        href="https://www.instagram.com/ptashka_ukrain/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="social-ig"
                    >
                        IG
                    </a>
                    <a
                        href="https://t.me/твій_нікнейм"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                        className="social-tg"
                    >
                        TG
                    </a>
                </div>
            </div>
            <p className="footer-copy">© 2026 P T A S H K A. Всі права захищені.</p>
        </footer>
    );
}