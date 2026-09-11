const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Contract = require('../models/Contract');
const Message = require('../models/Message');

// Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalServices, totalContracts, unreadMessages] = await Promise.all([
      User.count(),
      Product.count(),
      Order.count(),
      Service.count(),
      Contract.count(),
      Message.count({ where: { isRead: false } })
    ]);

    const orders = await Order.findAll();
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
    const pendingOrders = await Order.count({ where: { status: 'pending' } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalServices,
        totalContracts,
        totalRevenue,
        pendingOrders,
        unreadMessages
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent orders
router.get('/orders/recent', protect, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
