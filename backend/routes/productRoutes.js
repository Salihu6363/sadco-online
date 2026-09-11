const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/upload');
const path = require('path');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.categoryId = parseInt(category);
    if (featured === 'true') filter.isFeatured = true;

    const products = await Product.findAll({ where: filter });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product with image (admin only)
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, categoryId, isFeatured, unit } = req.body;
    
    // Get uploaded image URLs
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      unit: unit || 'piece',
      images: imageUrls,
      userId: req.user.id
    });
    
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update product with image (admin only)
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, description, price, discountPrice, stock, categoryId, isFeatured, unit, existingImages } = req.body;
    
    // Get new uploaded image URLs
    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Combine existing and new images
    let allImages = [];
    if (existingImages) {
      try {
        allImages = JSON.parse(existingImages);
      } catch {
        allImages = [];
      }
    }
    allImages = [...allImages, ...newImageUrls];
    
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price ? parseFloat(price) : product.price,
      discountPrice: discountPrice ? parseFloat(discountPrice) : product.discountPrice,
      stock: stock ? parseInt(stock) : product.stock,
      categoryId: categoryId ? parseInt(categoryId) : product.categoryId,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      unit: unit || product.unit,
      images: allImages
    });
    
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
