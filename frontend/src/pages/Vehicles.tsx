import React, { useState, useEffect } from 'react';
import AssetCard from '../components/UI/AssetCard';
import FilterPanel from '../components/UI/FilterPanel';
import { Vehicle, VehicleFilters } from '@shared/types';
import { API_CONFIG, buildUrlWithParams } from '../config/api';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [filters, currentPage]);

  const fetchVehicles = async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = {
        page: page.toString(),
        limit: API_CONFIG.DEFAULT_PAGINATION.LIMIT.toString(),
        ...filters
      };

      const url = buildUrlWithParams(API_CONFIG.ENDPOINTS.VEHICLES, queryParams);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (append) {
          setVehicles(prev => [...prev, ...data.data]);
        } else {
          setVehicles(data.data);
        }
        setTotalCount(data.total || 0);
        setHasMore(data.hasMore || false);
      } else {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error instanceof Error ? error.message : 'Failed to load vehicles');
      if (!append) {
        setVehicles([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchVehicles(nextPage, true);
    }
  };

  const retryFetch = () => {
    fetchVehicles(1, false);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };


  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-vpbank-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vpbank-primary"></div>
            <p className="mt-4 text-vpbank-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vpbank-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vpbank-primary mb-4">Phương tiện vận tải</h1>
          <p className="text-vpbank-gray-600">
            Khám phá bộ sưu tập phương tiện vận tải đa dạng với giá cả hợp lý
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              assetType="vehicle"
              filters={filters}
              onFiltersChange={handleFilterChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-800 font-medium">Có lỗi xảy ra khi tải dữ liệu</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                  <button 
                    onClick={retryFetch}
                    className="text-red-600 hover:text-red-800 font-medium text-sm underline"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-vpbank-gray-600">
                Hiển thị {vehicles.length} trong tổng số {totalCount} phương tiện
              </p>
            </div>

            {/* Vehicle Grid */}
            {!error && vehicles.length === 0 && !loading ? (
              <div className="text-center py-20">
                <p className="text-xl text-vpbank-gray-500 mb-4">Không tìm thấy phương tiện nào</p>
                <p className="text-vpbank-gray-400">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-vpbank-primary hover:text-vpbank-secondary font-medium underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                  <AssetCard
                    key={vehicle.id}
                    asset={vehicle}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && vehicles.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tải...
                    </>
                  ) : (
                    'Xem thêm'
                  )}
                </button>
              </div>
            )}

            {/* Loading More Indicator */}
            {loading && vehicles.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-vpbank-primary"></div>
                <p className="mt-2 text-vpbank-gray-600 text-sm">Đang tải thêm...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;