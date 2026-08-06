const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {

    try {

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            status: "Pending"
        });

        const deliveredOrders = await Order.countDocuments({
            status: "Delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status: "Cancelled"
        });

        const revenueData = await Order.find({
            status: "Delivered"
        });

        let totalRevenue = 0;

        revenueData.forEach(order => {

            totalRevenue += order.totalPrice;

        });

        res.json({

            success: true,

            totalProducts,

            totalOrders,

            pendingOrders,

            deliveredOrders,

            cancelledOrders,

            totalRevenue

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {
    getDashboardStats
};