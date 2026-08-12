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

            const code =
                couponCode
                    .trim()
                    .toUpperCase();


            coupon =
                await Coupon.findOne({
                    code: code
                });


            // Coupon does not exist
            if (!coupon) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid coupon code"

                });

            }


            // Coupon inactive
            if (!coupon.active) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This coupon is inactive"

                });

            }


            // Coupon expired
            if (
                new Date() >
                new Date(coupon.expiryDate)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This coupon has expired"

                });

            }


            // Usage limit reached
            if (
                coupon.usedCount >=
                coupon.usageLimit
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Coupon usage limit reached"

                });

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

                    message:
                        "Order must contain products"

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

                subtotal +=
                    price * quantity;

            });


            // =================================================
            // MINIMUM ORDER CHECK
            // =================================================

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


            // =================================================
            // CALCULATE DISCOUNT
            // =================================================

            if (
                coupon.discountType ===
                "percentage"
            ) {

                discount =
                    subtotal *
                    coupon.discountValue /
                    100;

            }

            else {

                discount =
                    coupon.discountValue;

            }


            // Discount cannot exceed subtotal

            if (
                discount >
                subtotal
            ) {

                discount =
                    subtotal;

            }


            // =================================================
            // SAVE COUPON INFORMATION IN ORDER
            // =================================================

            orderData.totalPrice =
                Math.round(
                    subtotal - discount
                );


            orderData.couponCode =
                coupon.code;


            orderData.discount =
                Math.round(discount);

        }


        // =================================================
        // CREATE ORDER FIRST
        // =================================================

        const order =
            await Order.create(
                orderData
            );


        // =================================================
        // INCREASE COUPON USAGE
        // ONLY AFTER ORDER SUCCESS
        // =================================================

        if (coupon) {

            const updatedCoupon =
                await Coupon.findOneAndUpdate(

                    {
                        _id: coupon._id,

                        // Important:
                        // Do not allow usage above limit
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


            // Coupon became unavailable
            // between validation and order creation

            if (!updatedCoupon) {

                // Delete the order because
                // coupon could not be consumed

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

            message:
                "Order Placed",

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

            message:
                error.message

        });

    }

};


// =====================================================
// GET ORDERS OF USER
// =====================================================

const getOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({

                userId:
                    req.params.userId

            });


        res.status(200).json({

            success: true,

            data: orders

        });

    }


    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};
// ==========================================
// TRACK ORDER
// ==========================================

const trackOrder = async (req, res) => {

    try {

        const { orderId, phone } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!orderId || !phone) {

            return res.status(400).json({

                success: false,

                message:
                    "Order ID and phone number are required"

            });

        }


        // ==========================================
        // FIND ORDER
        // ==========================================

        const order =
            await Order.findOne({
                _id: orderId,
                phone: phone
            });


        // ==========================================
        // ORDER NOT FOUND
        // ==========================================

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found. Please check Order ID and phone number."

            });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        res.status(200).json({

            success: true,

            data: order

        });


    } catch (error) {

        console.error(
            "Track Order Error:",
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
// EXPORT
// =====================================================

module.exports = {
    createOrder,
    getOrders,
    trackOrder
};