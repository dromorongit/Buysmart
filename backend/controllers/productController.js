// controllers/productController.js
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Create a new product
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, category, price, discountPrice, description, inStock, isFeatured, isNew, isOnSale } = req.body;

    // Handle file uploads
    const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].path : '';
    const galleryImages = req.files['galleryImages'] ? req.files['galleryImages'].map(file => file.path) : [];

    const product = new Product({
      name,
      category,
      price,
      discountPrice,
      description,
      coverImage,
      galleryImages,
      inStock,
      isFeatured,
      isNew,
      isOnSale
    });

    await product.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update product
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, category, price, discountPrice, description, inStock, isFeatured, isNew, isOnSale } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Update fields
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.description = description || product.description;
    product.inStock = inStock || product.inStock;
    product.isFeatured = isFeatured || product.isFeatured;
    product.isNew = isNew || product.isNew;
    product.isOnSale = isOnSale || product.isOnSale;

    // Handle file uploads if present
    if (req.files['coverImage']) {
      product.coverImage = req.files['coverImage'][0].path;
    }
    if (req.files['galleryImages']) {
      product.galleryImages = req.files['galleryImages'].map(file => file.path);
    }

    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await product.remove();
    res.redirect('/products');
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
};