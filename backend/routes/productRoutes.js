// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { adminAuth } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'backend/uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// @route   POST /api/products/upload-payment-proof
// @desc    Upload payment proof to Cloudinary
router.post('/upload-payment-proof', upload.single('paymentProof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'payment_proofs',
      public_id: `proof_${Date.now()}`,
      resource_type: 'image'
    });

    // Delete local file after upload
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Payment proof uploaded successfully',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
});

module.exports = router;