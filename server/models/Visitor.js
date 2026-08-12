const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
    {
        visitorId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        name: {
            type: String,
            default: "Guest"
        },

        email: {
            type: String,
            default: ""
        },

        firstVisit: {
            type: Date,
            default: Date.now
        },

        lastVisit: {
            type: Date,
            default: Date.now
        },

        totalVisits: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Visitor", visitorSchema);