# VPBank Collateral Website - Architecture Document

## Executive Summary

This document outlines the technical architecture for VPBank's Collateral Liquidation Website, a platform designed to showcase and manage liquidated assets (real estate and vehicles) from the bank's asset management system (Web QLTS). The system enables customers to browse available collateral assets and express purchase interest while providing administrators with tools to manage customer inquiries.

## System Overview

### Business Context
VPBank requires a public-facing website to facilitate the liquidation of collateral assets including real estate properties and vehicles. The platform must handle:
- 500+ real estate listings
- 1000+ vehicle listings
- Customer inquiry management
- Integration with existing Web QLTS system
- Analytics and reporting capabilities

### Key Stakeholders
- **End Customers**: Browse and inquire about available assets
- **VPBank Administrators**: Manage inquiries and monitor analytics
- **Web QLTS System**: Source system for asset data
- **Regional Sales Teams**: Process customer inquiries by region

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   CloudFlare CDN  │
                    │   (Static Assets) │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │     Nginx        │
                    │   (Docker)       │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐           ┌──────────────┐
        │  React App   │           │  API Server  │
        │  (Docker)    │           │  (Node.js)   │
        │              │           │  (Docker)    │
        └──────────────┘           └──────────────┘
                                            │
                              ┌─────────────┴──────────┐
                              ▼                        ▼
                    ┌──────────────┐         ┌──────────────┐
                    │  PostgreSQL  │         │  Redis Cache │
                    │  (Docker)    │         │  (Docker)    │
                    └──────────────┘         └──────────────┘
                    
        ┌──────────────────────────┐
        │   External Systems        │
        ├──────────────────────────┤
        │  • Web QLTS (Data Sync)  │
        │  • Google Analytics      │
        │  • Email Service (SMTP)  │
        └──────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer

#### Technology Stack
- **Framework**: React 18.x with TypeScript
- **State Management**: React Context/useState hooks
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Styled Components + CSS Modules
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Build Tool**: Vite

#### Key Components

```
frontend/
├── src/
│   ├── components/
│   │   ├── UI/             # Reusable UI components (AssetCard, FilterPanel)
│   │   └── Layout/         # Page layouts (Header, Footer, Layout)
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Vehicles.tsx
│   │   ├── RealEstate.tsx
│   │   ├── AssetDetail.tsx
│   │   └── Contact.tsx
│   ├── config/
│   │   └── api.ts          # API configuration
│   ├── assets/             # Static assets (images, logos)
│   └── shared/
│       ├── types/          # TypeScript definitions
│       └── utils/          # Helper functions and constants
```

#### Design Principles
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Lazy loading for images and components
- SEO optimization with server-side rendering consideration
- Vietnamese language support with i18n

### 2. Backend Layer

#### Technology Stack
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js
- **API Documentation**: OpenAPI/Swagger
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi
- **ORM**: Prisma
- **Logging**: Winston
- **Process Manager**: PM2

#### API Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── AssetController.ts
│   │   ├── InquiryController.ts
│   │   ├── VehicleController.ts
│   │   └── RealEstateController.ts
│   ├── services/
│   │   ├── AssetService.ts
│   │   ├── InquiryService.ts
│   │   ├── VehicleService.ts
│   │   ├── RealEstateService.ts
│   │   └── DatabaseService.ts
│   ├── routes/
│   │   ├── assets.ts
│   │   ├── vehicles.ts
│   │   ├── realEstate.ts
│   │   ├── inquiries.ts
│   │   ├── auth.ts
│   │   ├── admin.ts
│   │   ├── sync.ts
│   │   └── analytics.ts
│   ├── middleware/
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── requestLogger.ts
│   │   └── analytics.ts
│   └── index.ts
```

#### API Endpoints

```
Public Endpoints:
GET    /api/v1/assets/vehicles        # List vehicles with filters
GET    /api/v1/assets/real-estate     # List real estate with filters
GET    /api/v1/assets/:id             # Get asset details
POST   /api/v1/inquiries              # Submit customer inquiry
GET    /api/v1/filters/options        # Get filter options

Admin Endpoints:
POST   /api/v1/auth/login             # Admin login
POST   /api/v1/auth/refresh           # Refresh token
GET    /api/v1/admin/inquiries        # List inquiries
GET    /api/v1/admin/inquiries/export # Export inquiries
GET    /api/v1/admin/analytics        # Analytics dashboard data
POST   /api/v1/admin/sync             # Trigger manual sync
```

### 3. Database Layer

#### PostgreSQL Schema

```sql
-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type VARCHAR(20) NOT NULL, -- 'vehicle' or 'real_estate'
    qlts_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Vehicle-specific attributes
CREATE TABLE vehicle_details (
    asset_id UUID PRIMARY KEY REFERENCES assets(id),
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    transmission VARCHAR(50),
    vehicle_type VARCHAR(100),
    mileage INTEGER,
    fuel_type VARCHAR(50),
    color VARCHAR(50)
);

-- Real estate-specific attributes
CREATE TABLE real_estate_details (
    asset_id UUID PRIMARY KEY REFERENCES assets(id),
    property_type VARCHAR(100),
    province VARCHAR(100),
    district VARCHAR(100),
    area_sqm DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    floors INTEGER
);

-- Asset images
CREATE TABLE asset_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    image_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER
);

-- Customer inquiries
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Redis Cache Strategy
- **Asset listings**: 5-minute TTL
- **Filter options**: 1-hour TTL
- **Asset details**: 10-minute TTL
- **Session storage**: 24-hour TTL

### 4. Integration Layer

#### Web QLTS Synchronization

```
Sync Architecture:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Web QLTS   │────▶│  Sync Queue  │────▶│   Database   │
│    System    │     │   (Redis)    │     │  (PostgreSQL)│
└──────────────┘     └──────────────┘     └──────────────┘
        │                    │                     │
        │                    ▼                     │
        │            ┌──────────────┐             │
        └───────────▶│  Sync Worker  │◀────────────┘
                     │   (Cron Job)  │
                     └──────────────┘
```

**Sync Process**:
1. Scheduled job runs every 30 minutes
2. Fetches assets with "In Processing" status from Web QLTS
3. Compares with local database
4. Updates changed assets, adds new ones
5. Removes assets no longer in "Processing" status
6. Logs sync operations for audit

#### Google Analytics Integration
- **Implementation**: Google Analytics 4 (GA4)
- **Events Tracked**:
  - Page views
  - Asset detail views
  - Filter usage
  - Inquiry submissions
  - Contact information clicks
- **Enhanced E-commerce**: Track asset interest funnel

## Security Architecture

### Authentication & Authorization
- **Admin Authentication**: JWT with refresh token rotation
- **Session Management**: Redis-backed sessions
- **Role-Based Access Control (RBAC)**: Admin-only features
- **API Rate Limiting**: 100 requests per minute per IP

### Data Protection
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS 1.3 for all connections
- **PII Handling**: Customer data encryption
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries via ORM

### Security Headers
```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security
```

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: 
  - WebP format with fallbacks
  - Responsive images with srcset
  - Lazy loading with Intersection Observer
- **Bundle Optimization**: Tree shaking and minification
- **Service Worker**: Offline capability and caching

### Backend Optimization
- **Database Indexing**: 
  - Composite indexes on filter columns
  - Full-text search indexes for asset names
- **Query Optimization**: N+1 query prevention
- **Connection Pooling**: PostgreSQL connection pool
- **Response Compression**: Gzip/Brotli compression

### Caching Strategy
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│     CDN     │────▶│    Redis    │
│    Cache    │     │    Cache    │     │    Cache    │
└─────────────┘     └─────────────┘     └─────────────┘
                                                │
                                         ┌─────────────┐
                                         │  Database   │
                                         └─────────────┘
```

## Deployment Architecture

### Infrastructure
- **Cloud Provider**: AWS/Azure (VPBank preference)
- **Container Orchestration**: Docker + Kubernetes
- **CI/CD**: GitLab CI/Jenkins
- **Monitoring**: Prometheus + Grafana
- **Log Aggregation**: ELK Stack

### Environment Configuration
```
Environments:
├── Development (dev.collateral.vpbank.com)
├── Staging (staging.collateral.vpbank.com)
└── Production (collateral.vpbank.com)
```

### Deployment Pipeline
1. **Build Stage**: Code compilation and testing
2. **Security Scan**: SAST/DAST scanning
3. **Container Build**: Docker image creation
4. **Registry Push**: Push to container registry
5. **Deploy to Staging**: Automated staging deployment
6. **Integration Tests**: API and E2E tests
7. **Production Deploy**: Manual approval required
8. **Health Checks**: Post-deployment validation

## Monitoring & Observability

### Application Monitoring
- **APM**: New Relic/Datadog integration
- **Error Tracking**: Sentry for error aggregation
- **Uptime Monitoring**: Pingdom/UptimeRobot
- **Performance Metrics**: Core Web Vitals tracking

### Business Metrics
- **Dashboard KPIs**:
  - Total assets listed
  - Daily active users
  - Inquiry conversion rate
  - Response time percentiles
  - Error rates

### Alerting Strategy
- **Critical Alerts**: 
  - Service downtime
  - Database connection failures
  - Sync job failures
- **Warning Alerts**:
  - High response times (>2s)
  - Memory usage >80%
  - Failed login attempts

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Daily automated backups with 30-day retention
- **Point-in-Time Recovery**: Transaction log backups every hour
- **Cross-Region Replication**: Real-time replication to DR site

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 1 hour

## Scalability Considerations

### Scaling Strategy
For the initial launch, the dockerized architecture supports:
- **Container-based Deployment**: All services run as separate Docker containers
- **Service Scaling**: Scale individual services (React app, API server) independently
- **Database Scaling**: PostgreSQL runs in Docker container, can be upgraded or moved to managed service
- **CDN Scaling**: CloudFlare handles static asset distribution
- **Future Horizontal Scaling**: Docker containers can be replicated across multiple instances

### Scaling Thresholds
- **Server**: Scale when CPU >80% for 10 minutes
- **Database**: Upgrade when storage >80% or connections >80% of max
- **Cache**: Add Redis when database query response time >500ms

## Future Enhancements

### Phase 2 Features
- Mobile native applications (iOS/Android)
- Advanced search with AI recommendations
- Virtual property tours (360° images/videos)
- Online bidding system
- WhatsApp/Zalo integration

### Technical Improvements
- GraphQL API layer
- Microservices architecture migration
- Event-driven architecture with Kafka
- Machine learning for price recommendations
- Blockchain integration for asset ownership

## Appendices

### A. Technology Version Matrix
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 20.x LTS | Latest LTS version |
| React | 18.x | With concurrent features |
| PostgreSQL | 15.x | Latest stable |
| Redis | 7.x | With persistence |
| Docker | 24.x | With BuildKit |
| Nginx | 1.24.x | As reverse proxy |

### B. External Dependencies
- Google Analytics 4
- CloudFlare CDN
- SendGrid/AWS SES (Email)
- VPBank SSO (if required)
- Web QLTS API endpoints

### C. Compliance Requirements
- GDPR compliance for customer data
- PCI DSS compliance (if payment integration added)
- Vietnamese data localization requirements
- Banking security standards compliance

---

*Document Version: 1.0*  
*Last Updated: 2025-08-12*  
*Author: Architecture Team*  
*Status: Draft*