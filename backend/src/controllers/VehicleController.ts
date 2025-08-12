import { Request, Response } from 'express';
import { VehicleService } from '../services/VehicleService';

// Define interfaces locally since shared types are not properly set up for backend
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface VehicleFilters {
  vehicleType?: string[];
  brand?: string[];
  yearFrom?: number;
  yearTo?: number;
  transmission?: string[];
  priceFrom?: number;
  priceTo?: number;
  search?: string;
}

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  /**
   * Get all vehicles with filtering and pagination
   */
  public getVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        status = 'processing',
        featured,
        search,
        vehicleType,
        brand,
        yearFrom,
        yearTo,
        transmission,
        priceFrom,
        priceTo,
        ...otherFilters
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit as string)));

      const filters: VehicleFilters = {
        search: search as string,
        vehicleType: vehicleType ? (Array.isArray(vehicleType) ? vehicleType.map(String) : [String(vehicleType)]) : undefined,
        brand: brand ? (Array.isArray(brand) ? brand.map(String) : [String(brand)]) : undefined,
        yearFrom: yearFrom ? parseInt(yearFrom as string) : undefined,
        yearTo: yearTo ? parseInt(yearTo as string) : undefined,
        transmission: transmission ? (Array.isArray(transmission) ? transmission.map(String) : [String(transmission)]) : undefined,
        priceFrom: priceFrom ? parseInt(priceFrom as string) : undefined,
        priceTo: priceTo ? parseInt(priceTo as string) : undefined,
      };

      const result = await this.vehicleService.getVehicles({
        page: pageNum,
        limit: limitNum,
        status: status as string,
        featured: featured === 'true',
        filters,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.vehicles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getVehicles:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách phương tiện',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get featured vehicles
   */
  public getFeaturedVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 6 } = req.query;
      const limitNum = Math.min(20, Math.max(1, parseInt(limit as string)));

      const vehicles = await this.vehicleService.getFeaturedVehicles(limitNum);

      const response: ApiResponse<any[]> = {
        success: true,
        data: vehicles,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getFeaturedVehicles:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy phương tiện nổi bật',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get available vehicle brands
   */
  public getVehicleBrands = async (req: Request, res: Response): Promise<void> => {
    try {
      const brands = await this.vehicleService.getVehicleBrands();

      const response: ApiResponse<string[]> = {
        success: true,
        data: brands,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getVehicleBrands:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách thương hiệu',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get vehicle statistics
   */
  public getVehicleStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.vehicleService.getVehicleStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getVehicleStats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê phương tiện',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get single vehicle by ID
   */
  public getVehicleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID phương tiện không hợp lệ',
        });
        return;
      }

      const vehicle = await this.vehicleService.getVehicleById(id);

      if (!vehicle) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy phương tiện',
        });
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: vehicle,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getVehicleById:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin phương tiện',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Increment vehicle view count
   */
  public incrementViewCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID phương tiện không hợp lệ',
        });
        return;
      }

      await this.vehicleService.incrementViewCount(id, {
        userAgent,
        ipAddress,
        referrer: req.get('Referer'),
      });

      const response: ApiResponse<null> = {
        success: true,
        message: 'Đã cập nhật lượt xem',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật lượt xem',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };
}