import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { CONTACT_INFO, REGIONS, LABELS } from '@shared/utils/constants';

const Contact: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    region: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setContactForm({
          name: '',
          phone: '',
          email: '',
          region: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-vpbank-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSend className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-vpbank-primary mb-4">
              Cảm ơn bạn đã liên hệ!
            </h1>
            <p className="text-vpbank-gray-600 mb-8">
              Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất. 
              Đối với những yêu cầu cần hỗ trợ gấp, vui lòng gọi trực tiếp hotline 1900 545 415.
            </p>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="btn-primary"
            >
              Gửi tin nhắn khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vpbank-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-vpbank-primary mb-6">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-vpbank-gray-600 max-w-3xl mx-auto">
            Bạn có thắc mắc về tài sản thế chấp hoặc cần tư vấn? 
            Hãy liên hệ với chúng tôi qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-vpbank-primary mb-6">Gửi tin nhắn cho chúng tôi</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                      Khu vực
                    </label>
                    <select
                      name="region"
                      value={contactForm.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                    >
                      <option value="">Chọn khu vực</option>
                      {Object.entries(LABELS.REGIONS).map(([key, label]) => (
                        <option key={key} value={key}>{label as string}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Tư vấn về xe Toyota Camry 2020"
                    className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-vpbank-gray-700 mb-2">
                    Tin nhắn *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Mô tả chi tiết về yêu cầu hoặc thắc mắc của bạn..."
                    className="w-full px-4 py-2 border border-vpbank-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vpbank-primary focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Liên hệ nhanh</h3>
              <div className="space-y-4">
                <a href="tel:1900545415" className="flex items-center gap-3 text-vpbank-gray-600 hover:text-vpbank-primary">
                  <FiPhone className="w-5 h-5" />
                  <div>
                    <div className="font-medium">1900 545 415</div>
                    <div className="text-sm">Hotline 24/7</div>
                  </div>
                </a>
                
                <a href="mailto:collateral@vpbank.com.vn" className="flex items-center gap-3 text-vpbank-gray-600 hover:text-vpbank-primary">
                  <FiMail className="w-5 h-5" />
                  <div>
                    <div className="font-medium">collateral@vpbank.com.vn</div>
                    <div className="text-sm">Email hỗ trợ</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-vpbank-gray-600">
                  <FiClock className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Thứ 2 - Thứ 6</div>
                    <div className="text-sm">8:00 - 17:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Offices */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-vpbank-primary mb-4">Văn phòng khu vực</h3>
              <div className="space-y-6">
                {Object.entries(CONTACT_INFO).map(([region, info]) => (
                  <div key={region} className="border-b border-vpbank-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-vpbank-primary mb-2">
                      {LABELS.REGIONS[region as keyof typeof LABELS.REGIONS]}
                    </h4>
                    <div className="space-y-2 text-sm text-vpbank-gray-600">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{info.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        <span>{info.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4" />
                        <span>{info.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;