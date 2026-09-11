const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, admin } = require('../middleware/auth');

// Send message
router.post('/', protect, async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId: receiverId || null,
      message: message,
      senderName: req.user.name,
      senderEmail: req.user.email
    });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user messages
router.get('/my-messages', protect, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all messages (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read (admin only)
router.put('/:id/read', protect, admin, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.isRead = true;
    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
