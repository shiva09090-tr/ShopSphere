const Product = require("../models/Product");

// ======================================================
// ADD PRODUCT
// ======================================================

const addProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            brand: req.body.brand,
            stock: Number(req.body.stock),
            image: req.body.image || "",
            featured:
                req.body.featured === true ||
                req.body.featured === "true"
        });

        res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            data: product
        });

    } catch (error) {
        console.error("Add Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("Get Single Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE PRODUCT
// ======================================================

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            brand: req.body.brand,
            stock: Number(req.body.stock),
            image: req.body.image || "",
            featured:
                req.body.featured === true ||
                req.body.featured === "true"
        };

        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// DELETE PRODUCT
// ======================================================

const deleteProduct = async (req, res) => {
    try {
        const product =
            await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};