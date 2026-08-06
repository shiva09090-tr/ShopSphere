const express = require("express");

const router = express.Router();

const {

    getOrders,
    changeStatus,
    deleteOrder,
    getUserOrders,
    cancelOrder,
    exportOrders

} = require("../controllers/dashboardOrder");
// Get All Orders
router.get("/orders", getOrders);
router.get("/export", exportOrders);

// Update Status
router.put("/orders/:id", changeStatus);
router.delete("/orders/:id", deleteOrder);
router.put("/cancel/:id", cancelOrder);
router.get("/user/:userId", getUserOrders);
router.put("/cancel/:id", cancelOrder);

module.exports = router;