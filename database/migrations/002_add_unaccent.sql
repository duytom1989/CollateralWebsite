-- Enable unaccent extension for Vietnamese diacritic-insensitive search
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create a custom function for Vietnamese text normalization
CREATE OR REPLACE FUNCTION normalize_vietnamese(text_input text)
RETURNS text AS $$
BEGIN
    -- Convert to lowercase and remove accents
    RETURN lower(unaccent(text_input));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create indexes for fuzzy search on assets table
CREATE INDEX IF NOT EXISTS idx_assets_name_normalized 
ON assets (normalize_vietnamese(name));

CREATE INDEX IF NOT EXISTS idx_assets_description_normalized 
ON assets (normalize_vietnamese(description));

-- Create indexes for vehicle-specific fields
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_normalized 
ON vehicles (normalize_vietnamese(brand));

CREATE INDEX IF NOT EXISTS idx_vehicles_model_normalized 
ON vehicles (normalize_vietnamese(model));

-- Create indexes for real estate fields  
CREATE INDEX IF NOT EXISTS idx_real_estate_address_normalized
ON real_estate (normalize_vietnamese(address));

CREATE INDEX IF NOT EXISTS idx_real_estate_province_normalized
ON real_estate (normalize_vietnamese(province));

CREATE INDEX IF NOT EXISTS idx_real_estate_district_normalized
ON real_estate (normalize_vietnamese(district));

CREATE INDEX IF NOT EXISTS idx_real_estate_ward_normalized
ON real_estate (normalize_vietnamese(ward));