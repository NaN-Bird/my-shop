import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminPanel.css";

const API_URL = "/api/products";
const CATEGORIES_URL = "/api/categories";
const UPLOAD_URL = "/api/upload";
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_IMAGES = 3;

export default function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // ← ДОДАНО
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        sku: "",
        image: "",
        images: [],
        sizes: [],
    });

    // ===== Завантаження товарів =====
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Помилка завантаження:", err));
    }, []);

    // ===== Завантаження категорій =====
    useEffect(() => {
        fetch(CATEGORIES_URL)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Помилка завантаження категорій:", err));
    }, []);

    // ===== Вихід з адмінки =====
    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        window.location.href = "/admin/login";
    };

    // ===== Зміна полів форми =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ===== Вибір розмірів =====
    const handleSizeToggle = (size) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    // ===== Завантаження головного фото =====
    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Будь ласка, виберіть зображення!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Фото не більше 5MB!");
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const res = await fetch(UPLOAD_URL, {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.imageUrl) {
                setFormData((prev) => ({ ...prev, image: data.imageUrl }));
                alert("✅ Головне фото завантажено!");
            }
        } catch (err) {
            console.error("Помилка завантаження:", err);
            alert("❌ Помилка завантаження фото");
        } finally {
            setUploading(false);
        }
    };

    // ===== Завантаження додаткових фото =====
    const handleAdditionalImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Будь ласка, виберіть зображення!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Фото не більше 5MB!");
            return;
        }

        if (formData.images.length >= MAX_IMAGES) {
            alert(`Максимум ${MAX_IMAGES} додаткових фото!`);
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const res = await fetch(UPLOAD_URL, {
                method: "POST",
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.imageUrl) {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, data.imageUrl],
                }));
                alert("✅ Додаткове фото завантажено!");
            }
        } catch (err) {
            console.error("Помилка завантаження:", err);
            alert("❌ Помилка завантаження фото");
        } finally {
            setUploading(false);
        }
    };

    // ===== Видалення додаткового фото =====
    const removeAdditionalImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // ===== Відправка форми =====
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category) {
            alert("Будь ласка, заповніть всі обов'язкові поля!");
            return;
        }

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description || "",
            sku: formData.sku || "",
            image: formData.image || "",
            images: formData.images || [],
            sizes: formData.sizes || [],
        };

        console.log("📦 Відправляємо товар:", productData);

        const method = editingProduct ? "PUT" : "POST";
        const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ Відповідь сервера:", data);
                if (editingProduct) {
                    setProducts(products.map((p) => (p._id === data._id ? data : p)));
                    setEditingProduct(null);
                } else {
                    setProducts([...products, data]);
                }
                setFormData({
                    name: "",
                    price: "",
                    category: "",
                    description: "",
                    sku: "",
                    image: "",
                    images: [],
                    sizes: [],
                });
            })
            .catch((err) => console.error("❌ Помилка збереження:", err));
    };

    // ===== Редагування товару =====
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description || "",
            sku: product.sku || "",
            image: product.image || "",
            images: product.images || [],
            sizes: product.sizes || [],
        });
    };

    // ===== Видалення товару =====
    const handleDelete = (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей товар?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setProducts(products.filter((p) => p._id !== id)))
            .catch((err) => console.error("Помилка видалення:", err));
    };

    // ===== RENDER =====
    return (
        <div className="admin-wrapper">
            <div className="admin-header">
                <h1 className="admin-title">🛍️ Керування товарами</h1>
                <div className="admin-header-actions">
                    <Link to="/admin/orders" className="btn-orders">
                        📦 Замовлення
                    </Link>
                    <Link to="/admin/categories" className="btn-categories">
                        🏷️ Категорії
                    </Link>
                    <Link to="/admin/instagram" className="btn-instagram">
                        📸 Instagram
                    </Link>
                    <Link to="/admin/reviews" className="btn-reviews">
                        💬 Відгуки
                    </Link>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Вийти
                    </button>
                </div>
            </div>

            <div className="admin-grid">
                <div className="admin-form-block">
                    <h2>{editingProduct ? "✏️ Редагувати товар" : "➕ Додати новий товар"}</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Назва товару *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Наприклад: Піжама бавовняна"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ціна (грн) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="450"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Артикул (SKU)</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="PJ-001"
                                />
                            </div>
                        </div>

                        {/* ===== КАТЕГОРІЇ З БД ===== */}
                        <div className="form-group">
                            <label>Категорія *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Оберіть категорію</option>
                                {categories.length === 0 ? (
                                    <option disabled>Спочатку додайте категорії</option>
                                ) : (
                                    categories.map((cat) => (
                                        <option key={cat._id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <small className="helper-text">
                                Керувати категоріями можна в розділі <Link to="/admin/categories">🏷️ Категорії</Link>
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Опис</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Короткий опис товару..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Головне фото</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <p>⏳ Завантаження...</p>}
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Головне фото" />
                                    <p className="helper-text">✅ Головне фото завантажено</p>
                                </div>
                            )}
                            <small className="helper-text">Максимум 5MB, формати: JPG, PNG, WEBP</small>
                        </div>

                        <div className="form-group">
                            <label>Додаткові фото (макс. {MAX_IMAGES})</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAdditionalImageUpload}
                                disabled={uploading || formData.images.length >= MAX_IMAGES}
                            />
                            {formData.images.length > 0 && (
                                <div className="additional-images-preview">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="additional-image-item">
                                            <img src={img} alt={`Додаткове фото ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => removeAdditionalImage(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <small className="helper-text">
                                Завантажено {formData.images.length} з {MAX_IMAGES} фото
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Розміри (виберіть доступні)</label>
                            <div className="sizes-checkbox-group">
                                {SIZE_OPTIONS.map((size) => (
                                    <label key={size} className="size-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.sizes.includes(size)}
                                            onChange={() => handleSizeToggle(size)}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingProduct ? "💾 Оновити" : "➕ Додати товар"}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setFormData({
                                            name: "",
                                            price: "",
                                            category: "",
                                            description: "",
                                            sku: "",
                                            image: "",
                                            images: [],
                                            sizes: [],
                                        });
                                    }}
                                >
                                    ❌ Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-list-block">
                    <h2>📋 Список товарів ({products.length})</h2>
                    {products.length === 0 ? (
                        <p className="empty-message">Товарів поки немає. Додайте перший!</p>
                    ) : (
                        <div className="product-list">
                            {products.map((product) => (
                                <div key={product._id} className="product-item">
                                    <div className="product-info">
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-meta">
                                            <span className="product-price">{product.price} грн</span>
                                            <span className="product-category">{product.category}</span>
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-mini-image"
                                                />
                                            )}
                                            {product.images && product.images.length > 0 && (
                                                <span className="product-images-count">
                                                    📸 +{product.images.length} фото
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="product-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(product)}>✏️</button>
                                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}