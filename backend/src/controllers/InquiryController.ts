import { Request, Response } from 'express';
import { InquiryService } from '../services/InquiryService';

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

export class InquiryController {
  private inquiryService: InquiryService;

  constructor() {
    this.inquiryService = new InquiryService();
  }

  /**
   * Submit asset inquiry
   */
  public submitInquiry = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        assetId,
        customerName,
        phoneNumber,
        email,
        message,
        region
      } = req.body;

      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      const inquiryData = {
        assetId,
        customerName,
        phoneNumber,
        email,
        message,
        region,
        userAgent,
        ipAddress,
        referrer: req.get('Referer'),
      };

      const inquiry = await this.inquiryService.createInquiry(inquiryData);

      const response: ApiResponse<any> = {
        success: true,
        data: inquiry,
        message: 'Yêu cầu tư vấn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error in submitInquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi yêu cầu tư vấn. Vui lòng thử lại sau.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Submit general contact form
   */
  public submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        phone,
        email,
        region,
        subject,
        message
      } = req.body;

      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      const contactData = {
        customerName: name,
        phoneNumber: phone,
        email,
        region,
        subject,
        message,
        userAgent,
        ipAddress,
        referrer: req.get('Referer'),
      };

      const inquiry = await this.inquiryService.createContactInquiry(contactData);

      const response: ApiResponse<any> = {
        success: true,
        data: inquiry,
        message: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error in submitContactForm:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi tin nhắn. Vui lòng thử lại sau.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get all inquiries with filtering and pagination (Admin only)
   */
  public getInquiries = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        status,
        assetType,
        region,
        dateFrom,
        dateTo,
        search
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit as string)));

      const filters = {
        status: status as string,
        assetType: assetType as string,
        region: region as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        search: search as string,
      };

      const result = await this.inquiryService.getInquiries({
        page: pageNum,
        limit: limitNum,
        filters,
      });

      const response: PaginatedResponse<any> = {
        success: true,
        data: result.inquiries,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getInquiries:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách yêu cầu',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get inquiry statistics (Admin only)
   */
  public getInquiryStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { period = '30d' } = req.query;
      const stats = await this.inquiryService.getInquiryStats(period as string);

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getInquiryStats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê yêu cầu',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Get single inquiry by ID (Admin only)
   */
  public getInquiryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID yêu cầu không hợp lệ',
        });
        return;
      }

      const inquiry = await this.inquiryService.getInquiryById(id);

      if (!inquiry) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy yêu cầu',
        });
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: inquiry,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getInquiryById:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin yêu cầu',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Update inquiry status (Admin only)
   */
  public updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID yêu cầu không hợp lệ',
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ',
        });
        return;
      }

      const updatedInquiry = await this.inquiryService.updateInquiryStatus(id, status, notes);

      if (!updatedInquiry) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy yêu cầu',
        });
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: updatedInquiry,
        message: 'Đã cập nhật trạng thái yêu cầu',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in updateInquiryStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái yêu cầu',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };

  /**
   * Export inquiries to CSV (Admin only)
   */
  public exportInquiriesToCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status,
        assetType,
        region,
        dateFrom,
        dateTo
      } = req.query;

      const filters = {
        status: status as string,
        assetType: assetType as string,
        region: region as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
      };

      const csvData = await this.inquiryService.exportInquiriesToCSV(filters);

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="inquiries_${new Date().toISOString().split('T')[0]}.csv"`);
      res.setHeader('Cache-Control', 'no-cache');

      // Add BOM for UTF-8
      res.write('\uFEFF');
      res.write(csvData);
      res.end();
    } catch (error) {
      console.error('Error in exportInquiriesToCSV:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xuất dữ liệu CSV',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      });
    }
  };
}