import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// ===== ЗАВАНТАЖУЄМО ЗМІННІ З .env =====
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ===== ПЕРЕВІРКА ПАРОЛЯ =====
console.log("🔐 ADMIN_PASSWORD з .env:", process.env.ADMIN_PASSWORD);

// ===== Авторизація для адмінки =====
app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password === adminPassword) {
        res.json({ success: true, message: "Доступ дозволено" });
    } else {
        res.status(401).json({ success: false, message: "Невірний пароль" });
    }
});

// ===== Підключення Cloudinary =====
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("🔑 Cloudinary налаштовано!");

// ===== Налаштування Multer =====
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "my-shop/products",
        format: async (req, file) => "webp",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const upload = multer({ storage: storage });

// ===== Підключення MongoDB =====
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myshop")
    .then(() => console.log("✅ MongoDB підключено!"))
    .catch((err) => console.error("❌ Помилка MongoDB:", err));

// ===== EMAIL ВИМКНЕНО (провайдер блокує SMTP) =====
console.log("⚠️ Email вимкнено — використовується Telegram");

// ===== СХЕМА ТОВАРУ =====
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    sku: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", ProductSchema);

// ===== СХЕМА ЗАМОВЛЕННЯ =====
const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: "" },
        comment: { type: String, default: "" },
    },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, default: "" },
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["new", "processing", "shipped", "completed", "cancelled"],
        default: "new"
    },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

// ===== СХЕМА КАТЕГОРІЇ =====
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", CategorySchema);

// ===== СХЕМА ВІДГУКУ =====
const ReviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", ReviewSchema);

// ===== API ДЛЯ ЗАВАНТАЖЕННЯ ФОТО =====
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Файл не завантажено" });
        }
        const imageUrl = req.file.path;
        console.log("✅ Завантажено в Cloudinary:", imageUrl);
        res.json({ imageUrl });
    } catch (err) {
        console.error("❌ Помилка Cloudinary:", err);
        res.status(500).json({ error: err.message });
    }
});

// ===== CRUD ДЛЯ ТОВАРІВ =====
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Товар не знайдено" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/products/:id", async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updated) return res.status(404).json({ message: "Товар не знайдено" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Товар не знайдено" });
        res.json({ message: "Товар видалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== API ДЛЯ ЗАМОВЛЕНЬ =====
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Замовлення не знайдено" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/orders/:id", async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updated) return res.status(404).json({ message: "Замовлення не знайдено" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/orders/:id", async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Замовлення не знайдено" });
        res.json({ message: "Замовлення видалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== API ДЛЯ КАТЕГОРІЙ =====
app.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/categories", async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/categories/:id", async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updated) return res.status(404).json({ message: "Категорію не знайдено" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/categories/:id", async (req, res) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Категорію не знайдено" });
        res.json({ message: "Категорію видалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== API ДЛЯ ВІДГУКІВ =====
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/reviews/all", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/reviews", async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/reviews/:id", async (req, res) => {
    try {
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updated) return res.status(404).json({ message: "Відгук не знайдено" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/reviews/:id", async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Відгук не знайдено" });
        res.json({ message: "Відгук видалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ===== СХЕМА INSTAGRAM =====
const InstagramSchema = new mongoose.Schema({
    image: { type: String, required: true },
    link: { type: String, default: "https://www.instagram.com/ptashka_ukrain/" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Instagram = mongoose.model("Instagram", InstagramSchema);

// ===== API ДЛЯ INSTAGRAM =====
// Активні (публічний)
app.get("/instagram", async (req, res) => {
    try {
        const items = await Instagram.find({ isActive: true }).sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ВСІ (адмін)
app.get("/instagram/all", async (req, res) => {
    try {
        const items = await Instagram.find().sort({ order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Створити
app.post("/instagram", async (req, res) => {
    try {
        const item = new Instagram(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Оновити
app.put("/instagram/:id", async (req, res) => {
    try {
        const updated = await Instagram.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updated) return res.status(404).json({ message: "Фото не знайдено" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Видалити
app.delete("/instagram/:id", async (req, res) => {
    try {
        const deleted = await Instagram.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Фото не знайдено" });
        res.json({ message: "Фото видалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== ДИНАМІЧНИЙ SITEMAP =====
app.get("/sitemap.xml", async (req, res) => {
    try {
        const baseUrl = "https://ptashka.com.ua";

        // Отримуємо всі товари, категорії
        const products = await Product.find();
        const categories = await Category.find();

        // Статичні сторінки
        const staticPages = [
            { url: "/", priority: "1.0", changefreq: "daily" },
            { url: "/collection", priority: "0.9", changefreq: "weekly" },
            { url: "/about", priority: "0.7", changefreq: "monthly" },
            { url: "/delivery", priority: "0.7", changefreq: "monthly" },
            { url: "/contacts", priority: "0.7", changefreq: "monthly" },
            { url: "/reviews", priority: "0.6", changefreq: "weekly" },
        ];

        // Формуємо XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Статичні сторінки
        staticPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        // Категорії
        categories.forEach(cat => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/products/${cat.slug}</loc>\n`;
            xml += `    <lastmod>${new Date(cat.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });

        // Товари
        products.forEach(prod => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/products/${prod.category}/${prod._id}</loc>\n`;
            xml += `    <lastmod>${new Date(prod.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (err) {
        console.error("Помилка sitemap:", err);
        res.status(500).send("Помилка генерації sitemap");
    }
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(5000, () => console.log("🚀 Server running on port 5000"));

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(5000, () => console.log("🚀 Server running on port 5000"));