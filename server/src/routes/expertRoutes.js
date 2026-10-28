const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All expert endpoints require role 'expert' (or 'admin')
router.use(verifyToken, requireRole('expert', 'admin'));

router.get('/cases', expertController.getAssignedProblems);
router.get('/cases/:id', expertController.getExpertCaseDetail);
router.post('/cases/:id/respond', expertController.createExpertResponse);
router.post('/cases/:id/responses', expertController.createExpertResponse);
router.patch('/cases/:id/status', expertController.updateCaseStatus);
router.get('/cases/:id/similar', expertController.getSimilarCases);
router.get('/cases/:id/similar-cases', expertController.getSimilarCases);

router.get('/problems', expertController.getAssignedProblems);
router.get('/problems/:id', expertController.getExpertCaseDetail);
router.post('/problems/:id/responses', expertController.createExpertResponse);
router.patch('/problems/:id/status', expertController.updateCaseStatus);
router.get('/problems/:id/similar-cases', expertController.getSimilarCases);

module.exports = router;
