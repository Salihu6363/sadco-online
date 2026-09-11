const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get user cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ 
        userId: req.user.id, 
        items: [], 
        totalQuantity: 0, 
        totalPrice: 0 
      });
    }
    
    // Get product details for each item
    const items = cart.items || [];
    const cartItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        cartItems.push({
          productId: product.id,
          name: product.name,
          price: parseFloat(product.discountPrice || product.price),
          quantity: item.quantity,
          imageUrl: product.imageUrl || '',
          stock: product.stock,
          unit: product.unit || 'piece'
        });
      }
    }
    
    res.json({ 
      success: true, 
      cart: {
        id: cart.id,
        userId: cart.userId,
        items: cartItems,
        totalQuantity: cart.totalQuantity || 0,
        totalPrice: cart.totalPrice || 0,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity) || 1;
    
    console.log('Adding to cart:', { productId, quantity, userId: req.user.id });

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ 
        userId: req.user.id, 
        items: [], 
        totalQuantity: 0, 
        totalPrice: 0 
      });
    }

    // Get current items
    let items = cart.items || [];
    
    // Check if product already exists in cart
    const existingIndex = items.findIndex(item => parseInt(item.productId) === productId);
    
    if (existingIndex !== -1) {
      // Update existing item
      items[existingIndex].quantity += quantity;
    } else {
      // Add new item with name and price
      items.push({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.discountPrice || product.price),
        quantity: quantity
      });
    }

    // Calculate totals
    let totalQuantity = 0;
    let totalPrice = 0;
    
    for (const item of items) {
      const price = item.price || 0;
      totalQuantity += item.quantity;
      totalPrice += price * item.quantity;
    }

    // Save cart
    await Cart.update(
      {
        items: items,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice
      },
      {
        where: { id: cart.id }
      }
    );

    // Fetch updated cart
    cart = await Cart.findOne({ where: { id: cart.id } });
    
    // Get product details for response
    const cartItems = [];
    for (const item of cart.items || []) {
      const prod = await Product.findByPk(item.productId);
      if (prod) {
        cartItems.push({
          productId: prod.id,
          name: prod.name,
          price: parseFloat(prod.discountPrice || prod.price),
          quantity: item.quantity,
          imageUrl: prod.imageUrl || '',
          stock: prod.stock,
          unit: prod.unit || 'piece'
        });
      }
    }

    res.json({ 
      success: true, 
      cart: {
        id: cart.id,
        userId: cart.userId,
        items: cartItems,
        totalQuantity: cart.totalQuantity || 0,
        totalPrice: cart.totalPrice || 0
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let items = cart.items || [];
    items = items.filter(item => parseInt(item.productId) !== productId);
    
    // Calculate totals
    let totalQuantity = 0;
    let totalPrice = 0;
    
    for (const item of items) {
      const price = item.price || 0;
      totalQuantity += item.quantity;
      totalPrice += price * item.quantity;
    }

    await Cart.update(
      {
        items: items,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice
      },
      {
        where: { id: cart.id }
      }
    );

    cart = await Cart.findOne({ where: { id: cart.id } });

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    await Cart.update(
      {
        items: [],
        totalQuantity: 0,
        totalPrice: 0
      },
      {
        where: { id: cart.id }
      }
    );

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart count
router.get('/count', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    const count = cart ? cart.totalQuantity || 0 : 0;
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
