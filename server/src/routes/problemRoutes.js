const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Farmer submissions & my problems
router.post(
  '/',
  verifyToken,
  requireRole('farmer'),
  upload.array('images', 5),
  problemController.createProblem
);

router.get('/', problemController.getPublicProblems);
router.get('/my', verifyToken, requireRole('farmer'), problemController.getMyProblems);

// Shared problem inspection (accessible to authorized farmer, assigned expert, admin)
router.get('/:id', verifyToken, problemController.getProblemById);
router.get('/:id/responses', verifyToken, problemController.getProblemResponses);
router.get('/:id/status-history', verifyToken, problemController.getProblemStatusHistory);

// Farmer follow-up
router.post(
  '/:id/follow-ups',
  verifyToken,
  requireRole('farmer'),
  upload.array('images', 3),
  problemController.createFollowUp
);

module.exports = router;
