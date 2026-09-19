import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("adminAuth", "true");
                navigate("/admin");
            } else {
                setError("❌ Невірний пароль! Спробуйте ще раз.");
                setPassword("");
            }
        } catch (err) {
            setError("❌ Помилка з'єднання з сервером");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <h1>🔐 Вхід в адмінку</h1>
                <p>Введіть пароль для доступу</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        required
                        disabled={loading}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "⏳ Перевірка..." : "Увійти"}
                    </button>
                </form>
            </div>
        </div>
    );
}