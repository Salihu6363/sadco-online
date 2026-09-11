const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({ 
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.update(req.body);
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.destroy();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
