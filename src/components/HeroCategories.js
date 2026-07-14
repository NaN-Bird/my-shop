import menBg from "../assets/men.jpg";
import womenBg from "../assets/women.jpg";
import beddingBg from "../assets/bedding.jpg";
import pajamasBg from "../assets/pajamas.jpg";
import "./HeroCategories.css";

export default function HeroCategories() {
    return (
        <section className="categories">
            <h2 className="categories-title">Наша Колекція</h2>
            <div className="categories-grid">
                <div className="category-card">
                    <img src={menBg} alt="Чоловікам" />
                    <span className="category-label">Чоловікам</span>
                </div>
                <div className="category-card">
                    <img src={beddingBg} alt="Постільна білизна" />
                    <span className="category-label">Постільна білизна</span>
                </div>
                <div className="category-card">
                    <img src={womenBg} alt="Жінкам" />
                    <span className="category-label">Жінкам</span>
                </div>
                <div className="category-card">
                    <img src={pajamasBg} alt="Піжами" />
                    <span className="category-label">Піжами</span>
                </div>
            </div>
        </section>
    );
}
