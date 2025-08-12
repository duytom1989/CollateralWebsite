import express from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { validateVehicleFilters } from '../middleware/validation';
import { trackAnalytics } from '../middleware/analytics';

const router = express.Router();
const vehicleController = new VehicleController();

/**
 * @route GET /api/vehicles
 * @desc Get all vehicles with filtering and pagination
 * @access Public
 */
router.get('/', 
  validateVehicleFilters,
  trackAnalytics('vehicle_list_view'),
  vehicleController.getVehicles
);

/**
 * @route GET /api/vehicles/featured
 * @desc Get featured vehicles
 * @access Public
 */
router.get('/featured', 
  trackAnalytics('featured_vehicles_view'),
  vehicleController.getFeaturedVehicles
);

/**
 * @route GET /api/vehicles/brands
 * @desc Get available vehicle brands
 * @access Public
 */
router.get('/brands', vehicleController.getVehicleBrands);

/**
 * @route GET /api/vehicles/stats
 * @desc Get vehicle statistics
 * @access Public
 */
router.get('/stats', vehicleController.getVehicleStats);

/**
 * @route GET /api/vehicles/:id
 * @desc Get single vehicle by ID
 * @access Public
 */
router.get('/:id',
  trackAnalytics('vehicle_detail_view'),
  vehicleController.getVehicleById
);

/**
 * @route POST /api/vehicles/:id/view
 * @desc Increment vehicle view count
 * @access Public
 */
router.post('/:id/view',
  trackAnalytics('vehicle_view_increment'),
  vehicleController.incrementViewCount
);

export default router;