-- VPBank Collateral Liquidation Database Schema
-- Version: 1.0.0
-- Date: 2025

-- Create database (run this separately if needed)
-- CREATE DATABASE vpbank_collateral;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Asset status enum
CREATE TYPE asset_status AS ENUM ('processing', 'available', 'sold', 'reserved', 'cancelled');

-- Asset type enum
CREATE TYPE asset_type AS ENUM ('vehicle', 'real_estate');

-- Vehicle type enum
CREATE TYPE vehicle_type AS ENUM ('car', 'truck', 'motorcycle', 'other');

-- Vehicle transmission enum
CREATE TYPE vehicle_transmission AS ENUM ('manual', 'automatic', 'semi_automatic');

-- Real estate type enum
CREATE TYPE real_estate_type AS ENUM ('house', 'apartment', 'land', 'commercial', 'industrial', 'other');

-- Admin role enum
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'viewer');

-- Main assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type asset_type NOT NULL,
    asset_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2),
    status asset_status DEFAULT 'processing',
    qlts_id VARCHAR(100) UNIQUE, -- ID from Web QLTS system
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP
);

-- Vehicles table (extends assets)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    vehicle_type vehicle_type,
    transmission vehicle_transmission,
    fuel_type VARCHAR(50),
    mileage INTEGER,
    engine_capacity VARCHAR(50),
    color VARCHAR(50),
    license_plate VARCHAR(20),
    seats INTEGER,
    doors INTEGER,
    origin VARCHAR(100),
    condition VARCHAR(100)
);

-- Real estate table (extends assets)
CREATE TABLE real_estate (
    id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    property_type real_estate_type,
    address TEXT,
    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    area_sqm DECIMAL(10, 2),
    land_area_sqm DECIMAL(10, 2),
    floors INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    direction VARCHAR(50),
    legal_status VARCHAR(100),
    certificate_number VARCHAR(100),
    land_use_purpose VARCHAR(100),
    land_use_period VARCHAR(100)
);

-- Asset images table
CREATE TABLE asset_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer inquiries table
CREATE TABLE customer_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    message TEXT,
    region VARCHAR(50), -- North, Central, South
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, processing, completed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role admin_role DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync logs table for tracking data synchronization
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'manual'
    status VARCHAR(50) NOT NULL, -- 'started', 'completed', 'failed'
    total_records INTEGER DEFAULT 0,
    synced_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'asset_view', 'inquiry_submit', 'filter_apply'
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    referrer TEXT,
    page_url TEXT,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_price ON assets(price);
CREATE INDEX idx_assets_created_at ON assets(created_at);
CREATE INDEX idx_assets_qlts_id ON assets(qlts_id);

CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);

CREATE INDEX idx_real_estate_province ON real_estate(province);
CREATE INDEX idx_real_estate_type ON real_estate(property_type);
CREATE INDEX idx_real_estate_area ON real_estate(area_sqm);

CREATE INDEX idx_inquiries_asset_id ON customer_inquiries(asset_id);
CREATE INDEX idx_inquiries_created_at ON customer_inquiries(created_at);
CREATE INDEX idx_inquiries_status ON customer_inquiries(status);

CREATE INDEX idx_images_asset_id ON asset_images(asset_id);
CREATE INDEX idx_analytics_asset_id ON analytics_events(asset_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON customer_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();