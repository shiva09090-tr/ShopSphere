const Order = require("../models/Order");
const Product = require("../models/product");
// Create Order

const createOrder = async(req,res)=>{

    try{

        const order = await Order.create(req.body);

        res.status(201).json({

            success:true,

            message:"Order Placed",

            data:order

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Get Orders of User

const getOrders = async(req,res)=>{

    try{

        const orders = await Order.find({

            userId:req.params.userId

        });

        res.status(200).json({

            success:true,

            data:orders

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

module.exports={

createOrder,

getOrders

};