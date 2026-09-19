import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminCategories.css";

const API_URL = "/api/categories";
const UPLOAD_URL = "/api/upload";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        order: 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Помилка завантаження:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ===== АВТОГЕНЕРАЦІЯ SLUG =====
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9а-яіїєґ\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name: name,
            slug: prev.slug || generateSlug(name),
        }));
    };

    // ===== ЗАВАНТАЖЕННЯ ФОТО =====
    const handleImageUpload = async (e) => {
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
                alert("✅ Фото завантажено!");
            }
        } catch (err) {
            console.error("Помилка завантаження:", err);
            alert("❌ Помилка завантаження фото");
        } finally {
            setUploading(false);
        }
    };

    // ===== ВІДПРАВКА ФОРМИ =====
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.slug) {
            alert("Заповніть назву та slug!");
            return;
        }

        const categoryData = {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || "",
            image: formData.image || "",
            order: parseInt(formData.order) || 0,
        };

        const method = editingCategory ? "PUT" : "POST";
        const url = editingCategory ? `${API_URL}/${editingCategory._id}` : API_URL;

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (editingCategory) {
                    setCategories(categories.map((c) => (c._id === data._id ? data : c)));
                    setEditingCategory(null);
                } else {
                    setCategories([...categories, data]);
                }
                setFormData({ name: "", slug: "", description: "", image: "", order: 0 });
            })
            .catch((err) => console.error("Помилка збереження:", err));
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            image: category.image || "",
            order: category.order || 0,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити категорію?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setCategories(categories.filter((c) => c._id !== id)))
            .catch((err) => console.error("Помилка видалення:", err));
    };

    return (
        <div className="admin-categories">
            <div className="categories-header">
                <h1>🏷️ Керування категоріями</h1>
                <Link to="/admin" className="btn-back">← Назад до товарів</Link>
            </div>

            <div className="admin-grid">
                {/* ===== ФОРМА ===== */}
                <div className="admin-form-block">
                    <h2>{editingCategory ? "✏️ Редагувати категорію" : "➕ Додати категорію"}</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Назва категорії *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="Наприклад: Чоловіки"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Slug (URL) *</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="men"
                                required
                            />
                            <small className="helper-text">
                                Використовується в URL: /products/<strong>{formData.slug || "slug"}</strong>
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Опис</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Короткий опис категорії..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Фото категорії</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <p>⏳ Завантаження...</p>}
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Фото категорії" />
                                </div>
                            )}
                            <small className="helper-text">Максимум 5MB</small>
                        </div>

                        <div className="form-group">
                            <label>Порядок відображення</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                placeholder="0"
                            />
                            <small className="helper-text">Менше число — вище в списку</small>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingCategory ? "💾 Оновити" : "➕ Додати"}
                            </button>
                            {editingCategory && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setFormData({ name: "", slug: "", description: "", image: "", order: 0 });
                                    }}
                                >
                                    ❌ Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ===== СПИСОК ===== */}
                <div className="admin-list-block">
                    <h2>📋 Список категорій ({categories.length})</h2>
                    {categories.length === 0 ? (
                        <p className="empty-message">Категорій поки немає</p>
                    ) : (
                        <div className="category-list">
                            {categories.map((category) => (
                                <div key={category._id} className="category-item">
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="category-mini-image"
                                        />
                                    )}
                                    <div className="category-info">
                                        <div className="category-name">{category.name}</div>
                                        <div className="category-slug">/{category.slug}</div>
                                    </div>
                                    <div className="category-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(category)}>✏️</button>
                                        <button className="btn-delete" onClick={() => handleDelete(category._id)}>🗑️</button>
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