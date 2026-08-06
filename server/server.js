const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const path = require("path");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminApi = require("./routes/adminApi");
const dashboardStats = require("./routes/dashboardStats");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/dashboard-stats", dashboardStats);
app.use("/api/admin", adminApi);
app.get("/", (req, res) => {
    res.send("Welcome to ShopSphere API 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});