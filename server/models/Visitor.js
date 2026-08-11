const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
    {
        visitorId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        firstVisit: {
            type: Date,
            default: Date.now
        },

        lastVisit: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Visitor =
    mongoose.model(
        "Visitor",
        visitorSchema
    );

module.exports = Visitor;