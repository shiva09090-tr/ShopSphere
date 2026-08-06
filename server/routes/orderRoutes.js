const express=require("express");

const router=express.Router();

const {

createOrder,

getOrders

}=require("../controllers/orderController");

router.post("/",createOrder);

router.get("/:userId",getOrders);

module.exports=router;