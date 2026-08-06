const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId:{
        type:String
    },

    customerName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    email:{
        type:String
    },

    address:{
        type:String
    },

    city:{
        type:String
    },

    state:{
        type:String
    },

    pincode:{
        type:String
    },

    items:[
        {
            productId:String,

            productName:String,

            price:Number,

            quantity:Number,

            image:String
        }
    ],

    totalPrice:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        default:"Pending"
    },

    paymentMethod:{
        type:String,
        default:"WhatsApp"
    }

},{
    timestamps:true
});

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

module.exports = Order;