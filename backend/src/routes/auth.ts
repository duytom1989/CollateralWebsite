import express from 'express';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Admin login
 * @access Public
 */
router.post('/login', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Authentication not yet implemented'
  });
});

/**
 * @route POST /api/auth/logout
 * @desc Admin logout
 * @access Private
 */
router.post('/logout', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Authentication not yet implemented'
  });
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Authentication not yet implemented'
  });
});

export default router;