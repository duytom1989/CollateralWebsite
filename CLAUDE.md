# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a collateral liquidation website for VPBank to showcase and manage assets (real estate and vehicles) from their asset management system (Web QLTS). The website allows customers to browse, filter, and express interest in available collateral assets.

## Project Architecture

### Planned Technology Stack
- **Frontend**: React.js with responsive mobile-first design
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL for asset data storage
- **Integration**: Data synchronization with Web QLTS system
- **Analytics**: Google Analytics integration
- **Infrastructure**: Cloud platform deployment with VPBank domain

### Core Components

1. **Public Website**
   - Homepage with asset categories (vehicles and real estate)
   - Vehicle listing page with filters (type, brand, year, transmission, price)
   - Real estate listing page with filters (type, province, area, price)
   - Asset detail pages with images and specifications
   - Customer contact forms for expressing interest

2. **Admin Panel**
   - Customer inquiry management and export
   - Google Analytics report access
   - Role-based access control (Admin only)

3. **Data Integration**
   - Automated synchronization with Web QLTS system
   - Support for 500+ real estate and 1000+ vehicle listings
   - Asset status management ("In Processing" status)

## Development Commands

Since the project is in planning phase, no build/test commands are configured yet. When implementing:

### Recommended Setup Commands
```bash
# For React frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install

# For Node.js backend
mkdir backend && cd backend
npm init -y
npm install express cors dotenv pg

# Database setup
createdb vpbank_collateral
```

## Key Business Requirements

### Asset Categories
1. **Vehicles (Phương tiện vận tải)**
   - Display: Name, price, year, brand, type, transmission
   - Filters: Type, brand, year, transmission, price range

2. **Real Estate (Bất động sản)**
   - Display: Name, area, price, province, type
   - Filters: Type, province, area range, price range

### Contact Management
- Store customer inquiries with timestamp, asset ID, name, phone, email
- Export functionality for admin users
- Regional contact information for different zones (North, Central, South)

## Data Flow
1. Assets are managed in Web QLTS system
2. Assets in "Processing" status sync to the website
3. Customers browse and submit interest forms
4. Admin exports customer data for follow-up

## Important Considerations
- Mobile-first responsive design is critical
- All text content supports Vietnamese language
- Security requirements for customer data handling
- Performance requirements for large asset catalogs
- SEO optimization for asset listings