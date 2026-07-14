import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HeroCategories from "./components/HeroCategories";

class App extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <Header />
                <Hero />
                <HeroCategories />
                <Footer />
            </div>
        );
    }
}

export default App;
