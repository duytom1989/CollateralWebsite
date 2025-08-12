export type AssetStatus = 'processing' | 'available' | 'sold' | 'reserved' | 'cancelled';
export type AssetType = 'vehicle' | 'real_estate';
export type VehicleType = 'car' | 'truck' | 'motorcycle' | 'other';
export type VehicleTransmission = 'manual' | 'automatic' | 'semi_automatic';
export type RealEstateType = 'house' | 'apartment' | 'land' | 'commercial' | 'industrial' | 'other';
export type AdminRole = 'super_admin' | 'admin' | 'viewer';
export type Region = 'North' | 'Central' | 'South';
export interface Asset {
    id: string;
    assetType: AssetType;
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
    images?: AssetImage[];
}
export interface Vehicle extends Asset {
    assetType: 'vehicle';
    vehicleDetails: {
        brand?: string;
        model?: string;
        year?: number;
        vehicleType?: VehicleType;
        transmission?: VehicleTransmission;
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
export interface RealEstate extends Asset {
    assetType: 'real_estate';
    realEstateDetails: {
        propertyType?: RealEstateType;
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
export interface AssetImage {
    id: string;
    assetId: string;
    imageUrl: string;
    thumbnailUrl?: string;
    caption?: string;
    isPrimary: boolean;
    displayOrder: number;
    createdAt: string;
}
export interface CustomerInquiry {
    id: string;
    assetId?: string;
    customerName: string;
    phoneNumber: string;
    email?: string;
    message?: string;
    region: Region;
    status: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    asset?: Asset;
}
export interface AdminUser {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    role: AdminRole;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}
export interface SyncLog {
    id: string;
    syncType: string;
    status: string;
    totalRecords: number;
    syncedRecords: number;
    failedRecords: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface VehicleFilters {
    vehicleType?: VehicleType[];
    brand?: string[];
    yearFrom?: number;
    yearTo?: number;
    transmission?: VehicleTransmission[];
    priceFrom?: number;
    priceTo?: number;
    search?: string;
}
export interface RealEstateFilters {
    propertyType?: RealEstateType[];
    province?: string[];
    areaFrom?: number;
    areaTo?: number;
    priceFrom?: number;
    priceTo?: number;
    bedrooms?: number[];
    search?: string;
}
export interface ContactInfo {
    region: Region;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
}
export interface AnalyticsEvent {
    id: string;
    eventType: string;
    assetId?: string;
    sessionId?: string;
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    pageUrl?: string;
    eventData?: Record<string, any>;
    createdAt: string;
}
//# sourceMappingURL=index.d.ts.map