const express = require("express");

const router = express.Router();

const {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


// ADD
router.post("/", addProduct);

// GET ALL
router.get("/", getProducts);

// GET SINGLE
router.get("/:id", getSingleProduct);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

module.exports = router;