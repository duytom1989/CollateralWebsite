import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiMapPin, FiCalendar, FiDollarSign, FiTruck, FiHome } from 'react-icons/fi';
import { Vehicle, RealEstate } from '@shared/types';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { CURRENCY, LABELS } from '@shared/utils/constants';

const AssetDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [asset, setAsset] = useState<Vehicle | RealEstate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (id && type) {
      fetchAssetDetail(type, id);
      trackView(type, id);
    }
  }, [id, type]);

  const fetchAssetDetail = async (assetType: string, assetId: string) => {
    try {
      setLoading(true);
      const endpoint = assetType === 'vehicles' 
        ? API_CONFIG.ENDPOINTS.VEHICLE_BY_ID(assetId)
        : API_CONFIG.ENDPOINTS.REAL_ESTATE_BY_ID(assetId);
      const url = buildApiUrl(endpoint);
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAsset(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch asset');
      }
    } catch (error) {
      console.error('Error fetching asset detail:', error);
      setAsset(null);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (assetType: string, assetId: string) => {
    try {
      const endpoint = assetType === 'vehicles' 
        ? API_CONFIG.ENDPOINTS.VEHICLE_VIEW(assetId)
        : `/real-estate/${assetId}/view`;
      const url = buildApiUrl(endpoint);
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't show error to user, just log it
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.INQUIRIES);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetId: id,
          customerName: contactForm.name,
          phoneNumber: contactForm.phone,
          email: contactForm.email,
          message: contactForm.message
        }),
      });

      if (response.ok) {
        alert('Cảm ơn bạn đã quan tâm! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        setShowContactForm(false);
        setContactForm({ name: '', phone: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.errors || errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat(CURRENCY.LOCALE, {
      style: 'currency',
      currency: CURRENCY.CURRENCY_CODE,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} m²`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vpbank-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vpbank-primary"></div>
            <p className="mt-4 text-vpbank-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-vpbank-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl text-vpbank-gray-500 mb-4">Không tìm thấy tài sản</p>
            <Link to={type === 'vehicles' ? '/vehicles' : '/real-estate'} className="btn-primary">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVehicle = type === 'vehicles';
  const vehicle = isVehicle ? asset as Vehicle : null;
  const realEstate = !isVehicle ? asset as RealEstate : null;

  return (
    <div className="min-h-screen bg-vpbank-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to={type === 'vehicles' ? '/vehicles' : '/real-estate'} 
          className="inline-flex items-center gap-2 text-vpbank-primary hover:text-vpbank-secondary mb-6"
        >
          <FiArrowLeft />
          Quay lại danh sách {isVehicle ? 'phương tiện' : 'bất động sản'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="aspect-video bg-vpbank-gray-200 flex items-center justify-center">
                {isVehicle ? (
                  <FiTruck className="w-16 h-16 text-vpbank-gray-400" />
                ) : (
                  <FiHome className="w-16 h-16 text-vpbank-gray-400" />
                )}
              </div>
            </div>

            {/* Asset Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-vpbank-primary mb-2">{asset.name}</h1>
                  <div className="flex items-center gap-2 text-vpbank-gray-600">
                    <FiMapPin className="w-4 h-4" />
                    <span>
                      {isVehicle ? 'Việt Nam' : (realEstate?.realEstateDetails?.province || 'N/A')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-vpbank-primary">
                    {asset.price ? formatPrice(asset.price) : 'Liên hệ'}
                  </div>
                  <div className="text-vpbank-gray-600">Giá bán</div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-vpbank-primary mb-4">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    {isVehicle && vehicle && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Loại xe:</span>
                          <span className="font-medium">
                            {vehicle.vehicleDetails?.vehicleType ? 
                              LABELS.VEHICLE_TYPES[vehicle.vehicleDetails.vehicleType as keyof typeof LABELS.VEHICLE_TYPES] || vehicle.vehicleDetails.vehicleType 
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Thương hiệu:</span>
                          <span className="font-medium">{vehicle.vehicleDetails?.brand || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Năm sản xuất:</span>
                          <span className="font-medium">{vehicle.vehicleDetails?.year || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Hộp số:</span>
                          <span className="font-medium">
                            {vehicle.vehicleDetails?.transmission ? 
                              LABELS.VEHICLE_TRANSMISSIONS[vehicle.vehicleDetails.transmission as keyof typeof LABELS.VEHICLE_TRANSMISSIONS] || vehicle.vehicleDetails.transmission
                              : 'N/A'}
                          </span>
                        </div>
                        {vehicle.vehicleDetails?.mileage && (
                          <div className="flex justify-between">
                            <span className="text-vpbank-gray-600">Số km đã đi:</span>
                            <span className="font-medium">{vehicle.vehicleDetails.mileage.toLocaleString()} km</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {!isVehicle && realEstate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Loại BDS:</span>
                          <span className="font-medium">
                            {realEstate.realEstateDetails?.propertyType ? 
                              LABELS.REAL_ESTATE_TYPES[realEstate.realEstateDetails.propertyType as keyof typeof LABELS.REAL_ESTATE_TYPES] || realEstate.realEstateDetails.propertyType
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Diện tích:</span>
                          <span className="font-medium">
                            {realEstate.realEstateDetails?.areaSqm ? formatArea(realEstate.realEstateDetails.areaSqm) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-vpbank-gray-600">Tỉnh/Thành:</span>
                          <span className="font-medium">{realEstate.realEstateDetails?.province || 'N/A'}</span>
                        </div>
                        {realEstate.realEstateDetails?.district && (
                          <div className="flex justify-between">
                            <span className="text-vpbank-gray-600">Quận/Huyện:</span>
                            <span className="font-medium">{realEstate.realEstateDetails.district}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-vpbank-primary mb-4">Mô tả</h3>
                  <p className="text-vpbank-gray-600 leading-relaxed">
                    {asset.description || 'Chưa có thông tin mô tả chi tiết.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-8">
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Quan tâm tài sản này?</h3>
              <p className="text-vpbank-gray-600 mb-6">
                Liên hệ với chúng tôi để được tư vấn chi tiết và hỗ trợ thủ tục.
              </p>

              {!showContactForm ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="btn-primary w-full"
                  >
                    Gửi yêu cầu tư vấn
                  </button>
                  <a href="tel:1900545415" className="btn-outline-primary w-full text-center block">
                    <FiPhone className="inline w-4 h-4 mr-2" />
                    1900 545 415
                  </a>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Họ và tên *"
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Số điện thoại *"
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tin nhắn (tùy chọn)"
                      rows={3}
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1">
                      Gửi yêu cầu
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowContactForm(false)}
                      className="btn-outline-secondary px-4"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-vpbank-primary mb-4">Thông tin hỗ trợ</h3>
              <div className="space-y-3 text-sm text-vpbank-gray-600">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  <span>Email: collateral@vpbank.com.vn</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  <span>Hỗ trợ vay vốn lên đến 80% giá trị tài sản</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;