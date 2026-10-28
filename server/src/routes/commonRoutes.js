const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public read of crops & categories (or optional token for admin visibility)
router.get('/crops', commonController.getCrops);
router.get('/categories', commonController.getCategories);

// Admin crop management
router.post('/crops', verifyToken, requireRole('admin'), commonController.createCrop);
router.patch('/crops/:id', verifyToken, requireRole('admin'), commonController.updateCrop);

// Admin category management
router.post('/categories', verifyToken, requireRole('admin'), commonController.createCategory);
router.patch('/categories/:id', verifyToken, requireRole('admin'), commonController.updateCategory);

// In-app notifications
router.get('/notifications', verifyToken, commonController.getNotifications);
router.patch('/notifications/:id/read', verifyToken, commonController.markNotificationRead);
router.patch('/notifications/read-all', verifyToken, commonController.markAllNotificationsRead);

module.exports = router;
