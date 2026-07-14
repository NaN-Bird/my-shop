import menBg from "../assets/men.jpg";
import womenBg from "../assets/women.jpg";
import "./Hero.css";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-block men">
                <img src={menBg} alt="For Men" className="hero-img" />
                <div className="hero-banner men-banner">
                    <span className="banner-text">Чоловікам</span>
                    <a href="#men" className="banner-link">КУПУВАТИ</a>
                </div>
            </div>

            <div className="hero-block women">
                <img src={womenBg} alt="For Women" className="hero-img" />
                <div className="hero-banner women-banner">
                    <span className="banner-text">Жінкам</span>
                    <a href="#women" className="banner-link">КУПУВАТИ</a>
                </div>
            </div>
        </section>


    );
}
