import React from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiHome, FiTrendingUp, FiShield } from 'react-icons/fi';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-vpbank text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tài sản thế chấp VPBank
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white opacity-90 max-w-3xl mx-auto">
              Khám phá những cơ hội đầu tư hấp dẫn với bộ sưu tập tài sản thế chấp 
              đa dạng từ xe cộ đến bất động sản với giá cả cạnh tranh.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/vehicles" className="btn-secondary inline-block">
                Xem phương tiện
              </Link>
              <Link to="/real-estate" className="btn-outline-light inline-block">
                Xem bất động sản
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Danh mục tài sản</h2>
            <p className="section-subtitle">
              Chọn loại tài sản bạn quan tâm để khám phá các cơ hội đầu tư
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicles Card */}
            <Link to="/vehicles" className="card group">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-vpbank-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vpbank-primary group-hover:text-white transition-all duration-300">
                  <FiTruck className="w-8 h-8 text-vpbank-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-vpbank-primary mb-4 group-hover:text-vpbank-secondary">
                  Phương tiện vận tải
                </h3>
                <p className="text-vpbank-gray-600 mb-6">
                  Ô tô, xe máy, xe tải và các phương tiện khác với đa dạng thương hiệu và mức giá
                </p>
                <div className="text-vpbank-primary font-semibold group-hover:text-vpbank-secondary">
                  Khám phá ngay →
                </div>
              </div>
            </Link>

            {/* Real Estate Card */}
            <Link to="/real-estate" className="card group">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-vpbank-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vpbank-primary group-hover:text-white transition-all duration-300">
                  <FiHome className="w-8 h-8 text-vpbank-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-vpbank-primary mb-4 group-hover:text-vpbank-secondary">
                  Bất động sản
                </h3>
                <p className="text-vpbank-gray-600 mb-6">
                  Nhà ở, căn hộ, đất nền và bất động sản thương mại tại các vị trí đắc địa
                </p>
                <div className="text-vpbank-primary font-semibold group-hover:text-vpbank-secondary">
                  Khám phá ngay →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-vpbank-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Tại sao chọn VPBank?</h2>
            <p className="section-subtitle">
              Những lợi ích vượt trội khi đầu tư tài sản thế chấp cùng VPBank
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-vpbank-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Giá cả cạnh tranh</h3>
              <p className="text-vpbank-gray-600">
                Tài sản được định giá hợp lý, tạo cơ hội đầu tư sinh lời cao cho khách hàng
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-vpbank-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Pháp lý minh bạch</h3>
              <p className="text-vpbank-gray-600">
                Quy trình pháp lý rõ ràng, đảm bảo quyền lợi và an toàn cho người mua
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-vpbank-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Đa dạng lựa chọn</h3>
              <p className="text-vpbank-gray-600">
                Hàng nghìn tài sản đa dạng từ xe cộ đến bất động sản trên toàn quốc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-vpbank-primary mb-6">
            Bắt đầu hành trình đầu tư của bạn
          </h2>
          <p className="text-xl text-vpbank-gray-600 mb-8">
            Khám phá hàng nghìn tài sản thế chấp chất lượng với giá cả hợp lý. 
            Liên hệ với chúng tôi để được tư vấn chi tiết.
          </p>
          <Link to="/contact" className="btn-primary inline-block">
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;