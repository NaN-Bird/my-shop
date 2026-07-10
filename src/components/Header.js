import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Order from "./Order";
import "./Header.css";

export default function Header(props) {
    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const showOrders = () => {
        let suma = 0;
        props.orders.forEach(el => (suma += Number.parseFloat(el.price)));
        return (
            <div>
                {props.orders.map(el => (
                    <Order onDelete={props.onDelete} key={el.id} item={el} />
                ))}
                <p className="suma">
                    Сума: {new Intl.NumberFormat().format(suma)} грн.
                </p>
            </div>
        );
    };

    const showNothing = () => (
        <div className="empty">
            <h2>Товарів немає</h2>
        </div>
    );

    return (
        <header className="header">
            <div className="logo">House staff</div>
            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                <a href="#home">Home</a>
                <a href="#about">О нас</a>
                <a href="#services">Доставка</a>
                <a href="#contact">Контакти</a>
                <button className="btn">Get Started</button>
            </nav>
            <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <FaCartShopping
                onClick={() => setCartOpen(prev => !prev)}
                className={`shop-cart-button ${cartOpen ? "active" : ""}`}
            />
            {cartOpen && (
                <div className="shop-cart">
                    {props.orders.length > 0 ? showOrders() : showNothing()}
                </div>
            )}
        </header>
    );
}
