import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/api/tanstack_API";
import { useEffect, useState } from "react";

export default function Background_Refetching() {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  // 🔁 Theo dõi trạng thái online/offline
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 30, // ⏳ Dữ liệu được xem là "fresh" trong 30s
    refetchOnWindowFocus: true, // 🔄 Tự động gọi lại khi tab quay lại
    refetchOnReconnect: true, // 🌐 Gọi lại khi có mạng trở lại
  });

  // Log khi data được refetch
  useEffect(() => {
    if (data) {
      console.log("✅ Refetched at", new Date().toLocaleTimeString());
    }
  }, [data]);

  return (
    <div
      className="p-6 bg-white dark:bg-gray-800 rounded shadow-lg dark:shadow-gray-900/20 max-w-xl
      mx-auto mt-10 space-y-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">👥 Danh sách người dùng</h2>

      {!online && (
        <div
          className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200 px-4 py-2 rounded border
          border-yellow-200 dark:border-yellow-800"
        >
          ⚠️ Bạn đang offline – dữ liệu không thể làm mới.
        </div>
      )}

      {isFetching && <p className="text-sm text-blue-500 dark:text-blue-400">🔄 Đang làm mới dữ liệu...</p>}

      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
        {data?.map((user: any) => (
          <li key={user.id}>
            <strong className="text-gray-900 dark:text-gray-100">{user.name}</strong> – {user.email}
          </li>
        ))}
      </ul>

      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 shadow-sm"
      >
        🔁 Làm mới thủ công
      </button>

      {/* 🧠 Hiển thị phần lý thuyết trực tiếp lên UI */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm leading-relaxed border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-gray-100">📘 Tính năng Background Refetching:</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            ⏳ <strong className="text-gray-900 dark:text-gray-100">staleTime</strong>: Dữ liệu được coi là "mới" trong 30 giây → không cần refetch
            lại.
          </li>
          <li>
            🔁 <strong className="text-gray-900 dark:text-gray-100">refetchOnWindowFocus</strong>: Tự động gọi lại API nếu bạn quay lại tab sau khi dữ
            liệu đã "stale".
          </li>
          <li>
            🌐 <strong className="text-gray-900 dark:text-gray-100">refetchOnReconnect</strong>: Nếu mất mạng và có mạng lại → gọi lại API.
          </li>
          <li>
            🧪 <strong className="text-gray-900 dark:text-gray-100">useEffect logging</strong>: Log thời gian mỗi lần data được refetch để debug.
          </li>
          <li>
            🎨 <strong className="text-gray-900 dark:text-gray-100">Dark mode</strong>: Giao diện tối dễ nhìn với contrast tốt cho mắt.
          </li>
          <li>
            ⚠️ Theo dõi trạng thái online với{" "}
            <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-gray-800 dark:text-gray-200">navigator.onLine</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
