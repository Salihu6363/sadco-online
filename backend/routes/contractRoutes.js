const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const { protect } = require('../middleware/auth');

// Get user contracts
router.get('/my-contracts', protect, async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create contract
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, budget, serviceId, proposedBy, proposedEmail, proposedPhone } = req.body;
    
    const contract = await Contract.create({
      userId: req.user.id,
      title,
      description,
      budget,
      serviceId: serviceId || null,
      proposedBy,
      proposedEmail,
      proposedPhone,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, contract });
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update contract status (admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    contract.status = status;
    await contract.save();
    res.json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contracts (admin only)
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const contracts = await Contract.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
