import express from 'express';

const router = express.Router();

/**
 * @route GET /api/admin/dashboard
 * @desc Get admin dashboard data
 * @access Private
 */
router.get('/dashboard', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin panel not yet implemented'
  });
});

/**
 * @route GET /api/admin/users
 * @desc Get admin users
 * @access Private
 */
router.get('/users', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin panel not yet implemented'
  });
});

/**
 * @route POST /api/admin/users
 * @desc Create admin user
 * @access Private
 */
router.post('/users', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin panel not yet implemented'
  });
});

export default router;