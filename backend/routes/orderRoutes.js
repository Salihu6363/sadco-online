const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.id);
    console.log('Order data:', req.body);
    
    const { shippingAddress, paymentMethod } = req.body;
    
    // Get cart
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Process each item
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const price = parseFloat(product.discountPrice || product.price);
      totalPrice += price * item.quantity;
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: price
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order number
    const orderNumber = 'SADCO-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);

    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      orderItems: orderItems,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod || 'Pending',
      shippingAddress: shippingAddress || {},
      status: 'pending'
    });

    // Clear cart
    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    console.log('Order created:', order.id);

    res.status(201).json({ 
      success: true, 
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
