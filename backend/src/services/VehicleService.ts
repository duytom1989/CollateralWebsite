import { DatabaseService } from './DatabaseService';

// Define types locally since shared types are not properly set up for backend
type AssetStatus = 'processing' | 'available' | 'sold' | 'reserved' | 'cancelled';

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

interface Vehicle {
  id: string;
  assetType: 'vehicle';
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
  vehicleDetails: {
    brand?: string;
    model?: string;
    year?: number;
    vehicleType?: string;
    transmission?: string;
    fuelType?: string;
    mileage?: number;
    engineCapacity?: string;
    color?: string;
    licensePlate?: string;
    seats?: number;
    doors?: number;
    origin?: string;
    condition?: string;
  };
}

interface VehicleQueryOptions {
  page: number;
  limit: number;
  status?: string;
  featured?: boolean;
  filters?: VehicleFilters;
}

interface VehicleQueryResult {
  vehicles: Vehicle[];
  total: number;
}

interface ViewCountData {
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

export class VehicleService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Get vehicles with filtering and pagination
   */
  async getVehicles(options: VehicleQueryOptions): Promise<VehicleQueryResult> {
    const { page, limit, status = 'processing', featured, filters } = options;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        v.*,
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
      LEFT JOIN vehicles v ON a.id = v.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.asset_type = 'vehicle'
        AND a.status = $1
    `;

    const queryParams: (string | number | boolean | string[])[] = [status];
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
          OR normalize_vietnamese(v.brand) ILIKE normalize_vietnamese($${paramCount})
          OR normalize_vietnamese(v.model) ILIKE normalize_vietnamese($${paramCount})
          OR a.asset_code ILIKE $${paramCount}
        )`;
        queryParams.push(`%${filters.search}%`);
      }

      // Vehicle type filter
      if (filters.vehicleType && filters.vehicleType.length > 0) {
        paramCount++;
        query += ` AND v.vehicle_type = ANY($${paramCount})`;
        queryParams.push(filters.vehicleType);
      }

      // Brand filter
      if (filters.brand && filters.brand.length > 0) {
        paramCount++;
        query += ` AND v.brand = ANY($${paramCount})`;
        queryParams.push(filters.brand);
      }

      // Year range filter
      if (filters.yearFrom) {
        paramCount++;
        query += ` AND v.year >= $${paramCount}`;
        queryParams.push(filters.yearFrom);
      }
      if (filters.yearTo) {
        paramCount++;
        query += ` AND v.year <= $${paramCount}`;
        queryParams.push(filters.yearTo);
      }

      // Transmission filter
      if (filters.transmission && filters.transmission.length > 0) {
        paramCount++;
        query += ` AND v.transmission = ANY($${paramCount})`;
        queryParams.push(filters.transmission);
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
      GROUP BY a.id, v.id
      ORDER BY a.featured DESC, a.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    queryParams.push(limit, offset);

    // Count query for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM assets a
      LEFT JOIN vehicles v ON a.id = v.id
      WHERE a.asset_type = 'vehicle'
        AND a.status = $1
    `;
    const countParams: (string | number | boolean | string[])[] = [status];
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
          OR LOWER(v.brand) LIKE LOWER($${countParamCount})
          OR LOWER(v.model) LIKE LOWER($${countParamCount})
        )`;
        countParams.push(`%${filters.search}%`);
      }

      if (filters.vehicleType && filters.vehicleType.length > 0) {
        countParamCount++;
        countQuery += ` AND v.vehicle_type = ANY($${countParamCount})`;
        countParams.push(filters.vehicleType);
      }

      if (filters.brand && filters.brand.length > 0) {
        countParamCount++;
        countQuery += ` AND v.brand = ANY($${countParamCount})`;
        countParams.push(filters.brand);
      }

      if (filters.yearFrom) {
        countParamCount++;
        countQuery += ` AND v.year >= $${countParamCount}`;
        countParams.push(filters.yearFrom);
      }
      if (filters.yearTo) {
        countParamCount++;
        countQuery += ` AND v.year <= $${countParamCount}`;
        countParams.push(filters.yearTo);
      }

      if (filters.transmission && filters.transmission.length > 0) {
        countParamCount++;
        countQuery += ` AND v.transmission = ANY($${countParamCount})`;
        countParams.push(filters.transmission);
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
      const [vehiclesResult, countResult] = await Promise.all([
        this.db.query(query, queryParams),
        this.db.query(countQuery, countParams)
      ]);

      const vehicles = vehiclesResult.rows.map(this.mapRowToVehicle);
      const total = parseInt(countResult.rows[0]?.total || '0');

      return { vehicles, total };
    } catch (error) {
      console.error('Error in getVehicles:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get featured vehicles
   */
  async getFeaturedVehicles(limit: number = 6): Promise<Vehicle[]> {
    const query = `
      SELECT 
        a.*,
        v.*,
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
      LEFT JOIN vehicles v ON a.id = v.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.asset_type = 'vehicle'
        AND a.status = 'processing'
        AND a.featured = true
      GROUP BY a.id, v.id
      ORDER BY a.views_count DESC, a.created_at DESC
      LIMIT $1
    `;

    try {
      const result = await this.db.query(query, [limit]);
      return result.rows.map(this.mapRowToVehicle);
    } catch (error) {
      console.error('Error in getFeaturedVehicles:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    const query = `
      SELECT 
        a.*,
        v.*,
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
      LEFT JOIN vehicles v ON a.id = v.id
      LEFT JOIN asset_images ai ON a.id = ai.asset_id
      WHERE a.id = $1 AND a.asset_type = 'vehicle'
      GROUP BY a.id, v.id
    `;

    try {
      const result = await this.db.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToVehicle(result.rows[0]) : null;
    } catch (error) {
      console.error('Error in getVehicleById:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get available vehicle brands
   */
  async getVehicleBrands(): Promise<string[]> {
    const query = `
      SELECT DISTINCT v.brand
      FROM vehicles v
      JOIN assets a ON v.id = a.id
      WHERE a.status = 'processing' AND v.brand IS NOT NULL
      ORDER BY v.brand
    `;

    try {
      const result = await this.db.query(query);
      return result.rows.map(row => row.brand);
    } catch (error) {
      console.error('Error in getVehicleBrands:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Get vehicle statistics
   */
  async getVehicleStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_vehicles,
        COUNT(*) FILTER (WHERE a.featured = true) as featured_vehicles,
        AVG(a.price) as average_price,
        MIN(a.price) as min_price,
        MAX(a.price) as max_price,
        COUNT(DISTINCT v.brand) as unique_brands,
        COUNT(*) FILTER (WHERE v.vehicle_type = 'car') as cars,
        COUNT(*) FILTER (WHERE v.vehicle_type = 'truck') as trucks,
        COUNT(*) FILTER (WHERE v.vehicle_type = 'motorcycle') as motorcycles
      FROM assets a
      JOIN vehicles v ON a.id = v.id
      WHERE a.asset_type = 'vehicle' AND a.status = 'processing'
    `;

    try {
      const result = await this.db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getVehicleStats:', error);
      throw new Error('Lỗi khi truy vấn cơ sở dữ liệu');
    }
  }

  /**
   * Increment view count for a vehicle
   */
  async incrementViewCount(id: string, viewData: ViewCountData): Promise<void> {
    const updateQuery = `
      UPDATE assets 
      SET views_count = views_count + 1, updated_at = NOW()
      WHERE id = $1 AND asset_type = 'vehicle'
    `;

    const insertAnalyticsQuery = `
      INSERT INTO analytics_events (asset_id, event_type, user_agent, ip_address, referrer, created_at)
      VALUES ($1, 'vehicle_view', $2, $3, $4, NOW())
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
   * Map database row to Vehicle object
   */
  private mapRowToVehicle(row: any): Vehicle {
    return {
      id: row.id,
      assetType: 'vehicle',
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
      vehicleDetails: {
        brand: row.brand,
        model: row.model,
        year: row.year,
        vehicleType: row.vehicle_type,
        transmission: row.transmission,
        fuelType: row.fuel_type,
        mileage: row.mileage,
        engineCapacity: row.engine_capacity,
        color: row.color,
        licensePlate: row.license_plate,
        seats: row.seats,
        doors: row.doors,
        origin: row.origin,
        condition: row.condition,
      },
    };
  }
}