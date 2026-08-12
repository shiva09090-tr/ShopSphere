const express = require("express");

const router = express.Router();

const {
    createOrder,
    getOrders,
    trackOrder
} = require("../controllers/orderController");


// Create Order
router.post("/", createOrder);


// Get User Orders
router.get("/:userId", getOrders);


// Track Order
router.post("/track", trackOrder);


module.exports = router;