import React from "react";
import { Link } from "react-router-dom"; // якщо використовуєш react-router
import menBg from "../assets/men.jpg";
import womenBg from "../assets/women.jpg";
import "./Hero.css";

export default function Hero() {
    return (
        <section className="hero">
            {/* Чоловічий блок */}
            <div className="hero-block men">
                <Link to="/products/men" className="hero-link">
                    <img src={menBg} alt="For Men" className="hero-img" />
                    <div className="hero-banner men-banner">
                        <span className="banner-text">Чоловікам</span>
                        <span className="banner-link">КУПУВАТИ</span>
                    </div>
                </Link>
            </div>

            {/* Жіночий блок */}
            <div className="hero-block women">
                <Link to="/products/women" className="hero-link">
                    <img src={womenBg} alt="For Women" className="hero-img" />
                    <div className="hero-banner women-banner">
                        <span className="banner-text">Жінкам</span>
                        <span className="banner-link">КУПУВАТИ</span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
