const Order = require("../models/Order");
const Product = require("../models/Product");
const ExcelJS = require("exceljs");


// =====================================================
// GET ALL ORDERS
// =====================================================

const getOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({})
                .sort({
                    createdAt: -1
                });

        res.status(200).json({

            success: true,

            count: orders.length,

            data: orders

        });

    } catch (err) {

        console.error(
            "Get Orders Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const changeStatus = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order Not Found"

            });

        }


        const newStatus =
            req.body.status;


        if (!newStatus) {

            return res.status(400).json({

                success: false,

                message: "Status is required"

            });

        }


        const allowedStatuses = [

            "Pending",
            "Confirmed",
            "Packed",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(
                newStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status"

            });

        }


        const oldStatus =
            order.status;


        // Reduce stock only once
        // when order reaches Confirmed

        if (
            newStatus === "Confirmed" &&
            oldStatus !== "Confirmed"
        ) {

            for (
                const item of order.items || []
            ) {

                const product =
                    await Product.findById(
                        item.productId
                    );

                if (product) {

                    product.stock -=
                        Number(
                            item.quantity
                        ) || 0;

                    if (
                        product.stock < 0
                    ) {

                        product.stock = 0;

                    }

                    await product.save();

                }

            }

        }


        order.status =
            newStatus;


        await order.save();


        res.status(200).json({

            success: true,

            message:
                "Status Updated",

            data: order

        });

    } catch (err) {

        console.error(
            "Change Status Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// UPDATE DELIVERY DATE
// =====================================================

const updateDeliveryDate = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const {
            deliveryDate
        } = req.body;


        console.log(
            "Delivery Date Request:",
            id,
            deliveryDate
        );


        if (!deliveryDate) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivery date is required"

            });

        }


        const parsedDate =
            new Date(
                deliveryDate
            );


        if (
            isNaN(
                parsedDate.getTime()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid delivery date"

            });

        }


        const order =
            await Order.findById(id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        order.deliveryDate =
            parsedDate;


        await order.save();


        console.log(
            "Delivery Date Updated:",
            order.deliveryDate
        );


        res.status(200).json({

            success: true,

            message:
                "Delivery date updated successfully",

            data: order

        });

    } catch (err) {

        console.error(
            "Update Delivery Date Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// DELETE ORDER
// =====================================================

const deleteOrder = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        await Order.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                "Order Deleted Successfully"

        });

    } catch (err) {

        console.error(
            "Delete Order Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order Not Found"

            });

        }


        if (
            order.status !== "Pending"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only Pending Orders can be cancelled"

            });

        }


        order.status =
            "Cancelled";


        await order.save();


        res.status(200).json({

            success: true,

            message:
                "Order Cancelled Successfully",

            data: order

        });

    } catch (err) {

        console.error(
            "Cancel Order Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// GET USER ORDERS
// =====================================================

const getUserOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({

                userId:
                    req.params.userId

            }).sort({

                createdAt: -1

            });


        res.status(200).json({

            success: true,

            count: orders.length,

            data: orders

        });

    } catch (err) {

        console.error(
            "Get User Orders Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// EXPORT ORDERS
// =====================================================

const exportOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({})
                .sort({
                    createdAt: -1
                });


        const workbook =
            new ExcelJS.Workbook();


        const worksheet =
            workbook.addWorksheet(
                "Orders"
            );


        worksheet.columns = [

            {
                header: "Order ID",
                key: "orderId",
                width: 28
            },

            {
                header: "Customer",
                key: "customerName",
                width: 25
            },

            {
                header: "Phone",
                key: "phone",
                width: 18
            },

            {
                header: "Email",
                key: "email",
                width: 30
            },

            {
                header: "Status",
                key: "status",
                width: 20
            },

            {
                header: "Order Date",
                key: "createdAt",
                width: 22
            },

            {
                header: "Delivery Date",
                key: "deliveryDate",
                width: 22
            },

            {
                header: "Total",
                key: "totalPrice",
                width: 15
            }

        ];


        worksheet.getRow(1).font = {
            bold: true
        };


        orders.forEach(order => {

            worksheet.addRow({

                orderId:
                    order._id
                        ? order._id.toString()
                        : "",

                customerName:
                    order.customerName || "",

                phone:
                    order.phone || "",

                email:
                    order.email || "",

                status:
                    order.status || "Pending",

                createdAt:
                    order.createdAt
                        ? new Date(
                            order.createdAt
                        ).toLocaleString(
                            "en-IN"
                        )
                        : "",

                deliveryDate:
                    order.deliveryDate
                        ? new Date(
                            order.deliveryDate
                        ).toLocaleDateString(
                            "en-IN"
                        )
                        : "Not Set",

                totalPrice:
                    order.totalPrice || 0

            });

        });


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=orders.xlsx"
        );


        await workbook.xlsx.write(
            res
        );


        res.end();

    } catch (err) {

        console.error(
            "Export Orders Error:",
            err
        );

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    getOrders,
    changeStatus,
    updateDeliveryDate,
    deleteOrder,
    cancelOrder,
    exportOrders,
    getUserOrders

};