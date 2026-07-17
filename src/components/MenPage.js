import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CategoryPage from "./CategoryPage";
import { menProducts } from "../data/menProducts";

export default function MenPage() {
    return (
        <div className="wrapper">
            <Header />
            <CategoryPage title="Чоловіки" products={menProducts} />
            <Footer />
        </div>
    );
}
