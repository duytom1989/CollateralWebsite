import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Asset filter validation schema
const assetFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  assetType: Joi.string().valid('vehicle', 'real_estate').optional(),
  status: Joi.string().valid('processing', 'available', 'sold', 'reserved', 'cancelled').default('processing'),
  featured: Joi.boolean().optional(),
  search: Joi.string().min(2).max(100).optional(),
  
  // Vehicle filters
  vehicleType: Joi.array().items(Joi.string().valid('car', 'truck', 'motorcycle', 'other')).optional(),
  brand: Joi.array().items(Joi.string().max(50)).optional(),
  yearFrom: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
  yearTo: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
  transmission: Joi.array().items(Joi.string().valid('manual', 'automatic', 'semi_automatic')).optional(),
  priceFrom: Joi.number().min(0).optional(),
  priceTo: Joi.number().min(0).optional(),
  
  // Real estate filters
  propertyType: Joi.array().items(Joi.string().valid('house', 'apartment', 'land', 'commercial', 'industrial', 'other')).optional(),
  province: Joi.array().items(Joi.string().max(100)).optional(),
  areaFrom: Joi.number().min(0).optional(),
  areaTo: Joi.number().min(0).optional(),
});

// Customer inquiry validation schema
const inquirySchema = Joi.object({
  assetId: Joi.string().uuid().required(),
  customerName: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string().pattern(/^(0[1-9])+([0-9]{8,9})$/).required(),
  email: Joi.string().email().optional(),
  message: Joi.string().max(1000).optional(),
  region: Joi.string().valid('North', 'Central', 'South').optional(),
});

// Admin login validation schema
const adminLoginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
});

// Generic validation middleware
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query.constructor === Object && Object.keys(req.query).length ? req.query : req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => {
        const { path, type, context } = detail;
        const field = path[0];
        
        // Provide more user-friendly error messages
        if (field === 'phoneNumber' && type === 'string.pattern.base') {
          return 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 số, bắt đầu bằng 0)';
        }
        if (field === 'email' && type === 'string.email') {
          return 'Email không hợp lệ. Vui lòng nhập đúng định dạng email';
        }
        if (field === 'customerName' && type === 'string.empty') {
          return 'Vui lòng nhập họ và tên';
        }
        if (field === 'message' && type === 'string.empty') {
          return 'Vui lòng nhập nội dung tin nhắn';
        }
        
        return detail.message;
      }).join(', ');
      
      console.error('Validation error details:', error.details);
      console.error('Request body:', req.body);
      res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errorMessage,
      });
      return;
    }

    // Normalize filter arrays - convert single values to arrays for consistency
    if (req.method === 'GET' && value) {
      const arrayFields = ['vehicleType', 'brand', 'transmission', 'propertyType', 'province'];
      arrayFields.forEach(field => {
        if (value[field] && !Array.isArray(value[field])) {
          value[field] = [value[field]];
        }
      });
    }

    // Replace request data with validated and sanitized data
    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

// Vehicle filter validation schema
const vehicleFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  status: Joi.string().valid('processing', 'available', 'sold', 'reserved', 'cancelled').default('processing'),
  featured: Joi.boolean().optional(),
  search: Joi.string().min(2).max(100).optional(),
  vehicleType: Joi.alternatives().try(
    Joi.string().valid('car', 'truck', 'motorcycle', 'other'),
    Joi.array().items(Joi.string().valid('car', 'truck', 'motorcycle', 'other'))
  ).optional(),
  brand: Joi.alternatives().try(
    Joi.string().max(50),
    Joi.array().items(Joi.string().max(50))
  ).optional(),
  yearFrom: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
  yearTo: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).optional(),
  transmission: Joi.alternatives().try(
    Joi.string().valid('manual', 'automatic', 'semi_automatic'),
    Joi.array().items(Joi.string().valid('manual', 'automatic', 'semi_automatic'))
  ).optional(),
  priceFrom: Joi.number().min(0).optional(),
  priceTo: Joi.number().min(0).optional(),
});

// Real estate filter validation schema
const realEstateFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  status: Joi.string().valid('processing', 'available', 'sold', 'reserved', 'cancelled').default('processing'),
  featured: Joi.boolean().optional(),
  search: Joi.string().min(2).max(100).optional(),
  propertyType: Joi.alternatives().try(
    Joi.string().valid('house', 'apartment', 'land', 'commercial', 'industrial', 'other'),
    Joi.array().items(Joi.string().valid('house', 'apartment', 'land', 'commercial', 'industrial', 'other'))
  ).optional(),
  province: Joi.alternatives().try(
    Joi.string().max(100),
    Joi.array().items(Joi.string().max(100))
  ).optional(),
  areaFrom: Joi.number().min(0).optional(),
  areaTo: Joi.number().min(0).optional(),
  priceFrom: Joi.number().min(0).optional(),
  priceTo: Joi.number().min(0).optional(),
});

// Contact form validation schema
const contactFormSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^(0[1-9])+([0-9]{8,9})$/).required(),
  email: Joi.string().email().optional(),
  region: Joi.string().valid('North', 'Central', 'South').optional(),
  subject: Joi.string().max(200).optional(),
  message: Joi.string().min(10).max(1000).required(),
});

// Specific validation middleware exports
export const validateAssetFilters = validate(assetFilterSchema);
export const validateVehicleFilters = validate(vehicleFilterSchema);
export const validateRealEstateFilters = validate(realEstateFilterSchema);
export const validateInquiry = validate(inquirySchema);
export const validateContactForm = validate(contactFormSchema);
export const validateAdminLogin = validate(adminLoginSchema);

// Additional validation helpers
export const validateUUID = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }
  
  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Basic XSS protection - remove script tags and potentially dangerous characters
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};