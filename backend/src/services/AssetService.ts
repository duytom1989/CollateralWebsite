import { DatabaseService } from './DatabaseService';

interface AssetFilters {
  page: number;
  limit: number;
  assetType?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  filters?: any;
}

interface SearchParams {
  query: string;
  page: number;
  limit: number;
  assetType?: string;
}

interface ViewData {
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

export class AssetService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Get assets with filtering and pagination
   */
  public async getAssets(params: AssetFilters): Promise<{ assets: any[], total: number }> {
    const { page, limit, assetType, status, featured, search, filters } = params;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        CASE 
          WHEN a.asset_type = 'vehicle' THEN 
            json_build_object(
              'brand', v.brand,
              'model', v.model,
              'year', v.year,
              'vehicleType', v.vehicle_type,
              'transmission', v.transmission,
              'fuelType', v.fuel_type,
              'mileage', v.mileage,
              'engineCapacity', v.engine_capacity,
              'color', v.color,
              'licensePlate', v.license_plate,
              'seats', v.seats,
              'doors', v.doors,
              'origin', v.origin,
              'condition', v.condition
            )
          WHEN a.asset_type = 'real_estate' THEN
            json_build_object(
              'propertyType', re.property_type,
              'address', re.address,
              'province', re.province,
              'district', re.district,
              'ward', re.ward,
              'areaSqm', re.area_sqm,
              'landAreaSqm', re.land_area_sqm,
              'floors', re.floors,
              'bedrooms', re.bedrooms,
              'bathrooms', re.bathrooms,
              'direction', re.direction,
              'legalStatus', re.legal_status,
              'certificateNumber', re.certificate_number,
              'landUsePurpose', re.land_use_purpose,
              'landUsePeriod', re.land_use_period
            )
        END as asset_details,
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
      LEFT JOIN vehicles v ON a.id = v.id AND a.asset_type = 'vehicle'
      LEFT JOIN real_estate re ON a.id = re.id AND a.asset_type = 'real_estate'
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    // Apply filters
    if (assetType) {
      query += ` AND a.asset_type = $${paramIndex}`;
      queryParams.push(assetType);
      paramIndex++;
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (featured !== undefined) {
      query += ` AND a.featured = $${paramIndex}`;
      queryParams.push(featured);
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        normalize_vietnamese(a.name) ILIKE normalize_vietnamese($${paramIndex}) OR 
        normalize_vietnamese(a.description) ILIKE normalize_vietnamese($${paramIndex}) OR
        a.asset_code ILIKE $${paramIndex}
      )`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Apply asset-specific filters
    if (filters && Object.keys(filters).length > 0) {
      if (assetType === 'vehicle') {
        query = this.applyVehicleFilters(query, queryParams, filters, paramIndex);
      } else if (assetType === 'real_estate') {
        query = this.applyRealEstateFilters(query, queryParams, filters, paramIndex);
      }
    }

    query += ` 
      GROUP BY a.id, v.brand, v.model, v.year, v.vehicle_type, v.transmission, v.fuel_type, 
               v.mileage, v.engine_capacity, v.color, v.license_plate, v.seats, v.doors, 
               v.origin, v.condition, re.property_type, re.address, re.province, re.district, 
               re.ward, re.area_sqm, re.land_area_sqm, re.floors, re.bedrooms, re.bathrooms, 
               re.direction, re.legal_status, re.certificate_number, re.land_use_purpose, re.land_use_period
      ORDER BY a.featured DESC, a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM assets a
      LEFT JOIN vehicles v ON a.id = v.id AND a.asset_type = 'vehicle'
      LEFT JOIN real_estate re ON a.id = re.id AND a.asset_type = 'real_estate'
      WHERE 1=1
    `;

    // Apply same filters to count query (without the last two pagination params)
    const countParams = queryParams.slice(0, -2);
    let countParamIndex = 1;

    if (assetType) {
      countQuery += ` AND a.asset_type = $${countParamIndex}`;
      countParamIndex++;
    }

    if (status) {
      countQuery += ` AND a.status = $${countParamIndex}`;
      countParamIndex++;
    }

    if (featured !== undefined) {
      countQuery += ` AND a.featured = $${countParamIndex}`;
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (
        a.name ILIKE $${countParamIndex} OR 
        a.description ILIKE $${countParamIndex} OR
        a.asset_code ILIKE $${countParamIndex}
      )`;
      countParamIndex++;
    }

    const [assetsResult, countResult] = await Promise.all([
      this.db.query(query, queryParams),
      this.db.query(countQuery, countParams),
    ]);

    return {
      assets: assetsResult.rows.map(this.formatAssetResponse),
      total: parseInt(countResult.rows[0]?.total || '0'),
    };
  }

  /**
   * Get featured assets
   */
  public async getFeaturedAssets(limit: number = 6): Promise<any[]> {
    const query = `
      SELECT 
        a.*,
        CASE 
          WHEN a.asset_type = 'vehicle' THEN 
            json_build_object(
              'brand', v.brand,
              'model', v.model,
              'year', v.year,
              'vehicleType', v.vehicle_type,
              'transmission', v.transmission,
              'mileage', v.mileage,
              'color', v.color
            )
          WHEN a.asset_type = 'real_estate' THEN
            json_build_object(
              'propertyType', re.property_type,
              'province', re.province,
              'areaSqm', re.area_sqm,
              'bedrooms', re.bedrooms
            )
        END as asset_details,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'isPrimary', ai.is_primary
            ) ORDER BY ai.is_primary DESC, ai.display_order
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM assets a
      LEFT JOIN vehicles v ON a.id = v.id AND a.asset_type = 'vehicle'
      LEFT JOIN real_estate re ON a.id = re.id AND a.asset_type = 'real_estate'
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.featured = true AND a.status = 'processing'
      GROUP BY a.id, v.brand, v.model, v.year, v.vehicle_type, v.transmission, v.mileage, v.color,
               re.property_type, re.province, re.area_sqm, re.bedrooms
      ORDER BY a.views_count DESC, a.created_at DESC
      LIMIT $1
    `;

    const result = await this.db.query(query, [limit]);
    return result.rows.map(this.formatAssetResponse);
  }

  /**
   * Search assets by keyword
   */
  public async searchAssets(params: SearchParams): Promise<{ assets: any[], total: number }> {
    const { query: searchQuery, page, limit, assetType } = params;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        CASE 
          WHEN a.asset_type = 'vehicle' THEN 
            json_build_object(
              'brand', v.brand,
              'model', v.model,
              'year', v.year,
              'vehicleType', v.vehicle_type,
              'transmission', v.transmission,
              'mileage', v.mileage,
              'color', v.color
            )
          WHEN a.asset_type = 'real_estate' THEN
            json_build_object(
              'propertyType', re.property_type,
              'province', re.province,
              'areaSqm', re.area_sqm,
              'bedrooms', re.bedrooms
            )
        END as asset_details,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'isPrimary', ai.is_primary
            ) ORDER BY ai.is_primary DESC
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images,
        ts_rank(
          to_tsvector('simple', a.name || ' ' || COALESCE(a.description, '') || ' ' || a.asset_code),
          plainto_tsquery('simple', $1)
        ) as relevance
      FROM assets a
      LEFT JOIN vehicles v ON a.id = v.id AND a.asset_type = 'vehicle'
      LEFT JOIN real_estate re ON a.id = re.id AND a.asset_type = 'real_estate'
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE 
        a.status = 'processing' AND
        (
          a.name ILIKE $2 OR 
          a.description ILIKE $2 OR
          a.asset_code ILIKE $2 OR
          to_tsvector('simple', a.name || ' ' || COALESCE(a.description, '')) @@ plainto_tsquery('simple', $1)
        )
    `;

    const queryParams: any[] = [searchQuery, `%${searchQuery}%`];
    let paramIndex = 3;

    if (assetType) {
      query += ` AND a.asset_type = $${paramIndex}`;
      queryParams.push(assetType);
      paramIndex++;
    }

    query += `
      GROUP BY a.id, v.brand, v.model, v.year, v.vehicle_type, v.transmission, v.mileage, v.color,
               re.property_type, re.province, re.area_sqm, re.bedrooms
      ORDER BY relevance DESC, a.featured DESC, a.views_count DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    // Count query
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM assets a
      WHERE 
        a.status = 'processing' AND
        (
          a.name ILIKE $2 OR 
          a.description ILIKE $2 OR
          a.asset_code ILIKE $2 OR
          to_tsvector('simple', a.name || ' ' || COALESCE(a.description, '')) @@ plainto_tsquery('simple', $1)
        )
    `;

    const countParams = [searchQuery, `%${searchQuery}%`];

    if (assetType) {
      countQuery += ` AND a.asset_type = $3`;
      countParams.push(assetType);
    }

    const [assetsResult, countResult] = await Promise.all([
      this.db.query(query, queryParams),
      this.db.query(countQuery, countParams),
    ]);

    return {
      assets: assetsResult.rows.map(this.formatAssetResponse),
      total: parseInt(countResult.rows[0]?.total || '0'),
    };
  }

  /**
   * Get asset statistics
   */
  public async getAssetStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_assets,
        COUNT(*) FILTER (WHERE asset_type = 'vehicle') as total_vehicles,
        COUNT(*) FILTER (WHERE asset_type = 'real_estate') as total_real_estate,
        COUNT(*) FILTER (WHERE featured = true) as featured_assets,
        SUM(views_count) as total_views,
        AVG(price) FILTER (WHERE price IS NOT NULL) as average_price,
        MIN(price) FILTER (WHERE price IS NOT NULL) as min_price,
        MAX(price) FILTER (WHERE price IS NOT NULL) as max_price
      FROM assets 
      WHERE status = 'processing'
    `;

    const result = await this.db.query(query);
    return result.rows[0];
  }

  /**
   * Get asset by ID
   */
  public async getAssetById(id: string): Promise<any | null> {
    const query = `
      SELECT 
        a.*,
        CASE 
          WHEN a.asset_type = 'vehicle' THEN 
            json_build_object(
              'brand', v.brand,
              'model', v.model,
              'year', v.year,
              'vehicleType', v.vehicle_type,
              'transmission', v.transmission,
              'fuelType', v.fuel_type,
              'mileage', v.mileage,
              'engineCapacity', v.engine_capacity,
              'color', v.color,
              'licensePlate', v.license_plate,
              'seats', v.seats,
              'doors', v.doors,
              'origin', v.origin,
              'condition', v.condition
            )
          WHEN a.asset_type = 'real_estate' THEN
            json_build_object(
              'propertyType', re.property_type,
              'address', re.address,
              'province', re.province,
              'district', re.district,
              'ward', re.ward,
              'areaSqm', re.area_sqm,
              'landAreaSqm', re.land_area_sqm,
              'floors', re.floors,
              'bedrooms', re.bedrooms,
              'bathrooms', re.bathrooms,
              'direction', re.direction,
              'legalStatus', re.legal_status,
              'certificateNumber', re.certificate_number,
              'landUsePurpose', re.land_use_purpose,
              'landUsePeriod', re.land_use_period
            )
        END as asset_details,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ai.id,
              'imageUrl', ai.image_url,
              'thumbnailUrl', ai.thumbnail_url,
              'caption', ai.caption,
              'isPrimary', ai.is_primary,
              'displayOrder', ai.display_order
            ) ORDER BY ai.is_primary DESC, ai.display_order
          ) FILTER (WHERE ai.id IS NOT NULL), 
          '[]'::json
        ) as images
      FROM assets a
      LEFT JOIN vehicles v ON a.id = v.id AND a.asset_type = 'vehicle'
      LEFT JOIN real_estate re ON a.id = re.id AND a.asset_type = 'real_estate'
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.id = $1
      GROUP BY a.id, v.brand, v.model, v.year, v.vehicle_type, v.transmission, v.fuel_type, 
               v.mileage, v.engine_capacity, v.color, v.license_plate, v.seats, v.doors, 
               v.origin, v.condition, re.property_type, re.address, re.province, re.district, 
               re.ward, re.area_sqm, re.land_area_sqm, re.floors, re.bedrooms, re.bathrooms, 
               re.direction, re.legal_status, re.certificate_number, re.land_use_purpose, re.land_use_period
    `;

    const result = await this.db.query(query, [id]);
    return result.rows.length > 0 ? this.formatAssetResponse(result.rows[0]) : null;
  }

  /**
   * Increment view count for an asset
   */
  public async incrementViewCount(assetId: string, viewData: ViewData): Promise<void> {
    const client = await this.db.getClient();
    
    try {
      await client.query('BEGIN');

      // Update view count
      await client.query(
        'UPDATE assets SET views_count = views_count + 1 WHERE id = $1',
        [assetId]
      );

      // Log analytics event
      await client.query(`
        INSERT INTO analytics_events (event_type, asset_id, user_agent, ip_address, referrer, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, ['asset_view', assetId, viewData.userAgent, viewData.ipAddress, viewData.referrer]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Apply vehicle-specific filters
   */
  private applyVehicleFilters(query: string, params: any[], filters: any, startIndex: number): string {
    let paramIndex = startIndex;

    if (filters.vehicleType && filters.vehicleType.length > 0) {
      query += ` AND v.vehicle_type = ANY($${paramIndex})`;
      params.push(filters.vehicleType);
      paramIndex++;
    }

    if (filters.brand && filters.brand.length > 0) {
      query += ` AND v.brand = ANY($${paramIndex})`;
      params.push(filters.brand);
      paramIndex++;
    }

    if (filters.yearFrom) {
      query += ` AND v.year >= $${paramIndex}`;
      params.push(parseInt(filters.yearFrom));
      paramIndex++;
    }

    if (filters.yearTo) {
      query += ` AND v.year <= $${paramIndex}`;
      params.push(parseInt(filters.yearTo));
      paramIndex++;
    }

    if (filters.transmission && filters.transmission.length > 0) {
      query += ` AND v.transmission = ANY($${paramIndex})`;
      params.push(filters.transmission);
      paramIndex++;
    }

    if (filters.priceFrom) {
      query += ` AND a.price >= $${paramIndex}`;
      params.push(parseInt(filters.priceFrom));
      paramIndex++;
    }

    if (filters.priceTo) {
      query += ` AND a.price <= $${paramIndex}`;
      params.push(parseInt(filters.priceTo));
      paramIndex++;
    }

    return query;
  }

  /**
   * Apply real estate-specific filters
   */
  private applyRealEstateFilters(query: string, params: any[], filters: any, startIndex: number): string {
    let paramIndex = startIndex;

    if (filters.propertyType && filters.propertyType.length > 0) {
      query += ` AND re.property_type = ANY($${paramIndex})`;
      params.push(filters.propertyType);
      paramIndex++;
    }

    if (filters.province && filters.province.length > 0) {
      query += ` AND re.province = ANY($${paramIndex})`;
      params.push(filters.province);
      paramIndex++;
    }

    if (filters.areaFrom) {
      query += ` AND re.area_sqm >= $${paramIndex}`;
      params.push(parseInt(filters.areaFrom));
      paramIndex++;
    }

    if (filters.areaTo) {
      query += ` AND re.area_sqm <= $${paramIndex}`;
      params.push(parseInt(filters.areaTo));
      paramIndex++;
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {
      query += ` AND re.bedrooms = ANY($${paramIndex})`;
      params.push(filters.bedrooms.map((b: string) => parseInt(b)));
      paramIndex++;
    }

    if (filters.priceFrom) {
      query += ` AND a.price >= $${paramIndex}`;
      params.push(parseInt(filters.priceFrom));
      paramIndex++;
    }

    if (filters.priceTo) {
      query += ` AND a.price <= $${paramIndex}`;
      params.push(parseInt(filters.priceTo));
      paramIndex++;
    }

    return query;
  }

  /**
   * Format asset response
   */
  private formatAssetResponse(row: any): any {
    return {
      id: row.id,
      assetType: row.asset_type,
      assetCode: row.asset_code,
      name: row.name,
      description: row.description,
      price: row.price,
      status: row.status,
      qltsId: row.qlts_id,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
      images: row.images || [],
      ...(row.asset_type === 'vehicle' && { vehicleDetails: row.asset_details }),
      ...(row.asset_type === 'real_estate' && { realEstateDetails: row.asset_details }),
    };
  }
}