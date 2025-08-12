import express from 'express';

const router = express.Router();

/**
 * @route POST /api/sync/manual
 * @desc Trigger manual sync with Web QLTS
 * @access Private
 */
router.post('/manual', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Web QLTS sync not yet implemented'
  });
});

/**
 * @route GET /api/sync/status
 * @desc Get sync status
 * @access Private
 */
router.get('/status', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Web QLTS sync not yet implemented'
  });
});

/**
 * @route GET /api/sync/logs
 * @desc Get sync logs
 * @access Private
 */
router.get('/logs', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Web QLTS sync not yet implemented'
  });
});

export default router;