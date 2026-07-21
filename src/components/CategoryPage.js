// import  React, { useState } from "react";
// import "./CategoryPage.css";
// import { FaHeart } from "react-icons/fa";
// import { Link } from "react-router-dom"; // ✅ додаємо Link
//
// export default function CategoryPage({ title, products }) {
//     return (
//         <section className="category-page">
//             <h1>{title}</h1>
//             <div className="products-row">
//                 {products.map((item) => (
//                     <ProductCard key={item.id} item={item} />
//                 ))}
//             </div>
//         </section>
//     );
// }
//
// function ProductCard({ item }) {
//     const [favorite, setFavorite] = useState(false);
//
//     return (
//         <div className="product-card">
//             <div className="product-image">
//                 {/* ✅ Клік по фото веде на сторінку товару */}
//                 <Link to={`/product/${item.id}`}>
//                     <img src={item.image} alt={item.name} />
//                 </Link>
//
//                 {/* ❤️ Іконка "обране" */}
//                 <FaHeart
//                     className={`heart-icon ${favorite ? "active" : ""}`}
//                     onClick={() => setFavorite(!favorite)}
//                 />
//             </div>
//             <div className="product-info">
//                 <h3>{item.name}</h3>
//                 <p>{item.price}</p>
//             </div>
//         </div>
//     );
// }

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { menProducts } from "../data/menProducts";
import { womenProducts } from "../data/womenProducts";
import "./CategoryPage.css";

export default function CategoryPage() {
    const { category } = useParams();

    // 🔹 Вибір масиву залежно від категорії
    let products;
    switch (category) {
        case "men":
            products = menProducts;
            break;
        case "women":
            products = womenProducts;
            break;
        default:
            products = [];
    }

    if (!products || products.length === 0) {
        return (
            <section className="category-page">
                <h1>Товари не знайдено</h1>
            </section>
        );
    }

    return (
        <section className="category-page">
            <h1>{category === "men" ? "Чоловікам" : "Жінкам"}</h1>
            <div className="products-row">
                {products.map((item) => (
                    <ProductCard key={item.id} item={item} category={category} />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ item, category }) {
    const [favorite, setFavorite] = useState(false);

    return (
        <div className="product-card">
            <div className="product-image">
                {/* ✅ Клік по фото веде на сторінку товару */}
                <Link to={`/products/${category}/${item.id}`}>
                    <img src={item.image} alt={item.name} />
                </Link>

                {/* ❤️ Іконка "обране" */}
                <FaHeart
                    className={`heart-icon ${favorite ? "active" : ""}`}
                    onClick={() => setFavorite(!favorite)}
                />
            </div>
            <div className="product-info">
                <h3>{item.name}</h3>
                <p>{item.price}</p>
            </div>
        </div>
    );
}
