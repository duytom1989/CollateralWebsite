import React, { useState } from 'react';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { VehicleFilters, RealEstateFilters } from '@shared/types';
import { VEHICLE_TYPES, REAL_ESTATE_TYPES, VEHICLE_TRANSMISSIONS, VIETNAM_PROVINCES, CAR_BRANDS, MIN_VEHICLE_YEAR, MAX_VEHICLE_YEAR } from '@shared/utils/constants';

interface FilterPanelProps {
  assetType: 'vehicle' | 'real_estate';
  filters: VehicleFilters | RealEstateFilters;
  onFiltersChange: (filters: VehicleFilters | RealEstateFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  assetType,
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const clearAllFilters = () => {
    if (assetType === 'vehicle') {
      onFiltersChange({});
    } else {
      onFiltersChange({});
    }
    setSearchInput('');
  };

  const handleSearchSubmit = () => {
    onFiltersChange({
      ...filters,
      search: searchInput.trim() || undefined,
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const renderVehicleFilters = (vehicleFilters: VehicleFilters) => (
    <div className="space-y-6">
      {/* Vehicle Type */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Loại xe
        </label>
        <div className="space-y-2">
          {Object.entries(VEHICLE_TYPES).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={vehicleFilters.vehicleType?.includes(value) || false}
                onChange={(e) => {
                  const currentTypes = vehicleFilters.vehicleType || [];
                  const newTypes = e.target.checked
                    ? [...currentTypes, value]
                    : currentTypes.filter(t => t !== value);
                  onFiltersChange({
                    ...vehicleFilters,
                    vehicleType: newTypes.length > 0 ? newTypes : undefined,
                  });
                }}
                className="rounded border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
              />
              <span className="ml-2 text-sm text-vpbank-gray-700">
                {key === 'CAR' && 'Ô tô'}
                {key === 'TRUCK' && 'Xe tải'}
                {key === 'MOTORCYCLE' && 'Xe máy'}
                {key === 'OTHER' && 'Khác'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Hãng xe
        </label>
        <select
          multiple
          value={vehicleFilters.brand || []}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            onFiltersChange({
              ...vehicleFilters,
              brand: values.length > 0 ? values : undefined,
            });
          }}
          className="input-field h-32"
        >
          {CAR_BRANDS.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Năm sản xuất
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={vehicleFilters.yearFrom || ''}
            onChange={(e) => onFiltersChange({
              ...vehicleFilters,
              yearFrom: e.target.value ? parseInt(e.target.value) : undefined,
            })}
            className="input-field"
          >
            <option value="">Từ năm</option>
            {Array.from({ length: MAX_VEHICLE_YEAR - MIN_VEHICLE_YEAR + 1 }, (_, i) => MAX_VEHICLE_YEAR - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={vehicleFilters.yearTo || ''}
            onChange={(e) => onFiltersChange({
              ...vehicleFilters,
              yearTo: e.target.value ? parseInt(e.target.value) : undefined,
            })}
            className="input-field"
          >
            <option value="">Đến năm</option>
            {Array.from({ length: MAX_VEHICLE_YEAR - MIN_VEHICLE_YEAR + 1 }, (_, i) => MAX_VEHICLE_YEAR - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Hộp số
        </label>
        <div className="space-y-2">
          {Object.entries(VEHICLE_TRANSMISSIONS).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={vehicleFilters.transmission?.includes(value) || false}
                onChange={(e) => {
                  const currentTransmissions = vehicleFilters.transmission || [];
                  const newTransmissions = e.target.checked
                    ? [...currentTransmissions, value]
                    : currentTransmissions.filter(t => t !== value);
                  onFiltersChange({
                    ...vehicleFilters,
                    transmission: newTransmissions.length > 0 ? newTransmissions : undefined,
                  });
                }}
                className="rounded border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
              />
              <span className="ml-2 text-sm text-vpbank-gray-700">
                {key === 'MANUAL' && 'Số sàn'}
                {key === 'AUTOMATIC' && 'Số tự động'}
                {key === 'SEMI_AUTOMATIC' && 'Số bán tự động'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Khoảng giá
        </label>
        <div className="space-y-2">
          {[
            { label: 'Tất cả', min: undefined, max: undefined },
            { label: 'Dưới 300 triệu', min: 0, max: 300000000 },
            { label: '300 - 500 triệu', min: 300000000, max: 500000000 },
            { label: '500 triệu - 1 tỷ', min: 500000000, max: 1000000000 },
            { label: '1 tỷ - 3 tỷ', min: 1000000000, max: 3000000000 },
            { label: 'Trên 3 tỷ', min: 3000000000, max: undefined },
          ].map((range, index) => {
            const isSelected = vehicleFilters.priceFrom === range.min && vehicleFilters.priceTo === range.max;
            return (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => onFiltersChange({
                    ...vehicleFilters,
                    priceFrom: range.min,
                    priceTo: range.max,
                  })}
                  className="rounded-full border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
                />
                <span className="ml-2 text-sm text-vpbank-gray-700">{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRealEstateFilters = (realEstateFilters: RealEstateFilters) => (
    <div className="space-y-6">
      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Loại bất động sản
        </label>
        <div className="space-y-2">
          {Object.entries(REAL_ESTATE_TYPES).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={realEstateFilters.propertyType?.includes(value) || false}
                onChange={(e) => {
                  const currentTypes = realEstateFilters.propertyType || [];
                  const newTypes = e.target.checked
                    ? [...currentTypes, value]
                    : currentTypes.filter(t => t !== value);
                  onFiltersChange({
                    ...realEstateFilters,
                    propertyType: newTypes.length > 0 ? newTypes : undefined,
                  });
                }}
                className="rounded border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
              />
              <span className="ml-2 text-sm text-vpbank-gray-700">
                {key === 'HOUSE' && 'Nhà ở'}
                {key === 'APARTMENT' && 'Căn hộ'}
                {key === 'LAND' && 'Đất nền'}
                {key === 'COMMERCIAL' && 'Thương mại'}
                {key === 'INDUSTRIAL' && 'Công nghiệp'}
                {key === 'OTHER' && 'Khác'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Tỉnh/Thành phố
        </label>
        <select
          multiple
          value={realEstateFilters.province || []}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            onFiltersChange({
              ...realEstateFilters,
              province: values.length > 0 ? values : undefined,
            });
          }}
          className="input-field h-32"
        >
          {VIETNAM_PROVINCES.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>

      {/* Area Range */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Diện tích (m²)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ m²"
            value={realEstateFilters.areaFrom || ''}
            onChange={(e) => onFiltersChange({
              ...realEstateFilters,
              areaFrom: e.target.value ? parseInt(e.target.value) : undefined,
            })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Đến m²"
            value={realEstateFilters.areaTo || ''}
            onChange={(e) => onFiltersChange({
              ...realEstateFilters,
              areaTo: e.target.value ? parseInt(e.target.value) : undefined,
            })}
            className="input-field"
          />
        </div>
      </div>


      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
          Mức giá
        </label>
        <div className="space-y-2">
          {[
            { label: 'Dưới 1 tỷ', from: 0, to: 1000000000 },
            { label: '1 tỷ - 3 tỷ', from: 1000000000, to: 3000000000 },
            { label: '3 tỷ - 5 tỷ', from: 3000000000, to: 5000000000 },
            { label: '5 tỷ - 7 tỷ', from: 5000000000, to: 7000000000 },
            { label: '7 tỷ - 10 tỷ', from: 7000000000, to: 10000000000 },
            { label: 'Trên 10 tỷ', from: 10000000000, to: undefined },
          ].map((range) => {
            const isSelected = realEstateFilters.priceFrom === range.from && 
                             (range.to === undefined ? !realEstateFilters.priceTo : realEstateFilters.priceTo === range.to);
            return (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => {
                    onFiltersChange({
                      ...realEstateFilters,
                      priceFrom: range.from,
                      priceTo: range.to,
                    });
                  }}
                  className="rounded-full border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
                />
                <span className="ml-2 text-sm text-vpbank-gray-700">{range.label}</span>
              </label>
            );
          })}
          {/* Option to clear price filter */}
          <label className="flex items-center">
            <input
              type="radio"
              name="priceRange"
              checked={!realEstateFilters.priceFrom && !realEstateFilters.priceTo}
              onChange={() => {
                onFiltersChange({
                  ...realEstateFilters,
                  priceFrom: undefined,
                  priceTo: undefined,
                });
              }}
              className="rounded-full border-vpbank-gray-300 text-vpbank-primary focus:ring-vpbank-primary"
            />
            <span className="ml-2 text-sm text-vpbank-gray-700">Tất cả mức giá</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <FiFilter className="w-4 h-4" />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-vpbank-gray-900">Bộ lọc</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-vpbank-primary hover:text-vpbank-secondary"
              >
                Xóa tất cả
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden text-vpbank-gray-500 hover:text-vpbank-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="input-field flex-1"
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-vpbank-primary text-white px-4 py-2 rounded hover:bg-vpbank-secondary transition-colors flex items-center justify-center"
                title="Tìm kiếm"
              >
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
            {filters.search && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-vpbank-light text-vpbank-primary">
                  Tìm kiếm: "{filters.search}"
                  <button
                    onClick={() => {
                      setSearchInput('');
                      onFiltersChange({
                        ...filters,
                        search: undefined,
                      });
                    }}
                    className="ml-1 hover:text-vpbank-secondary"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Asset-specific filters */}
          {assetType === 'vehicle' 
            ? renderVehicleFilters(filters as VehicleFilters)
            : renderRealEstateFilters(filters as RealEstateFilters)
          }
        </div>
      </div>
    </>
  );
};

export default FilterPanel;