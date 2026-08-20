const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
    try {

        const {
            couponCode,
            ...orderData
        } = req.body;

        let discount = 0;
        let coupon = null;

        // =================================================
        // CHECK COUPON
        // =================================================

        if (couponCode) {

            const code = couponCode.trim().toUpperCase();

            coupon = await Coupon.findOne({
                code: code
            });

            if (!coupon) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid coupon code"
                });
            }

            if (!coupon.active) {
                return res.status(400).json({
                    success: false,
                    message: "This coupon is inactive"
                });
            }

            if (
                new Date() >
                new Date(coupon.expiryDate)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "This coupon has expired"
                });
            }

            if (
                coupon.usedCount >=
                coupon.usageLimit
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon usage limit reached"
                });
            }

        }

        // =================================================
        // CHECK PRODUCTS
        // =================================================

        if (
            !orderData.items ||
            orderData.items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Order must contain products"
            });
        }

        // =================================================
        // CALCULATE SUBTOTAL
        // =================================================

        let subtotal = 0;

        orderData.items.forEach(item => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;

            subtotal += price * quantity;

        });

        // =================================================
        // COUPON CALCULATION
        // =================================================

        if (coupon) {

            if (
                subtotal <
                coupon.minimumOrder
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Minimum order value is ₹${coupon.minimumOrder}`
                });
            }

            if (
                coupon.discountType ===
                "percentage"
            ) {

                discount =
                    subtotal *
                    coupon.discountValue /
                    100;

            } else {

                discount =
                    coupon.discountValue;

            }

            if (discount > subtotal) {
                discount = subtotal;
            }

            orderData.totalPrice =
                Math.round(
                    subtotal - discount
                );

            orderData.couponCode =
                coupon.code;

            orderData.discount =
                Math.round(discount);

        } else {

            // No coupon
            orderData.totalPrice =
                Math.round(subtotal);

            orderData.discount = 0;

        }

        // =================================================
        // DEFAULT ORDER STATUS
        // =================================================

        if (!orderData.status) {
            orderData.status = "Pending";
        }

        // =================================================
        // CREATE ORDER
        // =================================================

        const order =
            await Order.create(orderData);

        // =================================================
        // UPDATE COUPON USAGE
        // =================================================

        if (coupon) {

            const updatedCoupon =
                await Coupon.findOneAndUpdate(

                    {
                        _id: coupon._id,
                        usedCount: {
                            $lt:
                                coupon.usageLimit
                        }
                    },

                    {
                        $inc: {
                            usedCount: 1
                        }
                    },

                    {
                        new: true
                    }

                );

            if (!updatedCoupon) {

                await Order.findByIdAndDelete(
                    order._id
                );

                return res.status(400).json({
                    success: false,
                    message:
                        "Coupon usage limit reached. Please try again without the coupon."
                });

            }

        }

        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            success: true,

            message: "Order Placed",

            data: order

        });

    }

    catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// =====================================================
// GET ORDERS OF USER
// =====================================================

const getOrders = async (req, res) => {

    try {

        const userId =
            req.params.userId;

        let orders;

        if (userId) {

            orders =
                await Order.find({
                    userId: userId
                }).sort({
                    createdAt: -1
                });

        } else {

            orders =
                await Order.find({}).sort({
                    createdAt: -1
                });

        }

        res.status(200).json({

            success: true,

            data: orders

        });

    }

    catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// TRACK ORDER
// =====================================================

const trackOrder = async (req, res) => {

    try {

        const {
            orderId,
            phone
        } = req.body;

        if (!orderId || !phone) {

            return res.status(400).json({

                success: false,

                message:
                    "Order ID and phone number are required"

            });

        }

        const order =
            await Order.findOne({

                _id: orderId,

                phone: phone

            });

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found. Please check Order ID and phone number."

            });

        }

        res.status(200).json({

            success: true,

            data: order

        });

    }

    catch (error) {

        console.error(
            "Track Order Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (req, res) => {

    try {

        const {
            status
        } = req.body;

        const {
            id
        } = req.params;

        if (!status) {

            return res.status(400).json({

                success: false,

                message:
                    "Order status is required"

            });

        }

        const allowedStatuses = [

            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled"

        ];

        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status"

            });

        }

        const order =
            await Order.findByIdAndUpdate(

                id,

                {
                    status: status
                },

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }

        res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            data: order

        });

    }

    catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// UPDATE DELIVERY DATE
// =====================================================

const updateDeliveryDate = async (req, res) => {

    try {

        const {
            deliveryDate
        } = req.body;

        const {
            id
        } = req.params;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!deliveryDate) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivery date is required"

            });

        }

        // ==========================================
        // VALIDATE DATE
        // ==========================================

        const parsedDate =
            new Date(deliveryDate);

        if (
            isNaN(parsedDate.getTime())
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid delivery date"

            });

        }

        // ==========================================
        // UPDATE ORDER
        // ==========================================

        const order =
            await Order.findByIdAndUpdate(

                id,

                {
                    deliveryDate:
                        parsedDate
                },

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }

        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            success: true,

            message:
                "Delivery date updated successfully",

            data: order

        });

    }

    catch (error) {

        console.error(
            "Update Delivery Date Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({}).sort({

                createdAt: -1

            });

        console.log(
            "ALL ORDERS:",
            orders
        );

        res.status(200).json({

            success: true,

            data: orders

        });

    }

    catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createOrder,

    getOrders,

    getAllOrders,

    trackOrder,

    updateOrderStatus,

    updateDeliveryDate

};