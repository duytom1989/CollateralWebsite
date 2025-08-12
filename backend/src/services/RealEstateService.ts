import { DatabaseService } from './DatabaseService';

// Define types locally since shared types are not properly set up for backend
type AssetStatus = 'processing' | 'available' | 'sold' | 'reserved' | 'cancelled';

interface RealEstateFilters {
  propertyType?: string[];
  province?: string[];
  areaFrom?: number;
  areaTo?: number;
  priceFrom?: number;
  priceTo?: number;
  search?: string;
}

interface RealEstate {
  id: string;
  assetType: 'real_estate';
  assetCode: string;
  name: string;
  description?: string;
  price?: number;
  status: AssetStatus;
  qltsId?: string;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  images?: any[];
  realEstateDetails: {
    propertyType?: string;
    address?: string;
    province?: string;
    district?: string;
    ward?: string;
    areaSqm?: number;
    landAreaSqm?: number;
    floors?: number;
    bedrooms?: number;
    bathrooms?: number;
    direction?: string;
    legalStatus?: string;
    certificateNumber?: string;
    landUsePurpose?: string;
    landUsePeriod?: string;
  };
}

interface RealEstateQueryOptions {
  page: number;
  limit: number;
  status?: string;
  featured?: boolean;
  filters?: RealEstateFilters;
}

interface RealEstateQueryResult {
  realEstates: RealEstate[];
  total: number;
}

interface ViewCountData {
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

export class RealEstateService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Get real estates with filtering and pagination
   */
  async getRealEstates(options: RealEstateQueryOptions): Promise<RealEstateQueryResult> {
    const { page, limit, status = 'processing', featured, filters } = options;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        re.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'caption', ai.caption,
              'isPrimary', ai.is_primary,
              'displayOrder', ai.display_order
            ) ORDER BY ai.display_order, ai.is_primary DESC
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM assets a
      LEFT JOIN real_estate re ON a.id = re.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.asset_type = 'real_estate'
        AND a.status = $1
    `;

    const queryParams: (string | number | boolean | string[] | number[])[] = [status];
    let paramCount = 1;

    // Featured filter
    if (featured !== undefined) {
      paramCount++;
      query += ` AND a.featured = $${paramCount}`;
      queryParams.push(featured);
    }

    // Apply filters
    if (filters) {
      // Search filter with Vietnamese diacritic support
      if (filters.search) {
        paramCount++;
        query += ` AND (
          normalize_vietnamese(a.name) ILIKE normalize_vietnamese($${paramCount}) 
          OR normalize_vietnamese(a.description) ILIKE normalize_vietnamese($${paramCount})
          OR normalize_vietnamese(re.address) ILIKE normalize_vietnamese($${paramCount})
          OR normalize_vietnamese(re.province) ILIKE normalize_vietnamese($${paramCount})
          OR normalize_vietnamese(re.district) ILIKE normalize_vietnamese($${paramCount})
          OR normalize_vietnamese(re.ward) ILIKE normalize_vietnamese($${paramCount})
          OR a.asset_code ILIKE $${paramCount}
        )`;
        queryParams.push(`%${filters.search}%`);
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType.length > 0) {
        paramCount++;
        query += ` AND re.property_type = ANY($${paramCount})`;
        queryParams.push(filters.propertyType);
      }

      // Province filter
      if (filters.province && filters.province.length > 0) {
        paramCount++;
        query += ` AND re.province = ANY($${paramCount})`;
        queryParams.push(filters.province);
      }

      // Area range filter
      if (filters.areaFrom) {
        paramCount++;
        query += ` AND re.area_sqm >= $${paramCount}`;
        queryParams.push(filters.areaFrom);
      }
      if (filters.areaTo) {
        paramCount++;
        query += ` AND re.area_sqm <= $${paramCount}`;
        queryParams.push(filters.areaTo);
      }


      // Price range filter
      if (filters.priceFrom) {
        paramCount++;
        query += ` AND a.price >= $${paramCount}`;
        queryParams.push(filters.priceFrom);
      }
      if (filters.priceTo) {
        paramCount++;
        query += ` AND a.price <= $${paramCount}`;
        queryParams.push(filters.priceTo);
      }
    }

    // Group by and order
    query += `
      GROUP BY a.id, re.id
      ORDER BY a.featured DESC, a.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    queryParams.push(limit, offset);

    // Count query for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM assets a
      LEFT JOIN real_estate re ON a.id = re.id
      WHERE a.asset_type = 'real_estate'
        AND a.status = $1
    `;
    const countParams: (string | number | boolean | string[] | number[])[] = [status];
    let countParamCount = 1;

    // Apply same filters to count query
    if (featured !== undefined) {
      countParamCount++;
      countQuery += ` AND a.featured = $${countParamCount}`;
      countParams.push(featured);
    }

    if (filters) {
      if (filters.search) {
        countParamCount++;
        countQuery += ` AND (
          LOWER(a.name) LIKE LOWER($${countParamCount}) 
          OR LOWER(a.description) LIKE LOWER($${countParamCount})
          OR LOWER(re.address) LIKE LOWER($${countParamCount})
          OR LOWER(re.province) LIKE LOWER($${countParamCount})
          OR LOWER(re.district) LIKE LOWER($${countParamCount})
        )`;
        countParams.push(`%${filters.search}%`);
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        countParamCount++;
        countQuery += ` AND re.property_type = ANY($${countParamCount})`;
        countParams.push(filters.propertyType);
      }

      if (filters.province && filters.province.length > 0) {
        countParamCount++;
        countQuery += ` AND re.province = ANY($${countParamCount})`;
        countParams.push(filters.province);
      }

      if (filters.areaFrom) {
        countParamCount++;
        countQuery += ` AND re.area_sqm >= $${countParamCount}`;
        countParams.push(filters.areaFrom);
      }
      if (filters.areaTo) {
        countParamCount++;
        countQuery += ` AND re.area_sqm <= $${countParamCount}`;
        countParams.push(filters.areaTo);
      }


      if (filters.priceFrom) {
        countParamCount++;
        countQuery += ` AND a.price >= $${countParamCount}`;
        countParams.push(filters.priceFrom);
      }
      if (filters.priceTo) {
        countParamCount++;
        countQuery += ` AND a.price <= $${countParamCount}`;
        countParams.push(filters.priceTo);
      }
    }

    try {
      const [realEstatesResult, countResult] = await Promise.all([
        this.db.query(query, queryParams),
        this.db.query(countQuery, countParams)
      ]);

      const realEstates = realEstatesResult.rows.map(this.mapRowToRealEstate);
      const total = parseInt(countResult.rows[0]?.total || '0');

      return { realEstates, total };
    } catch (error) {
      console.error('Error in getRealEstates:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get featured real estates
   */
  async getFeaturedRealEstates(limit: number = 6): Promise<RealEstate[]> {
    const query = `
      SELECT 
        a.*,
        re.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'caption', ai.caption,
              'isPrimary', ai.is_primary,
              'displayOrder', ai.display_order
            ) ORDER BY ai.display_order, ai.is_primary DESC
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM assets a
      LEFT JOIN real_estate re ON a.id = re.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.asset_type = 'real_estate'
        AND a.status = 'processing'
        AND a.featured = true
      GROUP BY a.id, re.id
      ORDER BY a.views_count DESC, a.created_at DESC
      LIMIT $1
    `;

    try {
      const result = await this.db.query(query, [limit]);
      return result.rows.map(this.mapRowToRealEstate);
    } catch (error) {
      console.error('Error in getFeaturedRealEstates:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get real estate by ID
   */
  async getRealEstateById(id: string): Promise<RealEstate | null> {
    const query = `
      SELECT 
        a.*,
        re.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'caption', ai.caption,
              'isPrimary', ai.is_primary,
              'displayOrder', ai.display_order
            ) ORDER BY ai.display_order, ai.is_primary DESC
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM assets a
      LEFT JOIN real_estate re ON a.id = re.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.id = $1 AND a.asset_type = 'real_estate'
      GROUP BY a.id, re.id
    `;

    try {
      const result = await this.db.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToRealEstate(result.rows[0]) : null;
    } catch (error) {
      console.error('Error in getRealEstateById:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get available provinces
   */
  async getProvinces(): Promise<string[]> {
    const query = `
      SELECT DISTINCT re.province
      FROM real_estate re
      JOIN assets a ON re.id = a.id
      WHERE a.status = 'processing' AND re.province IS NOT NULL
      ORDER BY re.province
    `;

    try {
      const result = await this.db.query(query);
      return result.rows.map(row => row.province);
    } catch (error) {
      console.error('Error in getProvinces:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get real estate statistics
   */
  async getRealEstateStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_properties,
        COUNT(*) FILTER (WHERE a.featured = true) as featured_properties,
        AVG(a.price) as average_price,
        MIN(a.price) as min_price,
        MAX(a.price) as max_price,
        COUNT(DISTINCT re.province) as unique_provinces,
        AVG(re.area_sqm) as average_area,
        COUNT(*) FILTER (WHERE re.property_type = 'house') as houses,
        COUNT(*) FILTER (WHERE re.property_type = 'apartment') as apartments,
        COUNT(*) FILTER (WHERE re.property_type = 'land') as land_plots,
        COUNT(*) FILTER (WHERE re.property_type = 'commercial') as commercial_properties
      FROM assets a
      JOIN real_estate re ON a.id = re.id
      WHERE a.asset_type = 'real_estate' AND a.status = 'processing'
    `;

    try {
      const result = await this.db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getRealEstateStats:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Increment view count for a real estate
   */
  async incrementViewCount(id: string, viewData: ViewCountData): Promise<void> {
    const updateQuery = `
      UPDATE assets 
      SET views_count = views_count + 1, updated_at = NOW()
      WHERE id = $1 AND asset_type = 'real_estate'
    `;

    const insertAnalyticsQuery = `
      INSERT INTO analytics_events (asset_id, event_type, user_agent, ip_address, referrer, created_at)
      VALUES ($1, 'real_estate_view', $2, $3, $4, NOW())
    `;

    try {
      await Promise.all([
        this.db.query(updateQuery, [id]),
        this.db.query(insertAnalyticsQuery, [id, viewData.userAgent, viewData.ipAddress, viewData.referrer])
      ]);
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
      throw new Error('Lỗi khi cập nhật lượt xem');
    }
  }

  /**
   * Map database row to RealEstate object
   */
  private mapRowToRealEstate(row: any): RealEstate {
    return {
      id: row.id,
      assetType: 'real_estate',
      assetCode: row.asset_code,
      name: row.name,
      description: row.description,
      price: row.price,
      status: row.status as AssetStatus,
      qltsId: row.qlts_id,
      featured: row.featured,
      viewsCount: row.views_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
      images: row.images || [],
      realEstateDetails: {
        propertyType: row.property_type,
        address: row.address,
        province: row.province,
        district: row.district,
        ward: row.ward,
        areaSqm: row.area_sqm,
        landAreaSqm: row.land_area_sqm,
        floors: row.floors,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        direction: row.direction,
        legalStatus: row.legal_status,
        certificateNumber: row.certificate_number,
        landUsePurpose: row.land_use_purpose,
        landUsePeriod: row.land_use_period,
      },
    };
  }
}