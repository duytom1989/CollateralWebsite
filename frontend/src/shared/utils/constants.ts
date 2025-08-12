// Shared constants for VPBank Collateral Website

export const ASSET_TYPES = {
  VEHICLE: 'vehicle' as const,
  REAL_ESTATE: 'real_estate' as const,
};

export const ASSET_STATUS = {
  PROCESSING: 'processing' as const,
  AVAILABLE: 'available' as const,
  SOLD: 'sold' as const,
  RESERVED: 'reserved' as const,
  CANCELLED: 'cancelled' as const,
};

export const VEHICLE_TYPES = {
  CAR: 'car' as const,
  TRUCK: 'truck' as const,
  MOTORCYCLE: 'motorcycle' as const,
  OTHER: 'other' as const,
};

export const VEHICLE_TRANSMISSIONS = {
  MANUAL: 'manual' as const,
  AUTOMATIC: 'automatic' as const,
  SEMI_AUTOMATIC: 'semi_automatic' as const,
};

export const REAL_ESTATE_TYPES = {
  HOUSE: 'house' as const,
  APARTMENT: 'apartment' as const,
  LAND: 'land' as const,
  COMMERCIAL: 'commercial' as const,
  INDUSTRIAL: 'industrial' as const,
  OTHER: 'other' as const,
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  ADMIN: 'admin' as const,
  VIEWER: 'viewer' as const,
};

export const REGIONS = {
  NORTH: 'North' as const,
  CENTRAL: 'Central' as const,
  SOUTH: 'South' as const,
};

// Vietnamese labels
export const LABELS = {
  ASSET_TYPES: {
    [ASSET_TYPES.VEHICLE]: 'Phương tiện vận tải',
    [ASSET_TYPES.REAL_ESTATE]: 'Bất động sản',
  },
  VEHICLE_TYPES: {
    [VEHICLE_TYPES.CAR]: 'Ô tô',
    [VEHICLE_TYPES.TRUCK]: 'Xe tải',
    [VEHICLE_TYPES.MOTORCYCLE]: 'Xe máy',
    [VEHICLE_TYPES.OTHER]: 'Khác',
  },
  VEHICLE_TRANSMISSIONS: {
    [VEHICLE_TRANSMISSIONS.MANUAL]: 'Số sàn',
    [VEHICLE_TRANSMISSIONS.AUTOMATIC]: 'Số tự động',
    [VEHICLE_TRANSMISSIONS.SEMI_AUTOMATIC]: 'Số bán tự động',
  },
  REAL_ESTATE_TYPES: {
    [REAL_ESTATE_TYPES.HOUSE]: 'Nhà ở',
    [REAL_ESTATE_TYPES.APARTMENT]: 'Căn hộ',
    [REAL_ESTATE_TYPES.LAND]: 'Đất nền',
    [REAL_ESTATE_TYPES.COMMERCIAL]: 'Thương mại',
    [REAL_ESTATE_TYPES.INDUSTRIAL]: 'Công nghiệp',
    [REAL_ESTATE_TYPES.OTHER]: 'Khác',
  },
  REGIONS: {
    [REGIONS.NORTH]: 'Miền Bắc',
    [REGIONS.CENTRAL]: 'Miền Trung',
    [REGIONS.SOUTH]: 'Miền Nam',
  },
};

// Contact information for different regions
export const CONTACT_INFO = {
  [REGIONS.NORTH]: {
    region: REGIONS.NORTH,
    address: '108 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    phone: '1900 545 415',
    email: 'collateral.north@vpbank.com.vn',
    workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  },
  [REGIONS.CENTRAL]: {
    region: REGIONS.CENTRAL,
    address: '123 Lê Duẩn, Hải Châu, Đà Nẵng',
    phone: '1900 545 415',
    email: 'collateral.central@vpbank.com.vn',
    workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  },
  [REGIONS.SOUTH]: {
    region: REGIONS.SOUTH,
    address: '89 Đồng Khởi, Bến Nghé, Quận 1, TP.HCM',
    phone: '1900 545 415',
    email: 'collateral.south@vpbank.com.vn',
    workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  ASSETS: '/api/assets',
  VEHICLES: '/api/vehicles',
  REAL_ESTATE: '/api/real-estate',
  INQUIRIES: '/api/inquiries',
  AUTH: '/api/auth',
  ADMIN: '/api/admin',
  SYNC: '/api/sync',
  ANALYTICS: '/api/analytics',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Price formatting
export const CURRENCY = {
  SYMBOL: '₫',
  LOCALE: 'vi-VN',
  CURRENCY_CODE: 'VND',
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_ASSET: 10,
};

// Vietnamese provinces (simplified list)
export const VIETNAM_PROVINCES = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

// Popular car brands in Vietnam
export const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Mazda',
  'Hyundai',
  'Kia',
  'Ford',
  'Chevrolet',
  'Nissan',
  'Mitsubishi',
  'Suzuki',
  'Isuzu',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Acura',
  'Infiniti',
  'Subaru',
  'Peugeot',
];

// Current year range for vehicle filters
export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_VEHICLE_YEAR = 1990;
export const MAX_VEHICLE_YEAR = CURRENT_YEAR + 1;