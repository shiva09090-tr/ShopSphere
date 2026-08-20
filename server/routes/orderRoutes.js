const express = require("express");

const router = express.Router();

const {

    createOrder,

    getOrders,

    getAllOrders,

    trackOrder

} = require("../controllers/orderController");


router.post("/", createOrder);


// ALL ORDERS
router.get("/all", getAllOrders);


// TRACK ORDER
router.post("/track", trackOrder);


// USER ORDERS
router.get("/:userId", getOrders);


module.exports = router;