import { Request, Response } from 'express';
import { RealEstateService } from '../services/RealEstateService';

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

interface RealEstateFilters {
  propertyType?: string[];
  province?: string[];
  areaFrom?: number;
  areaTo?: number;
  priceFrom?: number;
  priceTo?: number;
  bedrooms?: number[];
  search?: string;
}

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export class RealEstateController {
  private realEstateService: RealEstateService;

  constructor() {
    this.realEstateService = new RealEstateService();
  }

  /**
   * Get all real estates with filtering and pagination
   */
  public getRealEstates = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        status = 'processing',
        featured,
        search,
        propertyType,
        province,
        areaFrom,
        areaTo,
        priceFrom,
        priceTo,
        bedrooms,
        ...otherFilters
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit as string)));

      const filters: RealEstateFilters = {
        search: search as string,
        propertyType: propertyType ? (Array.isArray(propertyType) ? propertyType.map(String) : [String(propertyType)]) : undefined,
        province: province ? (Array.isArray(province) ? province.map(String) : [String(province)]) : undefined,
        areaFrom: areaFrom ? parseInt(areaFrom as string) : undefined,
        areaTo: areaTo ? parseInt(areaTo as string) : undefined,
        priceFrom: priceFrom ? parseInt(priceFrom as string) : undefined,
        priceTo: priceTo ? parseInt(priceTo as string) : undefined,
        bedrooms: bedrooms ? (Array.isArray(bedrooms) ? bedrooms.map(b => parseInt(b as string)) : [parseInt(bedrooms as string)]) : undefined,
      };

      const result = await this.realEstateService.getRealEstates({
        page: pageNum,
        limit: limitNum,
        status: status as string,
        featured: featured === 'true',
        filters,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.realEstates,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getRealEstates:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách bất động sản',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get featured real estates
   */
  public getFeaturedRealEstates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 6 } = req.query;
      const limitNum = Math.min(20, Math.max(1, parseInt(limit as string)));

      const realEstates = await this.realEstateService.getFeaturedRealEstates(limitNum);

      const response: ApiResponse<any[]> = {
        success: true,
        data: realEstates,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getFeaturedRealEstates:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy bất động sản nổi bật',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get available provinces
   */
  public getProvinces = async (req: Request, res: Response): Promise<void> => {
    try {
      const provinces = await this.realEstateService.getProvinces();

      const response: ApiResponse<string[]> = {
        success: true,
        data: provinces,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getProvinces:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách tỉnh thành',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get real estate statistics
   */
  public getRealEstateStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.realEstateService.getRealEstateStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getRealEstateStats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê bất động sản',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get single real estate by ID
   */
  public getRealEstateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID bất động sản không hợp lệ',
        });
        return;
      }

      const realEstate = await this.realEstateService.getRealEstateById(id);

      if (!realEstate) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy bất động sản',
        });
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: realEstate,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getRealEstateById:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin bất động sản',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Increment real estate view count
   */
  public incrementViewCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID bất động sản không hợp lệ',
        });
        return;
      }

      await this.realEstateService.incrementViewCount(id, {
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