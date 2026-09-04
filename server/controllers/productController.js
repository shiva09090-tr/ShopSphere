const Product = require("../models/Product");

// ======================================================
// ADD PRODUCT
// ======================================================

const addProduct = async (req, res) => {

    try {

        // ------------------------------------------------
        // GET MULTIPLE IMAGES
        // ------------------------------------------------

        let images = [];

        if (
            Array.isArray(req.body.images)
        ) {

            images = req.body.images
                .filter(
                    image =>
                        image &&
                        String(image).trim() !== ""
                )
                .map(
                    image =>
                        String(image).trim()
                );

        }

        // ------------------------------------------------
        // BACKWARD COMPATIBILITY
        // ------------------------------------------------

        const mainImage =
            req.body.image ||
            images[0] ||
            "";


        // ------------------------------------------------
        // IF MAIN IMAGE EXISTS BUT NOT IN ARRAY
        // ------------------------------------------------

        if (
            mainImage &&
            !images.includes(mainImage)
        ) {

            images.unshift(
                mainImage
            );

        }


        // ------------------------------------------------
        // CREATE PRODUCT
        // ------------------------------------------------

        const product =
            await Product.create({

                name:
                    req.body.name,

                description:
                    req.body.description,

                price:
                    Number(
                        req.body.price
                    ),

                category:
                    req.body.category,

                brand:
                    req.body.brand,

                stock:
                    Number(
                        req.body.stock
                    ) || 0,

                // Old field
                image:
                    mainImage,

                // New multiple images
                images:
                    images,

                featured:
                    req.body.featured === true ||
                    req.body.featured === "true"

            });


        // ------------------------------------------------
        // RESPONSE
        // ------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Product Added Successfully",

            data:
                product

        });

    }

    catch (error) {

        console.error(
            "Add Product Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getProducts = async (req, res) => {

    try {

        const products =
            await Product.find()
                .sort({
                    createdAt: -1
                });


        // ------------------------------------------------
        // BACKWARD COMPATIBILITY
        // ------------------------------------------------

        const formattedProducts =
            products.map(
                product => {

                    const item =
                        product.toObject();


                    // Old product with only image
                    if (
                        !Array.isArray(
                            item.images
                        ) ||
                        item.images.length === 0
                    ) {

                        if (item.image) {

                            item.images = [
                                item.image
                            ];

                        }
                        else {

                            item.images = [];

                        }

                    }


                    // Ensure main image exists
                    if (
                        !item.image &&
                        item.images.length > 0
                    ) {

                        item.image =
                            item.images[0];

                    }


                    return item;

                }
            );


        res.status(200).json({

            success: true,

            count:
                formattedProducts.length,

            data:
                formattedProducts

        });

    }

    catch (error) {

        console.error(
            "Get Products Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

const getSingleProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product Not Found"

            });

        }


        const item =
            product.toObject();


        // ------------------------------------------------
        // BACKWARD COMPATIBILITY
        // ------------------------------------------------

        if (
            !Array.isArray(
                item.images
            ) ||
            item.images.length === 0
        ) {

            if (item.image) {

                item.images = [
                    item.image
                ];

            }
            else {

                item.images = [];

            }

        }


        if (
            !item.image &&
            item.images.length > 0
        ) {

            item.image =
                item.images[0];

        }


        res.status(200).json({

            success: true,

            data:
                item

        });

    }

    catch (error) {

        console.error(
            "Get Single Product Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// UPDATE PRODUCT
// ======================================================

const updateProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product Not Found"

            });

        }


        // ------------------------------------------------
        // GET MULTIPLE IMAGES
        // ------------------------------------------------

        let images = [];

        if (
            Array.isArray(
                req.body.images
            )
        ) {

            images =
                req.body.images
                    .filter(
                        image =>
                            image &&
                            String(
                                image
                            ).trim() !== ""
                    )
                    .map(
                        image =>
                            String(
                                image
                            ).trim()
                    );

        }


        // ------------------------------------------------
        // MAIN IMAGE
        // ------------------------------------------------

        const mainImage =
            req.body.image ||
            images[0] ||
            "";


        // ------------------------------------------------
        // KEEP MAIN IMAGE IN ARRAY
        // ------------------------------------------------

        if (
            mainImage &&
            !images.includes(
                mainImage
            )
        ) {

            images.unshift(
                mainImage
            );

        }


        // ------------------------------------------------
        // UPDATE DATA
        // ------------------------------------------------

        const updateData = {

            name:
                req.body.name,

            description:
                req.body.description,

            price:
                Number(
                    req.body.price
                ),

            category:
                req.body.category,

            brand:
                req.body.brand,

            stock:
                Number(
                    req.body.stock
                ) || 0,

            image:
                mainImage,

            images:
                images,

            featured:
                req.body.featured === true ||
                req.body.featured === "true"

        };


        // ------------------------------------------------
        // UPDATE PRODUCT
        // ------------------------------------------------

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

            message:
                "Product Updated Successfully",

            data:
                updatedProduct

        });

    }

    catch (error) {

        console.error(
            "Update Product Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ======================================================
// DELETE PRODUCT
// ======================================================

const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product Not Found"

            });

        }


        await Product.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                "Product Deleted Successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

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