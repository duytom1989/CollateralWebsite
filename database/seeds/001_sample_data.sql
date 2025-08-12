-- Sample data for VPBank Collateral Liquidation Database
-- This is for development/testing purposes only

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@vpbank.com.vn', '$2b$10$YourHashedPasswordHere', 'Administrator', 'super_admin');

-- Insert sample vehicle assets
INSERT INTO assets (asset_type, asset_code, name, description, price, status, qlts_id, featured) VALUES
('vehicle', 'VEH001', 'Toyota Camry 2020', 'Xe sedan cao cấp, bảo dưỡng định kỳ', 850000000, 'processing', 'QLTS-VEH-001', true),
('vehicle', 'VEH002', 'Honda CR-V 2019', 'SUV 7 chỗ, tiết kiệm nhiên liệu', 720000000, 'processing', 'QLTS-VEH-002', false),
('vehicle', 'VEH003', 'Mazda CX-5 2021', 'Crossover thể thao, trang bị đầy đủ', 780000000, 'processing', 'QLTS-VEH-003', true),
('vehicle', 'VEH004', 'Ford Ranger 2018', 'Bán tải mạnh mẽ, phù hợp địa hình', 650000000, 'processing', 'QLTS-VEH-004', false),
('vehicle', 'VEH005', 'Yamaha Exciter 150', 'Xe máy thể thao, tiết kiệm xăng', 35000000, 'processing', 'QLTS-VEH-005', false);

-- Get the IDs of inserted vehicles
WITH vehicle_ids AS (
    SELECT id, asset_code FROM assets WHERE asset_type = 'vehicle'
)
-- Insert vehicle details
INSERT INTO vehicles (id, brand, model, year, vehicle_type, transmission, fuel_type, mileage, engine_capacity, color, seats)
SELECT 
    id,
    CASE asset_code
        WHEN 'VEH001' THEN 'Toyota'
        WHEN 'VEH002' THEN 'Honda'
        WHEN 'VEH003' THEN 'Mazda'
        WHEN 'VEH004' THEN 'Ford'
        WHEN 'VEH005' THEN 'Yamaha'
    END as brand,
    CASE asset_code
        WHEN 'VEH001' THEN 'Camry 2.5Q'
        WHEN 'VEH002' THEN 'CR-V L'
        WHEN 'VEH003' THEN 'CX-5 Premium'
        WHEN 'VEH004' THEN 'Ranger Wildtrak'
        WHEN 'VEH005' THEN 'Exciter 150'
    END as model,
    CASE asset_code
        WHEN 'VEH001' THEN 2020
        WHEN 'VEH002' THEN 2019
        WHEN 'VEH003' THEN 2021
        WHEN 'VEH004' THEN 2018
        WHEN 'VEH005' THEN 2022
    END as year,
    CASE asset_code
        WHEN 'VEH005' THEN 'motorcycle'::vehicle_type
        WHEN 'VEH004' THEN 'truck'::vehicle_type
        ELSE 'car'::vehicle_type
    END as vehicle_type,
    CASE asset_code
        WHEN 'VEH005' THEN 'manual'::vehicle_transmission
        ELSE 'automatic'::vehicle_transmission
    END as transmission,
    CASE asset_code
        WHEN 'VEH005' THEN 'Xăng'
        WHEN 'VEH004' THEN 'Dầu'
        ELSE 'Xăng'
    END as fuel_type,
    CASE asset_code
        WHEN 'VEH001' THEN 45000
        WHEN 'VEH002' THEN 62000
        WHEN 'VEH003' THEN 28000
        WHEN 'VEH004' THEN 85000
        WHEN 'VEH005' THEN 12000
    END as mileage,
    CASE asset_code
        WHEN 'VEH001' THEN '2.5L'
        WHEN 'VEH002' THEN '1.5L Turbo'
        WHEN 'VEH003' THEN '2.0L'
        WHEN 'VEH004' THEN '2.0L Bi-Turbo'
        WHEN 'VEH005' THEN '150cc'
    END as engine_capacity,
    CASE asset_code
        WHEN 'VEH001' THEN 'Đen'
        WHEN 'VEH002' THEN 'Trắng'
        WHEN 'VEH003' THEN 'Đỏ'
        WHEN 'VEH004' THEN 'Xám'
        WHEN 'VEH005' THEN 'Đen-Đỏ'
    END as color,
    CASE asset_code
        WHEN 'VEH001' THEN 5
        WHEN 'VEH002' THEN 7
        WHEN 'VEH003' THEN 5
        WHEN 'VEH004' THEN 5
        WHEN 'VEH005' THEN 2
    END as seats
FROM vehicle_ids;

-- Insert sample real estate assets
INSERT INTO assets (asset_type, asset_code, name, description, price, status, qlts_id, featured) VALUES
('real_estate', 'RE001', 'Căn hộ cao cấp Vinhomes Central Park', 'Căn hộ 2PN view sông, nội thất đầy đủ', 4500000000, 'processing', 'QLTS-RE-001', true),
('real_estate', 'RE002', 'Nhà phố Quận 2', 'Nhà phố 3 tầng, khu dân cư an ninh', 6800000000, 'processing', 'QLTS-RE-002', false),
('real_estate', 'RE003', 'Đất nền Nhơn Trạch', 'Đất nền 100m2, sổ hồng riêng', 1200000000, 'processing', 'QLTS-RE-003', false),
('real_estate', 'RE004', 'Văn phòng Quận 1', 'Văn phòng 150m2, vị trí trung tâm', 8500000000, 'processing', 'QLTS-RE-004', true),
('real_estate', 'RE005', 'Căn hộ The Sun Avenue', 'Căn hộ 1PN + 1, tầng cao', 2800000000, 'processing', 'QLTS-RE-005', false);

-- Get the IDs of inserted real estate
WITH real_estate_ids AS (
    SELECT id, asset_code FROM assets WHERE asset_type = 'real_estate'
)
-- Insert real estate details
INSERT INTO real_estate (id, property_type, address, province, district, area_sqm, bedrooms, bathrooms)
SELECT 
    id,
    CASE asset_code
        WHEN 'RE001' THEN 'apartment'::real_estate_type
        WHEN 'RE002' THEN 'house'::real_estate_type
        WHEN 'RE003' THEN 'land'::real_estate_type
        WHEN 'RE004' THEN 'commercial'::real_estate_type
        WHEN 'RE005' THEN 'apartment'::real_estate_type
    END as property_type,
    CASE asset_code
        WHEN 'RE001' THEN '208 Nguyễn Hữu Cảnh, Bình Thạnh'
        WHEN 'RE002' THEN 'KDC An Phú, Thảo Điền, Quận 2'
        WHEN 'RE003' THEN 'Xã Phú Đông, Nhơn Trạch, Đồng Nai'
        WHEN 'RE004' THEN '45 Lê Duẩn, Bến Nghé, Quận 1'
        WHEN 'RE005' THEN '28 Mai Chí Thọ, An Phú, Quận 2'
    END as address,
    CASE asset_code
        WHEN 'RE003' THEN 'Đồng Nai'
        ELSE 'TP. Hồ Chí Minh'
    END as province,
    CASE asset_code
        WHEN 'RE001' THEN 'Bình Thạnh'
        WHEN 'RE002' THEN 'Quận 2'
        WHEN 'RE003' THEN 'Nhơn Trạch'
        WHEN 'RE004' THEN 'Quận 1'
        WHEN 'RE005' THEN 'Quận 2'
    END as district,
    CASE asset_code
        WHEN 'RE001' THEN 85
        WHEN 'RE002' THEN 120
        WHEN 'RE003' THEN 100
        WHEN 'RE004' THEN 150
        WHEN 'RE005' THEN 56
    END as area_sqm,
    CASE asset_code
        WHEN 'RE001' THEN 2
        WHEN 'RE002' THEN 3
        WHEN 'RE003' THEN 0
        WHEN 'RE004' THEN 0
        WHEN 'RE005' THEN 1
    END as bedrooms,
    CASE asset_code
        WHEN 'RE001' THEN 2
        WHEN 'RE002' THEN 3
        WHEN 'RE003' THEN 0
        WHEN 'RE004' THEN 2
        WHEN 'RE005' THEN 1
    END as bathrooms
FROM real_estate_ids;

-- Insert sample images for assets
INSERT INTO asset_images (asset_id, image_url, thumbnail_url, is_primary, display_order)
SELECT 
    id,
    'https://placeholder-images.vpbank.com/' || asset_code || '_main.jpg',
    'https://placeholder-images.vpbank.com/' || asset_code || '_thumb.jpg',
    true,
    0
FROM assets;

-- Insert additional images for featured assets
INSERT INTO asset_images (asset_id, image_url, thumbnail_url, is_primary, display_order)
SELECT 
    id,
    'https://placeholder-images.vpbank.com/' || asset_code || '_' || generate_series(2, 4) || '.jpg',
    'https://placeholder-images.vpbank.com/' || asset_code || '_' || generate_series(2, 4) || '_thumb.jpg',
    false,
    generate_series(2, 4)
FROM assets
WHERE featured = true;

-- Insert sample customer inquiries
INSERT INTO customer_inquiries (asset_id, customer_name, phone_number, email, message, region)
SELECT 
    (SELECT id FROM assets ORDER BY RANDOM() LIMIT 1),
    'Nguyễn Văn ' || chr(65 + (random() * 25)::int),
    '09' || (10000000 + random() * 89999999)::int::text,
    'customer' || generate_series || '@gmail.com',
    'Tôi quan tâm đến tài sản này. Vui lòng liên hệ với tôi.',
    CASE (random() * 2)::int
        WHEN 0 THEN 'North'
        WHEN 1 THEN 'Central'
        ELSE 'South'
    END
FROM generate_series(1, 10);