const Order = require("../models/order");
const ExcelJS = require("exceljs");

// Get All Orders
const getOrders = async (req, res) => {

    try {

        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Order Status
const changeStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }

        order.status = req.body.status;

        await order.save();
        for (const item of order.items) {

    const product = await Product.findById(item.productId);

    if (product) {

        product.stock -= item.quantity;

        if (product.stock < 0) {
            product.stock = 0;
        }

        await product.save();
    }
}

        res.status(200).json({
            success: true,
            message: "Status Updated",
            data: order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const deleteOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }

        if (order.status !== "Pending") {

            return res.status(400).json({
                success: false,
                message: "Only Pending Orders can be cancelled"
            });

        }

        order.status = "Cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order Cancelled Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const exportOrders = async (req, res) => {

    try {

        const orders = await Order.find();

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Orders");

        worksheet.columns = [

            { header: "Customer", key: "customerName", width: 25 },

            { header: "Phone", key: "phone", width: 18 },

            { header: "Email", key: "email", width: 30 },

            { header: "Status", key: "status", width: 18 },

            { header: "Total", key: "totalPrice", width: 15 }

        ];

        orders.forEach(order => {

            worksheet.addRow({

                customerName: order.customerName,

                phone: order.phone,

                email: order.email,

                status: order.status,

                totalPrice: order.totalPrice

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

        await workbook.xlsx.write(res);

        res.end();

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};
module.exports = {

    getOrders,
    changeStatus,
    deleteOrder,
    cancelOrder,
    exportOrders,
    getUserOrders

};