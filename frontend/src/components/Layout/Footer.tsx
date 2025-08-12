import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { CONTACT_INFO, REGIONS } from '@shared/utils/constants';
import vpbankLogoDark from '../../assets/LOGO_VPBank_Âm bản.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-vpbank text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src={vpbankLogoDark} 
                alt="VPBank Logo" 
                className="h-12 w-auto"
              />
              <div className="ml-3">
                <div className="text-white text-sm">Tài sản thế chấp</div>
              </div>
            </div>
            <p className="text-white opacity-90 mb-6 max-w-md">
              VPBank cung cấp dịch vụ thanh lý tài sản thế chấp với quy trình minh bạch, 
              giá cả hợp lý và dịch vụ chuyên nghiệp. Chúng tôi cam kết mang đến những 
              cơ hội đầu tư tốt nhất cho khách hàng.
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <FiPhone className="w-4 h-4" />
              <span className="text-white opacity-90">Hotline: 1900 545 415</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiMail className="w-4 h-4" />
              <span className="text-white opacity-90">Email: collateral@vpbank.com.vn</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-vpbank-light hover:text-white transition-colors duration-200"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link 
                  to="/vehicles" 
                  className="text-vpbank-light hover:text-white transition-colors duration-200"
                >
                  Phương tiện vận tải
                </Link>
              </li>
              <li>
                <Link 
                  to="/real-estate" 
                  className="text-vpbank-light hover:text-white transition-colors duration-200"
                >
                  Bất động sản
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-vpbank-light hover:text-white transition-colors duration-200"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Offices */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Văn phòng khu vực</h3>
            <div className="space-y-4">
              {Object.values(CONTACT_INFO).map((office) => (
                <div key={office.region} className="text-sm">
                  <div className="font-medium text-white mb-1">
                    {office.region === REGIONS.NORTH && 'Miền Bắc'}
                    {office.region === REGIONS.CENTRAL && 'Miền Trung'}
                    {office.region === REGIONS.SOUTH && 'Miền Nam'}
                  </div>
                  <div className="flex items-start space-x-2 text-vpbank-light">
                    <FiMapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{office.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="border-t border-vpbank-secondary mt-8 pt-6">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
            <FiClock className="w-4 h-4" />
            <span className="text-vpbank-light">
              Thời gian làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-vpbank-secondary mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-vpbank-light text-sm mb-4 md:mb-0">
              © {currentYear} Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank). 
              Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                className="text-vpbank-light hover:text-white transition-colors duration-200"
              >
                Điều khoản sử dụng
              </a>
              <a 
                href="#" 
                className="text-vpbank-light hover:text-white transition-colors duration-200"
              >
                Chính sách bảo mật
              </a>
              <a 
                href="#" 
                className="text-vpbank-light hover:text-white transition-colors duration-200"
              >
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;