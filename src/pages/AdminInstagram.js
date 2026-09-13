import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminInstagram.css";

const API_URL = "http://localhost:5000/instagram";
const UPLOAD_URL = "http://localhost:5000/upload";

export default function AdminInstagram() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        image: "",
        link: "https://www.instagram.com/ptashka_ukrain/",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch(`${API_URL}/all`)
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Помилка:", err));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
            console.error("Помилка:", err);
            alert("❌ Помилка завантаження");
        } finally {
            setUploading(false);
        }
    };

    // ===== ВІДПРАВКА =====
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert("Завантажте фото!");
            return;
        }

        const method = editingItem ? "PUT" : "POST";
        const url = editingItem ? `${API_URL}/${editingItem._id}` : API_URL;

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (editingItem) {
                    setItems(items.map((i) => (i._id === data._id ? data : i)));
                    setEditingItem(null);
                } else {
                    setItems([...items, data]);
                }
                setFormData({
                    image: "",
                    link: "https://www.instagram.com/ptashka_ukrain/",
                    order: 0,
                    isActive: true,
                });
            })
            .catch((err) => console.error("Помилка:", err));
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            image: item.image,
            link: item.link || "https://www.instagram.com/ptashka_ukrain/",
            order: item.order || 0,
            isActive: item.isActive !== false,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Видалити це фото?")) return;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => setItems(items.filter((i) => i._id !== id)));
    };

    const toggleActive = (item) => {
        fetch(`${API_URL}/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !item.isActive }),
        })
            .then((res) => res.json())
            .then((updated) => {
                setItems(items.map((i) => (i._id === updated._id ? updated : i)));
            });
    };

    return (
        <div className="admin-instagram">
            <div className="instagram-header">
                <h1>📸 Керування Instagram-фото</h1>
                <Link to="/admin" className="btn-back">← Назад до товарів</Link>
            </div>

            <div className="admin-grid">
                {/* Форма */}
                <div className="admin-form-block">
                    <h2>{editingItem ? "✏️ Редагувати фото" : "➕ Додати фото"}</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Фото *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <p>⏳ Завантаження...</p>}
                            {formData.image && (
                                <div className="image-preview">
                                    <img src={formData.image} alt="Instagram" />
                                </div>
                            )}
                            <small className="helper-text">Максимум 5MB, рекомендовано 1080x1080</small>
                        </div>

                        <div className="form-group">
                            <label>Посилання</label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="https://www.instagram.com/ptashka_ukrain/"
                            />
                            <small className="helper-text">Куди веде клік</small>
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
                            <small className="helper-text">Менше число — вище в слайдері</small>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                Показувати на сайті
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingItem ? "💾 Оновити" : "➕ Додати"}
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingItem(null);
                                        setFormData({
                                            image: "",
                                            link: "https://www.instagram.com/ptashka_ukrain/",
                                            order: 0,
                                            isActive: true,
                                        });
                                    }}
                                >
                                    ❌ Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Список */}
                <div className="admin-list-block">
                    <h2>📋 Фото ({items.length})</h2>
                    {items.length === 0 ? (
                        <p className="empty-message">Фото поки немає</p>
                    ) : (
                        <div className="instagram-list">
                            {items.map((item) => (
                                <div key={item._id} className="instagram-item">
                                    <img src={item.image} alt="Instagram" className="instagram-mini-image" />
                                    <div className="instagram-info">
                                        <div className="instagram-link">🔗 {item.link.slice(0, 40)}...</div>
                                        <div className={`instagram-status ${item.isActive ? "active" : "inactive"}`}>
                                            {item.isActive ? "✅ Активне" : "❌ Вимкнено"}
                                        </div>
                                    </div>
                                    <div className="instagram-actions">
                                        <button
                                            className="btn-toggle"
                                            onClick={() => toggleActive(item)}
                                            title={item.isActive ? "Вимкнути" : "Увімкнути"}
                                        >
                                            {item.isActive ? "👁️" : "🚫"}
                                        </button>
                                        <button className="btn-edit" onClick={() => handleEdit(item)}>✏️</button>
                                        <button className="btn-delete" onClick={() => handleDelete(item._id)}>🗑️</button>
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