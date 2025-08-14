TÀI LIỆU MÔ TẢ YÊU CẦU NGHIỆP VỤ
BUSINESS REQUIREMENTS DOCUMENT (BRD)
 
Mục lục / Table of contents 

I.	Tổng quan / Overview	…………………………………………………………………………………………………………………………...4
1.1.	Mục đích / Purposes	4
1.2.	Phạm vi của yêu cầu/ Scope of requirement	4
1.3.	Định nghĩa, viết tắt / Definitions and abbreviations	4
1.4.	Tham khảo / References	4
1.5.	Mô tả hiện trạng / Status description	4
II.	Yêu cầu phát triển / Requirements	………………………………………………………………………………………………………………4
III.	PHÂN LOẠI YÊU CẦU PHỤC VỤ CHO KHỐI CÔNG NGHỆ: / Requirement classification for IT division …………………………….5
IV.	PHÊ DUYỆT CỦA ĐƠN VỊ CÓ NHU CẦU / Approval of requesting units	…………………………………………………………………..6
V.	PHÊ DUYỆT CỦA CÁC ĐƠN VỊ CÓ LIÊN QUAN / Approval of related units	……………………………………………………………...6
VI.	Ý KIẾN CỦA KHỐI CÔNG NGHỆ / Comment of IT Division	………………………………………………………………………………...7

I.	Tổng quan / Overview
I.1.	Mục đích / Purposes
Xây dựng website thanh lý tài sản với domain thuộc VPBank.com.vn. Website này sẽ đăng bán các tài sản thế chấp cần xử lý của khối THN
I.2.	Phạm vi của yêu cầu/ Scope of requirement
-	Website VPBank.com.vn
-	Web QLTS 
I.3.	Định nghĩa, viết tắt / Definitions and abbreviations
I.4.	Tham khảo / References 	
I.5.	Mô tả hiện trạng / Status description 
-	VPBank đang sở hữu một danh mục tài sản cần xử lý, bao gồm bất động sản, phương tiện, máy móc thiết bị và các tài sản khác từ khách hàng có nợ xấu hoặc tài sản thanh lý. Để tối ưu hóa việc tiếp cận khách hàng tiềm năng, cần tăng cường quảng bá các tài sản này trên nhiều nền tảng, đặc biệt là nền tảng số
-	Hiện tại, việc quảng bá tài sản thanh lý đang chưa có nền tảng chính thức và thường là các giải pháp manual, adhoc. Việc này gây khó khăn cho việc quảng bá tài sản cũng như khó khăn cho khách hàng khi tìm kiếm thông tin
-	Nhu cầu xây dựng 1 website thanh lý tài sản, nơi tập trung toàn bộ các tài sản cần xử lý của Thu hồi nợ với giao diện thân thiện, dễ tra cứu, đồng thời cần thiết lập quy trình đồng bộ dữ liệu từ hệ thống QLTS lên Website để đảm bảo thông tin được cập nhật kịp thời và chính xác..
II.	Yêu cầu phát triển / Requirements
 
II.1.	Đối tượng áp dụng:
Tài sản bảo đảm cần xử lý từ kho tài sản bảo đảm của DCD (Web QLTS), bao gồm Bất động sản và PTVT
Khách hàng có nhu cầu truy cập website tìm kiếm và mua tài sản phát mãi 
Các bộ phận nghiệp vụ về quản lý, xử lý tài sản
II.2.	Luồng dữ liệu từ Web QLTS sang Website Thanh lý tài sản
II.2.1.	Danh mục:
-	Danh mục Bất động sản và Động sản ở trạng thái “Đang xử lý”
-	Danh mục dữ liệu cẩn đưa vào Web thanh lý tài sản bảo đảm (Các đầu mục dữ liệu được đánh dấu vàng và ảnh của TSBD)
o	Danh mục Phương tiện vận tải: 
 
o	Danh mục Bất động sản gồm
 
II.3.	Giao diện Website Thanh lý tài sản
II.3.1. Giao diện trang chủ 
-	Tham khảo link: https://www.vib.com.vn/vn/thanh-ly-tai-san-the-chap
-	Trang chủ gồm các Section chính: 
o	Ảnh banner
o	Section Phương tiện vận tải --> Dẫn tới sang trang Danh mục Phương tiện Vận tải
o	Section Bất động sản --> Dẫn tới sang trang Bất động sản
o	Đề mục thông tin liên hệ (Thông tin BĐS sẽ được bổ sung sau)
	Phương tiện vận tải
•	Miền Bắc
o	Em Quân – 0368.782.726
o	Em Lực – 0972.868.636
•	Miền Trung
o	Em Tùng – 0941.405.498
•	Miền Nam
o	Em Định – 0985.494.564

II.3.2. Giao diện trang Phương tiện vận tải: 
-	Tham khảo link: https://www.vib.com.vn/vn/thanh-ly-tai-san-the-chap/phuong-tien-van-tai
 
-	Trang gồm các chức năng chính sau: 
o	Bộ lọc tìm kiếm
	Loại xe
	Nhãn hiệu xe
	Năm sản xuất
	Loại hộp số
	Khoảng mức giá chào bán
o	Card hiển thị tài sản bảo đảm
	Tên Tài sản
	Giá chào bán
	Năm sản xuất
	Nhãn hiệu xe
	Loại xe
	Loại hộp số
o	Bộ lọc có thể được reset hoặc bỏ bộ lọc nhanh.
o	Khi khách hàng bấm vào card hiển thị của từng tài sản bảo đảm --> Dẫn ra trang chi tiết thông tin tài sản bảo đảm
II.3.3. Giao diện trang chi tiết Phương tiện vận tải
-	Tham khảo link: https://www.vib.com.vn/vn/vib-amc/thanh-ly-tai-san/phuong-tien-van-tai/ha-noi/ptvt-686232188518/ptvt-a02225555
 
-	Trang gồm các chức năng chính sau: 
o	Xem tài sản
	Ảnh
	Thông tin tài sản:
•	Tên tài sản
•	Loại tài sản
•	Năm Sản xuất
•	ODO
•	Nhãn hiệu xe
•	Loại hộp số
•	Giá chào bán
•	Thông tin liên hệ
•	Địa chỉ tài sản

o	Button Đăng kí để lại thông tin cá nhân - “Để lại thông tin”
	Họ và tên đầy đủ
	Số điện thoại
	Email (Optional)
o	Floating Section - “Quan tâm” - để Khách hàng sử dụng UI điện thoại có thể để lại thông tin nhanh ở mọi đoạn scroll – Khi khách hàng bấm vào sẽ hiện pop up để lại thông tin hoặc liên hệ cán bộ
 
II.3.4. Giao diện trang Bất động sản
-	Tham khảo link: https://www.vib.com.vn/vn/thanh-ly-tai-san-the-chap/bat-dong-san
 
-	Trang gồm các chức năng chính sau:
o	Bộ lọc tìm kiếm
	Phân loại tài sản
	Tỉnh
	Khoảng diện tích
	Khoảng giá bán
o	Card hiển thị tài sản bảo đảm
	Tên tài sản
	Diện tích
	Giá chào bán
	Tỉnh
	Phân loại tài sản
o	Bộ lọc có thể được reset hoặc bỏ bộ lọc nhanh
o	Khi khách hàng bấm vào card hiển thị của từng tài sản bảo đảm --> Dẫn ra trang chi tiết thông tin tài sản bảo đảm
II.3.5. Giao diện chi tiết Bất động sản: 
-	Tham khảo link: https://www.vib.com.vn/vn/vib-amc/thanh-ly-tai-san/bat-dong-san/ho-chi-minh/bds-33383/bds-33383
 
-	Trang gồm các chức năng chính sau: 
o	Xem tài sản - Hiển thị các thông tin sau
	Ảnh
	Thông tin tài sản:
•	Diện tích
•	Tỉnh thành phố
•	Loại tài sản
•	Thông tin nổi bật (Cán bộ tự điền)
•	Giá chào bán
•	Thông tin liên hệ (Thông tin liên hệ của cán bộ bán)
•	Địa chỉ tài sản
o	Button đăng kí để lại thông tin cá nhân - “Để lại thông tin”
	Họ và tên đầy đủ
	Số điện thoại
	Email (Optional)
	Floating Section - “Quan tâm” - để khách hàng sử dụng điện thoại có thể để lại thông tin nhanh ở mọi đoạn scroll – Khi khách hàng bấm vào sẽ hiện popup để lại thông tin hoặc liên hệ cán bộ
 
II.4.	Nhu cầu phát triển chức năng
II.4.1. Yêu cầu hạ tầng web
-	Có thể đăng tải 500 BĐS và 1000 PTVT
-	Đạt các yêu cầu về chất lượng trang web cho cả điện thoại và desktop
-	Tích hợp Google Analytics, các yêu cầu về bảo mật trang web.
II.4.2. Chức năng tải thông tin khách hàng
-	Tạo 1 trang có thể lưu trữ và xuất thông tin khách hàng đăng kí để lại
o	Gồm các trường sau:
	Thời gian để lại thông tin
	Tài sản bảo đảm quan tâm
	Họ và tên đầy đủ
	Số điện thoại
	Email
o	Dữ liệu có thể được tải bởi Admin.
II.4.3. Chức năng tải báo cáo Google Analytics.
-	Có thể được tải bởi admin.
II.5.	Ma trận phân quyền
-	Chỉ cần phân quyền cho Admin là người có thể tải thông tin khách hàng và báo cáo Google Analytics