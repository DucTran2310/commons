import notFoundImage from "@/assets/commons/404.jpg";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      {/* Ảnh hiển thị */}
      <div className="w-full max-w-xs md:max-w-md mb-6">
        <img src={notFoundImage} alt="Not Found" className="w-full rounded-lg shadow-lg" />
      </div>

      {/* Thông báo */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Oops! Trang không tìm thấy</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">Có vẻ như trang bạn đang tìm kiếm không tồn tại.</p>

      {/* Nút quay lại */}
      <Link
        to="/"
        className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 hover:from-blue-600 hover:to-blue-700"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
