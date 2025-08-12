import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiMapPin, FiCalendar, FiSettings } from 'react-icons/fi';
import { Asset, Vehicle, RealEstate } from '@shared/types';
import { 
  formatPriceShort, 
  formatArea, 
  formatMileage, 
  getAssetPrimaryImage,
  getRelativeTime 
} from '@shared/utils/helpers';

interface AssetCardProps {
  asset: Asset | Vehicle | RealEstate;
  featured?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, featured = false }) => {
  const primaryImage = getAssetPrimaryImage(asset.images);
  const assetUrl = asset.assetType === 'vehicle' 
    ? `/asset/vehicles/${asset.id}` 
    : `/asset/real-estate/${asset.id}`;

  const renderVehicleDetails = (vehicle: Vehicle) => (
    <div className="space-y-1 text-sm text-vpbank-gray-600">
      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-1">
          <FiCalendar className="w-3 h-3" />
          <span>{vehicle.vehicleDetails.year}</span>
        </span>
        <span className="flex items-center space-x-1">
          <FiSettings className="w-3 h-3" />
          <span>{vehicle.vehicleDetails.transmission === 'manual' ? 'Số sàn' : 'Số tự động'}</span>
        </span>
      </div>
      {vehicle.vehicleDetails.mileage && (
        <div>{formatMileage(vehicle.vehicleDetails.mileage)}</div>
      )}
    </div>
  );

  const renderRealEstateDetails = (realEstate: RealEstate) => (
    <div className="space-y-1 text-sm text-vpbank-gray-600">
      <div className="flex items-center space-x-1">
        <FiMapPin className="w-3 h-3" />
        <span>{realEstate.realEstateDetails.province}</span>
      </div>
      {realEstate.realEstateDetails.areaSqm && (
        <div>Diện tích: {formatArea(realEstate.realEstateDetails.areaSqm)}</div>
      )}
      {realEstate.realEstateDetails.bedrooms && (
        <div>{realEstate.realEstateDetails.bedrooms} phòng ngủ</div>
      )}
    </div>
  );

  return (
    <div className={`${featured ? 'card-featured' : 'card'} overflow-hidden group`}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={primaryImage}
          alt={asset.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary">Nổi bật</span>
          </div>
        )}
        
        {/* Views Count */}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md flex items-center space-x-1 text-xs">
          <FiEye className="w-3 h-3" />
          <span>{asset.viewsCount}</span>
        </div>
        
        {/* Asset Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="badge badge-secondary">
            {asset.assetType === 'vehicle' ? 'Xe cộ' : 'Bất động sản'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-vpbank-gray-900 mb-2 line-clamp-2 group-hover:text-vpbank-primary transition-colors duration-200">
          <Link to={assetUrl} className="hover:underline">
            {asset.name}
          </Link>
        </h3>

        {/* Description */}
        {asset.description && (
          <p className="text-vpbank-gray-600 text-sm mb-3 line-clamp-2">
            {asset.description}
          </p>
        )}

        {/* Asset-specific details */}
        <div className="mb-4">
          {asset.assetType === 'vehicle' 
            ? renderVehicleDetails(asset as Vehicle)
            : renderRealEstateDetails(asset as RealEstate)
          }
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="price-display">
            {formatPriceShort(asset.price)}
          </div>
          <Link
            to={assetUrl}
            className="btn-primary text-sm py-2 px-4"
          >
            Xem chi tiết
          </Link>
        </div>

        {/* Meta info */}
        <div className="mt-3 pt-3 border-t border-vpbank-gray-100">
          <div className="flex items-center justify-between text-xs text-vpbank-gray-500">
            <span>Mã: {asset.assetCode}</span>
            <span>{getRelativeTime(asset.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;