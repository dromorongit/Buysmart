// controllers/productController.js
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('Cloudinary Config:', {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key ? '***REDACTED***' : 'NOT SET',
  api_secret: cloudinaryConfig.api_secret ? '***REDACTED***' : 'NOT SET'
});

cloudinary.config(cloudinaryConfig);

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    // Check if file exists before attempting to upload
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Verify Cloudinary is configured
    if (!cloudinary.config().api_key) {
      console.error('Cloudinary API key is not configured');
      throw new Error('Cloudinary API key is not configured');
    }
    
    console.log('Attempting to upload to Cloudinary:', filePath);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      resource_type: 'image'
    });
    // Delete local file after upload
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Attempt to delete the file if it exists to clean up
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
    throw error;
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, category, price, discountPrice, description, inStock, isFeatured, isPopular, isNew, isOnSale } = req.body;

    // Convert checkbox values to boolean
    const convertToBoolean = (value) => {
      if (value === 'on' || value === 'true') return true;
      if (value === 'off' || value === 'false') return false;
      return Boolean(value);
    };

    // Handle file uploads to Cloudinary
    let coverImage = '';
    let galleryImages = [];

    if (req.files['coverImage']) {
      try {
        coverImage = await uploadToCloudinary(req.files['coverImage'][0].path, 'products/covers');
      } catch (uploadError) {
        console.error('Failed to upload cover image:', uploadError);
        return res.status(500).render('error', {
          message: 'Failed to upload cover image',
          error: uploadError,
          stack: uploadError.stack
        });
      }
    }

    if (req.files['galleryImages']) {
      try {
        galleryImages = await Promise.all(
          req.files['galleryImages'].map(file => uploadToCloudinary(file.path, 'products/gallery'))
        );
      } catch (uploadError) {
        console.error('Failed to upload gallery images:', uploadError);
        // Clean up cover image if it was uploaded
        if (coverImage) {
          try {
            await cloudinary.uploader.destroy(coverImage);
          } catch (cleanupError) {
            console.error('Error cleaning up cover image:', cleanupError);
          }
        }
        return res.status(500).render('error', {
          message: 'Failed to upload gallery images',
          error: uploadError,
          stack: uploadError.stack
        });
      }
    }

    const product = new Product({
      name,
      category,
      price,
      discountPrice,
      description,
      coverImage,
      galleryImages,
      inStock: convertToBoolean(inStock),
      isFeatured: convertToBoolean(isFeatured),
      isPopular: convertToBoolean(isPopular),
      isNew: convertToBoolean(isNew),
      isOnSale: convertToBoolean(isOnSale)
    });

    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err.message);
    res.status(500).render('error', {
      message: 'Failed to create product',
      error: err,
      stack: err.stack
    });
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
    const { name, category, price, discountPrice, description, inStock, isFeatured, isPopular, isNew, isOnSale } = req.body;

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
    product.inStock = inStock !== undefined ? convertToBoolean(inStock) : product.inStock;
    product.isFeatured = isFeatured !== undefined ? convertToBoolean(isFeatured) : product.isFeatured;
    product.isPopular = isPopular !== undefined ? convertToBoolean(isPopular) : product.isPopular;
    product.isNew = isNew !== undefined ? convertToBoolean(isNew) : product.isNew;
    product.isOnSale = isOnSale !== undefined ? convertToBoolean(isOnSale) : product.isOnSale;

    // Handle file uploads to Cloudinary if present
    if (req.files['coverImage']) {
      product.coverImage = await uploadToCloudinary(req.files['coverImage'][0].path, 'products/covers');
    }
    if (req.files['galleryImages']) {
      const newGalleryImages = await Promise.all(
        req.files['galleryImages'].map(file => uploadToCloudinary(file.path, 'products/gallery'))
      );
      product.galleryImages = [...product.galleryImages, ...newGalleryImages];
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