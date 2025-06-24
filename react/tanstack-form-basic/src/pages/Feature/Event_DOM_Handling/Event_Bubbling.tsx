import React, { useState } from "react";
import { XCircle, PlusCircle } from "lucide-react";
import { useToastQueue } from "@/hooks/useToastQueue";

type Product = {
  id: number;
  name: string;
};

const products: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
}));

const Event_Bubbling: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { queue, addToast } = useToastQueue(2000);

  const handleAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToast(`Đã thêm ${product.name} vào giỏ hàng 🛒`);
  };

  const handleContainerClick = () => {
    console.log("Clicked container");
  };

  const handleProductClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    console.log("Click product: ", product);
    setSelectedProduct(product);
  };

  const closeModal = () => setSelectedProduct(null);

  return (
    <div
      className="p-6 bg-gray-100 min-h-screen"
      onClick={handleContainerClick}
    >
      <h2 className="text-xl font-bold mb-4">🛍️ Danh sách sản phẩm</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={(e) => handleProductClick(e, product)}
            className="bg-white p-4 rounded shadow hover:bg-blue-50 cursor-pointer relative group"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">ID: {product.id}</p>

            {/* Nút Thêm */}
            <button
              onClick={(e) => handleAddClick(e, product)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-blue-100"
            >
              <PlusCircle className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded shadow-lg max-w-sm w-full relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-2">
              Thông tin sản phẩm
            </h2>
            <p className="text-gray-600 mb-2">{selectedProduct.name}</p>
            <p className="text-sm text-gray-400">ID: {selectedProduct.id}</p>
          </div>
        </div>
      )}

      {/* Toast Queue */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {queue.map((toast) => (
          <div
            key={toast.id}
            className="bg-green-500 text-white px-4 py-2 rounded shadow animate-fade-in-out"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Lý thuyết học bên dưới */}
      <div className="mt-10 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-bold mb-2">📚 Lý thuyết</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>
            <strong>Event Bubbling:</strong> Khi click vào phần tử con, sự kiện nổi lên cha (truyền lên DOM tree).
          </li>
          <li>
            <strong>e.stopPropagation():</strong> Dùng để ngăn không cho sự kiện nổi lên.
          </li>
          <li>
            <strong>Toast Queue:</strong> Có thể dùng <code>setTimeout</code> hoặc thư viện như <code>react-hot-toast</code>.
          </li>
          <li>
            <strong>Modal:</strong> Layer popup nên có <code>z-index</code> cao và xử lý <code>e.stopPropagation()</code> nếu click nền để đóng.
          </li>
          <li>
            <strong>UX nhỏ:</strong> Gợi ý animation nhỏ (bounce/fade), dùng Tailwind utility như <code>animate-bounce</code>, <code>transition-all</code>.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Event_Bubbling;