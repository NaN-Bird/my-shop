import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CategoryPage from "./CategoryPage";
import { womenProducts } from "../data/womenProducts";

export default function WomenPage() {
    return (
        <div className="wrapper">
            <Header />
            <CategoryPage title="Жінки" products={womenProducts} />
            <Footer />
        </div>
    );
}
