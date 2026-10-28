const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const problemController = require('../controllers/problemController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All admin endpoints require role 'admin'
router.use(verifyToken, requireRole('admin'));

router.get('/dashboard', adminController.getAdminDashboard);
router.get('/problems', adminController.getAllProblems);
router.get('/problems/:id', problemController.getProblemById);
router.get('/unassigned', adminController.getUnassignedProblems);
router.get('/experts', adminController.getExperts);

router.post('/assign', adminController.assignExpert);
router.post('/problems/:id/assign', adminController.assignExpert);
router.patch('/reassign', adminController.reassignExpert);
router.patch('/problems/:id/reassign', adminController.reassignExpert);

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;
