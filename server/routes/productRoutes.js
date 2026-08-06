const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/upload");
const {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.post("/", imageUpload.single("image"), addProduct);
router.get("/", getProducts);
router.put("/:id", imageUpload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getSingleProduct);
module.exports = router;