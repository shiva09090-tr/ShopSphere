const express = require("express");

const router = express.Router();

const {
    createCoupon,
    getCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
} = require("../controllers/couponController");


router.post("/", createCoupon);

router.get("/", getCoupons);

router.get("/:id", getSingleCoupon);

router.put("/:id", updateCoupon);

router.delete("/:id", deleteCoupon);
module.exports = router;