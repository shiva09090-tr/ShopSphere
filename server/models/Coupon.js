const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        minimumOrder: {
            type: Number,
            default: 0,
            min: 0
        },

        usageLimit: {
            type: Number,
            default: 1,
            min: 1
        },

        usedCount: {
            type: Number,
            default: 0
        },

        expiryDate: {
            type: Date,
            required: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Coupon =
    mongoose.models.Coupon ||
    mongoose.model("Coupon", couponSchema);

module.exports = Coupon;