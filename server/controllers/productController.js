const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {

    try {

        const image = req.file
            ? `https://shopsphere-sedh.onrender.com/uploads/${req.file.filename}`
            : "";

        const product = await Product.create({

            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            stock: req.body.stock,
            image: image,
            featured: req.body.featured === "true" || req.body.featured === true

        });

        res.status(201).json({

            success: true,
            message: "Product Added Successfully",
            data: product

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    if(req.file){
        req.body.image = `https://shopsphere-sedh.onrender.com/uploads/${req.file.filename}`;
    }

    if (req.body.featured !== undefined) {
        req.body.featured = req.body.featured === "true" || req.body.featured === true;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Export Functions
module.exports = {
    addProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};