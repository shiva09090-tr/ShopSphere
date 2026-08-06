const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments();

    // All Products
    const products = await Product.find();

    // Total Categories
    const categories = [...new Set(products.map(product => product.category))];

    // Stock Count
    const inStock = products.filter(product => product.stock > 0).length;

    const outOfStock = products.filter(product => product.stock === 0).length;

    const lowStock = products.filter(
      product => product.stock > 0 && product.stock <= 5
    ).length;

    res.status(200).json({
      success: true,
      totalProducts,
      totalUsers,
      totalCategories: categories.length,
      inStock,
      outOfStock,
      lowStock
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};