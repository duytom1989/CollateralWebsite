# VPBank Collateral Website

A modern web platform for showcasing and managing VPBank's liquidated collateral assets (real estate and vehicles).

## 🏗️ Architecture Overview

- **Frontend**: React 18 with TypeScript, Vite, Material-UI
- **Backend**: Node.js/Express API with PostgreSQL
- **Infrastructure**: AWS ECS Fargate, RDS, S3, CloudFront
- **Development**: Docker Compose for local environment

## 🚀 Quick Start (Development)

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd CollateralWebsite
```

### 2. Start Development Environment
```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker compose -f docker-compose.yml up -d

# View logs (optional)
docker compose logs -f
```

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 4. Database Setup
The PostgreSQL database runs automatically with Docker Compose:
- **Host**: localhost:5432
- **Database**: vpbank_collateral
- **Username**: vpbank_user
- **Password**: vpbank_password

## 📁 Project Structure

```
CollateralWebsite/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── shared/         # Types, utilities
│   └── package.json
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── package.json
├── docs/                   # Architecture and documentation
│   ├── architecture.md    # Technical architecture
│   └── aws-sizing-plan.md # AWS infrastructure plan
├── docker-compose.yml     # Development environment
└── CLAUDE.md             # Project context for Claude Code
```

## 🔧 Development Commands

### Docker Operations
```bash
# Start development environment
docker compose up -d

# Stop all services
docker compose down

# Rebuild containers (after code changes)
docker compose up -d --build

# View service logs
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

### Manual Development (without Docker)
```bash
# Backend
cd backend
npm install
npm run dev     # Starts on :3001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev     # Starts on :3000
```

## 🛠️ API Endpoints

### Public Endpoints
- `GET /api/assets/vehicles` - List vehicles with filters
- `GET /api/assets/real-estate` - List real estate with filters  
- `GET /api/assets/:id` - Get asset details
- `POST /api/inquiries` - Submit customer inquiry
- `GET /api/filters/options` - Get filter options

### Management Endpoints
- `GET /api/inquiries/export` - Export customer inquiries
- `POST /api/sync` - Manual data sync with Web QLTS

### Health Check
- `GET /health` - Service health status

## 🔄 Data Synchronization

The system receives asset data from VPBank's Web QLTS system via push-based API calls:

1. Web QLTS calls `/api/sync` when asset status changes
2. API validates and processes the data
3. Assets are created/updated/deleted in PostgreSQL
4. Real-time updates without polling delays

## 🎨 Frontend Features

- **Mobile-first responsive design**
- **Asset browsing** with advanced filters
- **Vehicle filters**: Type, brand, year, transmission, price
- **Real estate filters**: Type, province, area, price
- **Asset detail pages** with image galleries
- **Customer inquiry forms**
- **Vietnamese language support**

## 🔧 Environment Configuration

### Development (.env files not needed with Docker)
All configuration is handled via docker-compose.yml environment variables.

### Production Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3001
FRONTEND_URL=https://collateral.vpbank.com
```

## 📊 Business Requirements

### Asset Categories
1. **Vehicles (Phương tiện vận tải)**
   - 1000+ listings expected
   - Display: Name, price, year, brand, type, transmission
   
2. **Real Estate (Bất động sản)**  
   - 500+ listings expected
   - Display: Name, area, price, province, type

### Performance Targets
- List pages: ≤ 2.5 seconds load time
- Detail pages: ≤ 2 seconds load time  
- Basic search: ≤ 1 second response
- Advanced filters: ≤ 3 seconds response
- Uptime: ≥ 99.7% annually

## 🚀 Deployment

### AWS Infrastructure
- **Frontend**: ECS Fargate (2-4 tasks)
- **Backend**: ECS Fargate (2-4 tasks)  
- **Database**: RDS PostgreSQL (db.t3.medium, Multi-AZ)
- **Storage**: S3 bucket for asset images
- **CDN**: CloudFront for global content delivery
- **Load Balancer**: Application Load Balancer

### Estimated Monthly Cost
- **Production**: $590-740 USD
- **Development**: $50 USD

## 🔍 Monitoring

### Health Checks
```bash
# Check all services
curl http://localhost:3001/health

# Database connectivity test
docker compose exec postgres psql -U vpbank_user -d vpbank_collateral -c "SELECT 1"
```

### Logs
```bash
# View all logs
docker compose logs -f

# Backend API logs
docker compose logs -f backend

# Frontend logs  
docker compose logs -f frontend
```

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes and test locally with Docker Compose
3. Ensure all services start successfully
4. Create pull request with description of changes

## 📚 Documentation

- [Architecture Document](docs/architecture.md) - Technical architecture details
- [AWS Sizing Plan](docs/aws-sizing-plan.md) - Infrastructure specifications
- [CLAUDE.md](CLAUDE.md) - Project context for AI development

## 🆘 Troubleshooting

### Common Issues

**Container won't start:**
```bash
docker compose down
docker compose up -d --build
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres
```

**Port conflicts:**
```bash
# Stop existing services on ports 3000, 3001, 5432
docker compose down
```

**Module not found errors:**
```bash
# Rebuild containers to install dependencies
docker compose up -d --build
```

---

**Last Updated**: 2025-08-14  
**Version**: 1.0.0  
**Environment**: Development Ready
