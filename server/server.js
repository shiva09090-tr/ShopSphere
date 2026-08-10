const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const path = require("path");
const multer = require("multer");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminApi = require("./routes/adminApi");
const dashboardStats = require("./routes/dashboardStats");
const couponRoutes = require("./routes/couponRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
const uploadPath = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadPath));
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/dashboard-stats", dashboardStats);
app.use("/api/admin", adminApi);
app.use(
    "/api/coupons",
    couponRoutes
);
app.get("/", (req, res) => {
    res.send("Welcome to ShopSphere API 🚀");
});

const PORT = process.env.PORT || 5000;
// ==========================================
// MULTER / UPLOAD ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    if (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    next();

});
app.use((err, req, res, next) => {

    console.error("🔥 SERVER ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message || "Server Error"
    });

});
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});