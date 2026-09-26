import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    const [showContacts, setShowContacts] = useState(false);

    return (
        <>
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

                <p className="footer-copy">
                    © 2026 P T A S H K A. Всі права захищені.
                    <br />
                    <span className="footer-author">
                        by{" "}
                        <button
                            className="author-link"
                            onClick={() => setShowContacts(true)}
                        >
                            NaN_Bird
                        </button>
                    </span>
                </p>
            </footer>

            {showContacts && (
                <div className="modal-overlay" onClick={() => setShowContacts(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Зв'язатися з розробником</h3>
                        <a
                            href="https://t.me/NaN_Bird"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            Telegram
                        </a>
                        <a
                            href="https://github.com/NaN-Bird"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://wa.me/NaN_Bird"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            WhatsApp
                        </a>
                        <button
                            className="modal-close"
                            onClick={() => setShowContacts(false)}
                        >
                            Закрити
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}