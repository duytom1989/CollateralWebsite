import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiMail } from 'react-icons/fi';
import vpbankLogo from '../../assets/LOGO_VPBank_Nguyên bản.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Phương tiện vận tải', href: '/vehicles' },
    { name: 'Bất động sản', href: '/real-estate' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-vpbank sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-vpbank text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>Hotline: 1900 545 415</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>Email: collateral@vpbank.com.vn</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Thời gian làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={vpbankLogo} 
                alt="VPBank Logo" 
                className="h-10 w-auto"
              />
              <div className="ml-3">
                <div className="text-vpbank-gray-600 text-xs">Tài sản thế chấp</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href) ? 'nav-link-active' : 'nav-link'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-vpbank-gray-600 hover:text-vpbank-primary hover:bg-vpbank-gray-100 focus:outline-none focus:ring-2 focus:ring-vpbank-primary"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-vpbank-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-vpbank-light text-vpbank-primary'
                    : 'text-vpbank-gray-700 hover:text-vpbank-primary hover:bg-vpbank-gray-50'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;