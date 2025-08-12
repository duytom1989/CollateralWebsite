import express from 'express';
import { AssetController } from '../controllers/AssetController';
import { validateAssetFilters } from '../middleware/validation';
import { trackAnalytics } from '../middleware/analytics';

const router = express.Router();
const assetController = new AssetController();

/**
 * @route GET /api/assets
 * @desc Get all assets with filtering and pagination
 * @access Public
 */
router.get('/', 
  validateAssetFilters,
  trackAnalytics('asset_list_view'),
  assetController.getAssets
);

/**
 * @route GET /api/assets/featured
 * @desc Get featured assets
 * @access Public
 */
router.get('/featured', 
  trackAnalytics('featured_assets_view'),
  assetController.getFeaturedAssets
);

/**
 * @route GET /api/assets/search
 * @desc Search assets by keyword
 * @access Public
 */
router.get('/search',
  trackAnalytics('asset_search'),
  assetController.searchAssets
);

/**
 * @route GET /api/assets/stats
 * @desc Get asset statistics
 * @access Public
 */
router.get('/stats', assetController.getAssetStats);

/**
 * @route GET /api/assets/:id
 * @desc Get single asset by ID
 * @access Public
 */
router.get('/:id',
  trackAnalytics('asset_detail_view'),
  assetController.getAssetById
);

/**
 * @route POST /api/assets/:id/view
 * @desc Increment asset view count
 * @access Public
 */
router.post('/:id/view',
  trackAnalytics('asset_view_increment'),
  assetController.incrementViewCount
);

export default router;