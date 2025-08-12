/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Base API URL configuration
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }
  
  // In production, use environment variable or default to current domain
  return import.meta.env.VITE_API_URL || window.location.origin;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    // Vehicle endpoints
    VEHICLES: '/vehicles',
    VEHICLES_FEATURED: '/vehicles/featured',
    VEHICLES_BRANDS: '/vehicles/brands',
    VEHICLES_STATS: '/vehicles/stats',
    VEHICLE_BY_ID: (id: string) => `/vehicles/${id}`,
    VEHICLE_VIEW: (id: string) => `/vehicles/${id}/view`,
    
    // Real estate endpoints
    REAL_ESTATE: '/real-estate',
    REAL_ESTATE_FEATURED: '/real-estate/featured',
    REAL_ESTATE_STATS: '/real-estate/stats',
    REAL_ESTATE_BY_ID: (id: string) => `/real-estate/${id}`,
    
    // Asset endpoints
    ASSETS: '/assets',
    ASSETS_FEATURED: '/assets/featured',
    ASSETS_SEARCH: '/assets/search',
    ASSETS_STATS: '/assets/stats',
    ASSET_BY_ID: (id: string) => `/assets/${id}`,
    
    // Inquiry endpoints
    INQUIRIES: '/inquiries',
    INQUIRY_BY_ID: (id: string) => `/inquiries/${id}`,
    
    // Auth endpoints
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_VERIFY: '/auth/verify',
    
    // Admin endpoints
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_ANALYTICS: '/admin/analytics',
    
    // Analytics endpoints
    ANALYTICS_TRACK: '/analytics/track',
    ANALYTICS_REPORT: '/analytics/report',
    
    // Health check
    HEALTH: '/health'
  },
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 12
  },
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000   // 30 seconds
  }
} as const;

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build URL with query parameters
export const buildUrlWithParams = (endpoint: string, params: Record<string, any>): string => {
  const url = buildApiUrl(endpoint);
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export default API_CONFIG;