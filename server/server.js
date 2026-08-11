const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

// Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminApi = require("./routes/adminApi");
const dashboardStats = require("./routes/dashboardStats");
const couponRoutes = require("./routes/couponRoutes");
const productRoutes = require("./routes/productRoutes");
const visitorRoutes = require("./routes/visitorRoutes");

// Database
const connectDB = require("./config/db");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==================================================
// UPLOADS
// ==================================================

const uploadPath = path.join(__dirname, "uploads");

app.use(
    "/uploads",
    express.static(uploadPath)
);

// ==================================================
// API ROUTES
// ==================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/dashboard-stats",
    dashboardStats
);

app.use(
    "/api/admin",
    adminApi
);

app.use(
    "/api/coupons",
    couponRoutes
);

// VISITOR ROUTES
app.use(
    "/api/visitors",
    visitorRoutes
);

// ==================================================
// HOME API
// ==================================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome to ShopSphere API 🚀"
    });

});

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });

});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((err, req, res, next) => {

    console.error("🔥 SERVER ERROR:");
    console.error(err);

    if (err instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    res.status(500).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error"
    });

});

// ==================================================
// SERVER
// ==================================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 ShopSphere Server Running on Port ${PORT}`
    );

});