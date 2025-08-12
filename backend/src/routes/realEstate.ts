import express from 'express';
import { RealEstateController } from '../controllers/RealEstateController';
import { validateRealEstateFilters } from '../middleware/validation';
import { trackAnalytics } from '../middleware/analytics';

const router = express.Router();
const realEstateController = new RealEstateController();

/**
 * @route GET /api/real-estate
 * @desc Get all real estate with filtering and pagination
 * @access Public
 */
router.get('/', 
  validateRealEstateFilters,
  trackAnalytics('real_estate_list_view'),
  realEstateController.getRealEstates
);

/**
 * @route GET /api/real-estate/featured
 * @desc Get featured real estate
 * @access Public
 */
router.get('/featured', 
  trackAnalytics('featured_real_estate_view'),
  realEstateController.getFeaturedRealEstates
);

/**
 * @route GET /api/real-estate/provinces
 * @desc Get available provinces
 * @access Public
 */
router.get('/provinces', realEstateController.getProvinces);

/**
 * @route GET /api/real-estate/stats
 * @desc Get real estate statistics
 * @access Public
 */
router.get('/stats', realEstateController.getRealEstateStats);

/**
 * @route GET /api/real-estate/:id
 * @desc Get single real estate by ID
 * @access Public
 */
router.get('/:id',
  trackAnalytics('real_estate_detail_view'),
  realEstateController.getRealEstateById
);

/**
 * @route POST /api/real-estate/:id/view
 * @desc Increment real estate view count
 * @access Public
 */
router.post('/:id/view',
  trackAnalytics('real_estate_view_increment'),
  realEstateController.incrementViewCount
);

export default router;