const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    pincode: {
        type: String,
        default: ""
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            productName: {
                type: String
            },

            price: {
                type: Number
            },

            quantity: {
                type: Number
            },

            image: {
                type: String
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    couponCode: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Packed",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        default: "WhatsApp"
    },

    // ADMIN SETS THIS DATE
    deliveryDate: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

module.exports = Order;