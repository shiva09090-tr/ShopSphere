const Coupon = require("../models/Coupon");

// =====================================================
// CREATE COUPON
// =====================================================

const createCoupon = async (req, res) => {

    try {

        const {
            code,
            discountType,
            discountValue,
            minimumOrder,
            usageLimit,
            expiryDate,
            active
        } = req.body;


        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required"
            });
        }


        if (!discountValue || discountValue <= 0) {
            return res.status(400).json({
                success: false,
                message: "Discount value must be greater than 0"
            });
        }


        if (!expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Expiry date is required"
            });
        }


        const existingCoupon =
            await Coupon.findOne({
                code: code.trim().toUpperCase()
            });


        if (existingCoupon) {

            return res.status(400).json({
                success: false,
                message: "Coupon already exists"
            });

        }


        const coupon =
            await Coupon.create({

                code:
                    code.trim().toUpperCase(),

                discountType:
                    discountType || "percentage",

                discountValue:
                    Number(discountValue),

                minimumOrder:
                    Number(minimumOrder) || 0,

                usageLimit:
                    Number(usageLimit) || 1,

                expiryDate:

                    new Date(expiryDate),

                active:
                    active !== false

            });


        res.status(201).json({

            success: true,

            message:
                "Coupon Created Successfully",

            data: coupon

        });

    }

    catch (error) {

        console.error(
            "Create Coupon Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET ALL COUPONS
// =====================================================

const getCoupons = async (req, res) => {

    try {

        const coupons =
            await Coupon.find()
                .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: coupons.length,

            data: coupons

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// DELETE COUPON
// =====================================================

const deleteCoupon = async (req, res) => {

    try {

        const coupon =
            await Coupon.findById(
                req.params.id
            );


        if (!coupon) {

            return res.status(404).json({

                success: false,

                message:
                    "Coupon Not Found"

            });

        }


        await Coupon.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                "Coupon Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =====================================================
// UPDATE COUPON
// =====================================================

const updateCoupon = async (req, res) => {

    try {

        const coupon =
            await Coupon.findById(
                req.params.id
            );


        if (!coupon) {

            return res.status(404).json({

                success: false,

                message:
                    "Coupon Not Found"

            });

        }


        if (req.body.code) {

            req.body.code =
                req.body.code
                    .trim()
                    .toUpperCase();

        }


        if (req.body.discountValue !== undefined) {

            req.body.discountValue =
                Number(
                    req.body.discountValue
                );

        }


        if (req.body.minimumOrder !== undefined) {

            req.body.minimumOrder =
                Number(
                    req.body.minimumOrder
                );

        }


        if (req.body.usageLimit !== undefined) {

            req.body.usageLimit =
                Number(
                    req.body.usageLimit
                );

        }


        const updatedCoupon =
            await Coupon.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        res.status(200).json({

            success: true,

            message:
                "Coupon Updated Successfully",

            data:
                updatedCoupon

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};
const getSingleCoupon = async (req, res) => {

    try {

        const coupon =
            await Coupon.findById(
                req.params.id
            );

        if (!coupon) {

            return res.status(404).json({

                success: false,

                message:
                    "Coupon Not Found"

            });

        }

        res.status(200).json({

            success: true,

            data: coupon

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};

// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createCoupon,
    getCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon

};