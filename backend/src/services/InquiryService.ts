import { DatabaseService } from './DatabaseService';

// Define types locally since shared types are not properly set up for backend
interface CustomerInquiry {
  id: string;
  assetId?: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  message?: string;
  region?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  asset?: {
    id: string;
    name: string;
    assetCode: string;
    assetType: string;
    price?: number;
  };
}

interface InquiryData {
  assetId?: string;
  assetType?: string;
  assetName?: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  message?: string;
  region?: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

interface ContactInquiryData extends InquiryData {
  region?: string;
  subject?: string;
}

interface InquiryQueryOptions {
  page: number;
  limit: number;
  filters?: {
    status?: string;
    assetType?: string;
    region?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  };
}

interface InquiryQueryResult {
  inquiries: CustomerInquiry[];
  total: number;
}

interface ExportFilters {
  status?: string;
  assetType?: string;
  region?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class InquiryService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Create asset inquiry
   */
  async createInquiry(data: InquiryData): Promise<CustomerInquiry> {
    const query = `
      INSERT INTO customer_inquiries (
        asset_id, customer_name, phone_number, email, message, 
        region, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'new', NOW())
      RETURNING *
    `;

    const values = [
      data.assetId,
      data.customerName,
      data.phoneNumber,
      data.email,
      data.message,
      data.region
    ];

    try {
      const result = await this.db.query(query, values);
      const inquiry = this.mapRowToInquiry(result.rows[0]);

      // Track analytics event
      await this.trackInquiryEvent({
        inquiryId: inquiry.id,
        assetId: data.assetId,
        eventType: 'asset_inquiry',
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referrer: data.referrer,
      });

      return inquiry;
    } catch (error) {
      console.error('Error in createInquiry:', error);
      throw new Error('Lỗi khi tạo yêu cầu tư vấn');
    }
  }

  /**
   * Create general contact inquiry
   */
  async createContactInquiry(data: ContactInquiryData): Promise<CustomerInquiry> {
    const query = `
      INSERT INTO customer_inquiries (
        customer_name, phone_number, email, message, region, 
        status, created_at, notes
      )
      VALUES ($1, $2, $3, $4, $5, 'new', NOW(), $6)
      RETURNING *
    `;

    const values = [
      data.customerName,
      data.phoneNumber,
      data.email,
      data.message,
      data.region,
      data.subject ? `Chủ đề: ${data.subject}` : null
    ];

    try {
      const result = await this.db.query(query, values);
      const inquiry = this.mapRowToInquiry(result.rows[0]);

      // Track analytics event
      await this.trackInquiryEvent({
        inquiryId: inquiry.id,
        eventType: 'contact_form',
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referrer: data.referrer,
      });

      return inquiry;
    } catch (error) {
      console.error('Error in createContactInquiry:', error);
      throw new Error('Lỗi khi tạo yêu cầu liên hệ');
    }
  }

  /**
   * Get inquiries with filtering and pagination
   */
  async getInquiries(options: InquiryQueryOptions): Promise<InquiryQueryResult> {
    const { page, limit, filters } = options;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        ci.*,
        a.name as asset_name,
        a.asset_code,
        a.asset_type
      FROM customer_inquiries ci
      LEFT JOIN assets a ON ci.asset_id = a.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramCount = 0;

    // Apply filters
    if (filters) {
      if (filters.status) {
        paramCount++;
        query += ` AND ci.status = $${paramCount}`;
        queryParams.push(filters.status);
      }

      if (filters.assetType) {
        paramCount++;
        query += ` AND a.asset_type = $${paramCount}`;
        queryParams.push(filters.assetType);
      }

      if (filters.region) {
        paramCount++;
        query += ` AND ci.region = $${paramCount}`;
        queryParams.push(filters.region);
      }

      if (filters.dateFrom) {
        paramCount++;
        query += ` AND ci.created_at >= $${paramCount}`;
        queryParams.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        paramCount++;
        query += ` AND ci.created_at <= $${paramCount}`;
        queryParams.push(filters.dateTo);
      }

      if (filters.search) {
        paramCount++;
        query += ` AND (
          LOWER(ci.customer_name) LIKE LOWER($${paramCount})
          OR LOWER(ci.phone_number) LIKE LOWER($${paramCount})
          OR LOWER(ci.email) LIKE LOWER($${paramCount})
          OR LOWER(a.name) LIKE LOWER($${paramCount})
        )`;
        queryParams.push(`%${filters.search}%`);
      }
    }

    // Order and pagination
    query += `
      ORDER BY ci.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    queryParams.push(limit, offset);

    // Count query
    let countQuery = `
      SELECT COUNT(*) as total
      FROM customer_inquiries ci
      LEFT JOIN assets a ON ci.asset_id = a.id
      WHERE 1=1
    `;
    const countParams: any[] = [];
    let countParamCount = 0;

    // Apply same filters to count query
    if (filters) {
      if (filters.status) {
        countParamCount++;
        countQuery += ` AND ci.status = $${countParamCount}`;
        countParams.push(filters.status);
      }

      if (filters.assetType) {
        countParamCount++;
        countQuery += ` AND a.asset_type = $${countParamCount}`;
        countParams.push(filters.assetType);
      }

      if (filters.region) {
        countParamCount++;
        countQuery += ` AND ci.region = $${countParamCount}`;
        countParams.push(filters.region);
      }

      if (filters.dateFrom) {
        countParamCount++;
        countQuery += ` AND ci.created_at >= $${countParamCount}`;
        countParams.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        countParamCount++;
        countQuery += ` AND ci.created_at <= $${countParamCount}`;
        countParams.push(filters.dateTo);
      }

      if (filters.search) {
        countParamCount++;
        countQuery += ` AND (
          LOWER(ci.customer_name) LIKE LOWER($${countParamCount})
          OR LOWER(ci.phone_number) LIKE LOWER($${countParamCount})
          OR LOWER(ci.email) LIKE LOWER($${countParamCount})
          OR LOWER(a.name) LIKE LOWER($${countParamCount})
        )`;
        countParams.push(`%${filters.search}%`);
      }
    }

    try {
      const [inquiriesResult, countResult] = await Promise.all([
        this.db.query(query, queryParams),
        this.db.query(countQuery, countParams)
      ]);

      const inquiries = inquiriesResult.rows.map(this.mapRowToInquiry);
      const total = parseInt(countResult.rows[0]?.total || '0');

      return { inquiries, total };
    } catch (error) {
      console.error('Error in getInquiries:', error);
      throw new Error('Lỗi khi truy vấn danh sách yêu cầu');
    }
  }

  /**
   * Get inquiry by ID
   */
  async getInquiryById(id: string): Promise<CustomerInquiry | null> {
    const query = `
      SELECT 
        ci.*,
        a.name as asset_name,
        a.asset_code,
        a.asset_type,
        a.price as asset_price
      FROM customer_inquiries ci
      LEFT JOIN assets a ON ci.asset_id = a.id
      WHERE ci.id = $1
    `;

    try {
      const result = await this.db.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToInquiry(result.rows[0]) : null;
    } catch (error) {
      console.error('Error in getInquiryById:', error);
      throw new Error('Lỗi khi truy vấn thông tin yêu cầu');
    }
  }

  /**
   * Update inquiry status
   */
  async updateInquiryStatus(id: string, status: string, notes?: string): Promise<CustomerInquiry | null> {
    const query = `
      UPDATE customer_inquiries 
      SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, [status, notes, id]);
      return result.rows.length > 0 ? this.mapRowToInquiry(result.rows[0]) : null;
    } catch (error) {
      console.error('Error in updateInquiryStatus:', error);
      throw new Error('Lỗi khi cập nhật trạng thái yêu cầu');
    }
  }

  /**
   * Get inquiry statistics
   */
  async getInquiryStats(period: string = '30d'): Promise<any> {
    let dateFilter = '';
    switch (period) {
      case '7d':
        dateFilter = "AND ci.created_at >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "AND ci.created_at >= NOW() - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "AND ci.created_at >= NOW() - INTERVAL '90 days'";
        break;
      default:
        dateFilter = "AND ci.created_at >= NOW() - INTERVAL '30 days'";
    }

    const query = `
      SELECT 
        COUNT(*) as total_inquiries,
        COUNT(*) FILTER (WHERE ci.status = 'new') as new_inquiries,
        COUNT(*) FILTER (WHERE ci.status = 'contacted') as contacted_inquiries,
        COUNT(*) FILTER (WHERE ci.status = 'completed') as completed_inquiries,
        COUNT(*) FILTER (WHERE ci.asset_id IS NOT NULL) as asset_inquiries,
        COUNT(*) FILTER (WHERE ci.asset_id IS NULL) as general_inquiries,
        COUNT(DISTINCT ci.phone_number) as unique_customers,
        COUNT(*) FILTER (WHERE a.asset_type = 'vehicle') as vehicle_inquiries,
        COUNT(*) FILTER (WHERE a.asset_type = 'real_estate') as real_estate_inquiries
      FROM customer_inquiries ci
      LEFT JOIN assets a ON ci.asset_id = a.id
      WHERE 1=1 ${dateFilter}
    `;

    try {
      const result = await this.db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getInquiryStats:', error);
      throw new Error('Lỗi khi truy vấn thống kê yêu cầu');
    }
  }

  /**
   * Export inquiries to CSV
   */
  async exportInquiriesToCSV(filters: ExportFilters): Promise<string> {
    let query = `
      SELECT 
        ci.id,
        ci.customer_name,
        ci.phone_number,
        ci.email,
        ci.message,
        ci.status,
        ci.region,
        ci.notes,
        ci.created_at,
        ci.updated_at,
        a.name as asset_name,
        a.asset_code,
        a.asset_type,
        a.price as asset_price
      FROM customer_inquiries ci
      LEFT JOIN assets a ON ci.asset_id = a.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramCount = 0;

    // Apply filters
    if (filters.status) {
      paramCount++;
      query += ` AND ci.status = $${paramCount}`;
      queryParams.push(filters.status);
    }

    if (filters.assetType) {
      paramCount++;
      query += ` AND a.asset_type = $${paramCount}`;
      queryParams.push(filters.assetType);
    }

    if (filters.region) {
      paramCount++;
      query += ` AND ci.region = $${paramCount}`;
      queryParams.push(filters.region);
    }

    if (filters.dateFrom) {
      paramCount++;
      query += ` AND ci.created_at >= $${paramCount}`;
      queryParams.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      paramCount++;
      query += ` AND ci.created_at <= $${paramCount}`;
      queryParams.push(filters.dateTo);
    }

    query += ` ORDER BY ci.created_at DESC`;

    try {
      const result = await this.db.query(query, queryParams);
      
      // CSV headers
      const headers = [
        'ID',
        'Họ tên',
        'Số điện thoại', 
        'Email',
        'Tin nhắn',
        'Trạng thái',
        'Khu vực',
        'Ghi chú',
        'Ngày tạo',
        'Ngày cập nhật',
        'Tên tài sản',
        'Mã tài sản',
        'Loại tài sản',
        'Giá tài sản'
      ];

      let csvContent = headers.join(',') + '\n';

      // CSV rows
      result.rows.forEach(row => {
        const csvRow = [
          row.id,
          `"${row.customer_name || ''}"`,
          `"${row.phone_number || ''}"`,
          `"${row.email || ''}"`,
          `"${(row.message || '').replace(/"/g, '""')}"`,
          `"${row.status || ''}"`,
          `"${row.region || ''}"`,
          `"${(row.notes || '').replace(/"/g, '""')}"`,
          row.created_at ? new Date(row.created_at).toLocaleString('vi-VN') : '',
          row.updated_at ? new Date(row.updated_at).toLocaleString('vi-VN') : '',
          `"${row.asset_name || ''}"`,
          `"${row.asset_code || ''}"`,
          `"${row.asset_type || ''}"`,
          row.asset_price || ''
        ];
        csvContent += csvRow.join(',') + '\n';
      });

      return csvContent;
    } catch (error) {
      console.error('Error in exportInquiriesToCSV:', error);
      throw new Error('Lỗi khi xuất dữ liệu CSV');
    }
  }

  /**
   * Track inquiry analytics event
   */
  private async trackInquiryEvent(data: {
    inquiryId: string;
    assetId?: string;
    eventType: string;
    userAgent: string;
    ipAddress: string;
    referrer?: string;
  }): Promise<void> {
    const query = `
      INSERT INTO analytics_events (
        event_type, asset_id, user_agent, ip_address, referrer, 
        event_data, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

    const eventData = JSON.stringify({
      inquiryId: data.inquiryId,
      source: 'inquiry_form'
    });

    try {
      await this.db.query(query, [
        data.eventType,
        data.assetId,
        data.userAgent,
        data.ipAddress,
        data.referrer,
        eventData
      ]);
    } catch (error) {
      console.error('Error tracking inquiry event:', error);
      // Don't throw error for analytics tracking failure
    }
  }

  /**
   * Map database row to CustomerInquiry object
   */
  private mapRowToInquiry(row: any): CustomerInquiry {
    return {
      id: row.id,
      assetId: row.asset_id,
      customerName: row.customer_name,
      phoneNumber: row.phone_number,
      email: row.email,
      message: row.message,
      region: row.region,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      asset: row.asset_name ? {
        id: row.asset_id,
        name: row.asset_name,
        assetCode: row.asset_code,
        assetType: row.asset_type,
        price: row.asset_price,
      } : undefined,
    };
  }
}