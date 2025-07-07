import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsersPage } from "@/mock/fakeUserAPI";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function InfiniteScrollUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["users-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsersPage({ pageParam, pageSize: 10 }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const { ref, inView } = useInView();
  const [ready, setReady] = useState(false);

  // Chờ load xong trang đầu tiên mới enable scroll fetch
  useEffect(() => {
    if (!isFetchingNextPage && data?.pages.length > 0 && !ready) {
      setReady(true);
    }
  }, [data?.pages.length, isFetchingNextPage]);

  // Debounce 300ms khi scroll đến đáy
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ready && inView && hasNextPage) {
        fetchNextPage();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inView, hasNextPage, ready]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🔄 Infinite Scroll – 100 users</h2>

      {isLoading && <p>⏳ Đang tải dữ liệu...</p>}
      {isError && <p>❌ Lỗi tải dữ liệu</p>}

      <ul className="list-disc ml-5 space-y-2 max-h-[300px] overflow-auto pr-2">
        <AnimatePresence initial={false}>
          {data?.pages.flatMap((page) =>
            page.data.map((user) => (
              <motion.li
                key={user.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <strong>{user.name}</strong> – {user.email}
              </motion.li>
            ))
          )}
        </AnimatePresence>

        {/* 👇 Scroll trigger nằm cuối danh sách */}
        <div ref={ref} className="h-10" />
      </ul>

      {isFetchingNextPage && (
        <div className="flex justify-center mt-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!hasNextPage && (
        <p className="text-gray-500 mt-2 text-center">✅ Đã tải hết 100 người dùng!</p>
      )}

      <TheoryBox />
    </div>
  );
}

function TheoryBox() {
  return (
    <div className="mt-6 p-4 bg-yellow-50 rounded text-sm">
      <h3 className="font-semibold mb-2">📘 Lý thuyết:</h3>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          🔄 <strong>useInfiniteQuery</strong>: Dữ liệu dạng phân trang.
        </li>
        <li>
          👀 <strong>IntersectionObserver</strong>: Theo dõi scroll đến đáy.
        </li>
        <li>
          🧠 <strong>Debounce</strong>: Tránh gọi API liên tục gây cà giật.
        </li>
        <li>
          🎬 <strong>Framer Motion</strong>: Mượt mà khi thêm dòng mới.
        </li>
        <li>
          🧪 <strong>Mock 100 users</strong>: Kiểm thử hiệu quả scroll dài.
        </li>
      </ul>
    </div>
  );
}