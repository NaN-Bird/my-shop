import menBg from "../assets/men.jpg";
import womenBg from "../assets/women.jpg";
import beddingBg from "../assets/bedding.jpg";
import pajamasBg from "../assets/pajamas.jpg";
import "./HeroCategories.css";
import { Link } from "react-router-dom";

export default function HeroCategories() {
    return (
        <section className="categories">
            <h2 className="categories-title">Наша Колекція</h2>

            {/* Контейнер для сітки */}
            <div className="categories-grid">
                <div className="category-card">
                    <Link to="/men">
                        <img src={menBg} alt="Чоловікам" />
                        <span className="category-label">Чоловікам</span>
                    </Link>
                </div>

                <div className="category-card">
                    <Link to="/bedding">
                        <img src={beddingBg} alt="Постільна білизна" />
                        <span className="category-label">Постільна білизна</span>
                    </Link>
                </div>

                <div className="category-card">
                    <Link to="/women">
                        <img src={womenBg} alt="Жінкам" />
                        <span className="category-label">Жінкам</span>
                    </Link>
                </div>

                <div className="category-card">
                    <Link to="/pajamas">
                        <img src={pajamasBg} alt="Піжами" />
                        <span className="category-label">Піжами</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
