const express = require("express");

const router =
    express.Router();


const {

    getOrders,

    changeStatus,

    updateDeliveryDate,

    deleteOrder,

    getUserOrders,

    cancelOrder,

    exportOrders

} = require("../controllers/dashboardOrder");


// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

router.get(
    "/orders",
    getOrders
);


// =====================================================
// EXPORT ORDERS
// GET /api/admin/export
// =====================================================

router.get(
    "/export",
    exportOrders
);


// =====================================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id
// =====================================================

router.put(
    "/orders/:id",
    changeStatus
);


// =====================================================
// UPDATE DELIVERY DATE
// PUT /api/admin/orders/:id/delivery-date
// =====================================================

router.put(
    "/orders/:id/delivery-date",
    updateDeliveryDate
);


// =====================================================
// DELETE ORDER
// DELETE /api/admin/orders/:id
// =====================================================

router.delete(
    "/orders/:id",
    deleteOrder
);


// =====================================================
// CANCEL ORDER
// PUT /api/admin/cancel/:id
// =====================================================

router.put(
    "/cancel/:id",
    cancelOrder
);


// =====================================================
// GET USER ORDERS
// GET /api/admin/user/:userId
// =====================================================

router.get(
    "/user/:userId",
    getUserOrders
);


module.exports = router;