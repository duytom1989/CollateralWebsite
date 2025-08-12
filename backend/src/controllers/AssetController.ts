import { Request, Response } from 'express';
import { AssetService } from '../services/AssetService';

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

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export class AssetController {
  private assetService: AssetService;

  constructor() {
    this.assetService = new AssetService();
  }

  /**
   * Get all assets with filtering and pagination
   */
  public getAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        assetType,
        status = 'processing',
        featured,
        search,
        ...filters
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit as string)));

      const result = await this.assetService.getAssets({
        page: pageNum,
        limit: limitNum,
        assetType: assetType as string,
        status: status as string,
        featured: featured === 'true',
        search: search as string,
        filters,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.assets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAssets:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách tài sản',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get featured assets
   */
  public getFeaturedAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 6 } = req.query;
      const limitNum = Math.min(20, Math.max(1, parseInt(limit as string)));

      const assets = await this.assetService.getFeaturedAssets(limitNum);

      const response: ApiResponse<any[]> = {
        success: true,
        data: assets,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getFeaturedAssets:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy tài sản nổi bật',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Search assets by keyword
   */
  public searchAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        q: query,
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        assetType,
      } = req.query;

      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự',
        });
        return;
      }

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit as string)));

      const result = await this.assetService.searchAssets({
        query: query.trim(),
        page: pageNum,
        limit: limitNum,
        assetType: assetType as string,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.assets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in searchAssets:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tìm kiếm tài sản',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get asset statistics
   */
  public getAssetStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.assetService.getAssetStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAssetStats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê tài sản',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get single asset by ID
   */
  public getAssetById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID tài sản không hợp lệ',
        });
        return;
      }

      const asset = await this.assetService.getAssetById(id);

      if (!asset) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy tài sản',
        });
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: asset,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAssetById:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin tài sản',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Increment asset view count
   */
  public incrementViewCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID tài sản không hợp lệ',
        });
        return;
      }

      await this.assetService.incrementViewCount(id, {
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
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };
}