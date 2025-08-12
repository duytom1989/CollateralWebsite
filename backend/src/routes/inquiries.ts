import express from 'express';
import { InquiryController } from '../controllers/InquiryController';
import { validateInquiry, validateContactForm } from '../middleware/validation';
import { trackAnalytics } from '../middleware/analytics';

const router = express.Router();
const inquiryController = new InquiryController();

/**
 * @route POST /api/inquiries
 * @desc Submit asset inquiry
 * @access Public
 */
router.post('/',
  validateInquiry,
  trackAnalytics('asset_inquiry_submit'),
  inquiryController.submitInquiry
);

/**
 * @route POST /api/inquiries/contact
 * @desc Submit general contact form
 * @access Public
 */
router.post('/contact',
  validateContactForm,
  trackAnalytics('contact_form_submit'),
  inquiryController.submitContactForm
);

/**
 * @route GET /api/inquiries
 * @desc Get all inquiries (Admin only)
 * @access Private
 */
router.get('/',
  // TODO: Add authentication middleware
  inquiryController.getInquiries
);

/**
 * @route GET /api/inquiries/stats
 * @desc Get inquiry statistics (Admin only)
 * @access Private
 */
router.get('/stats',
  // TODO: Add authentication middleware
  inquiryController.getInquiryStats
);

/**
 * @route GET /api/inquiries/:id
 * @desc Get single inquiry by ID (Admin only)
 * @access Private
 */
router.get('/:id',
  // TODO: Add authentication middleware
  inquiryController.getInquiryById
);

/**
 * @route PUT /api/inquiries/:id/status
 * @desc Update inquiry status (Admin only)
 * @access Private
 */
router.put('/:id/status',
  // TODO: Add authentication middleware
  inquiryController.updateInquiryStatus
);

/**
 * @route GET /api/inquiries/export/csv
 * @desc Export inquiries to CSV (Admin only)
 * @access Private
 */
router.get('/export/csv',
  // TODO: Add authentication middleware
  inquiryController.exportInquiriesToCSV
);

export default router;