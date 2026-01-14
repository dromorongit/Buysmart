// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const { adminAuth } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/products
// @desc    Create a product
router.post(
  '/',
  adminAuth,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 5 }
  ]),
  [
    check('name', 'Product name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric().custom(value => value > 0),
    check('description', 'Description is required').not().isEmpty()
  ],
  productController.createProduct
);

// @route   GET /api/products
// @desc    Get all products
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', productController.getProduct);

// @route   PUT /api/products/:id
// @desc    Update product
router.put(
  '/:id',
  adminAuth,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 5 }
  ]),
  [
    check('name', 'Product name is required').optional().not().isEmpty(),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('price', 'Price must be positive').optional().isNumeric().custom(value => value > 0)
  ],
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;