import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// 🧪 Fake API with pagination
const fetchUsers = async ({ pageParam = 1 }) => {
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const all = await res.json();
  const pageSize = 3;
  const start = (pageParam - 1) * pageSize;
  const paginated = all.slice(start, start + pageSize);
  const hasNext = start + pageSize < all.length;

  return {
    users: paginated,
    nextPage: hasNext ? pageParam + 1 : undefined,
  };
};

export default function AdvancedQueryCacheDemo() {
  const [group, setGroup] = useState("groupA");
  const [show, setShow] = useState(true);
  const [cacheCountdown, setCacheCountdown] = useState<number | null>(null);
  const [unmountTime, setUnmountTime] = useState<number | null>(null);

  const cacheTime = 1000 * 20; // 20s
  const staleTime = 1000 * 30; // 30s

  const queryClient = useQueryClient();

  // Đồng hồ đếm ngược cacheTime
  useEffect(() => {
    let interval: any;
    if (!show && unmountTime) {
      interval = setInterval(() => {
        const timePassed = Date.now() - unmountTime;
        const remaining = Math.max(0, Math.floor((cacheTime - timePassed) / 1000));
        setCacheCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setCacheCountdown(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [show, unmountTime]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:text-[#333] shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🚀 Advanced Query: Cache + Infinite Scroll</h2>

      <div className="space-x-4 mb-4">
        <button
          onClick={() => {
            setShow((s) => {
              if (s) setUnmountTime(Date.now());
              return !s;
            });
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {show ? "👻 Ẩn danh sách" : "👀 Hiện lại"}
        </button>

        <button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["users", group] });
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🔁 Invalidate "{group}"
        </button>

        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="groupA">📁 Nhóm A</option>
          <option value="groupB">📁 Nhóm B</option>
        </select>
      </div>

      {cacheCountdown !== null && (
        <div className="mb-4 text-yellow-700">
          ⏱️ Cache sẽ bị xoá sau: <strong>{cacheCountdown}s</strong>
        </div>
      )}

      {show && <UserList group={group} cacheTime={cacheTime} staleTime={staleTime} />}

      <TheoryBox />
    </div>
  );
}

function UserList({
  group,
  cacheTime,
  staleTime,
}: {
  group: string;
  cacheTime: number;
  staleTime: number;
}) {
  const { ref, inView } = useInView();

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["users", group],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime,
    cacheTime,
  });

  // 👀 Trigger fetch next page khi ref hiển thị
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="border p-4 rounded bg-gray-50">
      {status === "loading" && <p>🔄 Đang tải dữ liệu...</p>}
      {status === "error" && <p>❌ Lỗi tải dữ liệu</p>}
      <ul className="list-disc ml-5">
        {data?.pages.map((page, i) =>
          page.users.map((user: any) => (
            <li key={user.id}>
              <strong>{user.name}</strong> – {user.email}
            </li>
          ))
        )}
      </ul>

      <div ref={ref} className="h-10" />

      {isFetchingNextPage && <p className="text-sm text-blue-500">🔄 Đang tải thêm...</p>}
      {!hasNextPage && <p className="text-sm text-gray-500">✅ Hết dữ liệu</p>}
    </div>
  );
}

function TheoryBox() {
  return (
    <div className="mt-8 p-4 bg-yellow-50 rounded text-sm">
      <h3 className="font-semibold text-base mb-2">📘 Lý thuyết mở rộng:</h3>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          ⏳ <strong>staleTime</strong>: Dữ liệu được coi là “fresh” trong thời gian này → không tự động gọi lại.
        </li>
        <li>
          🧠 <strong>cacheTime</strong>: Giữ dữ liệu trong bộ nhớ cache sau khi component unmount → có thể dùng lại.
        </li>
        <li>
          ⏱️ **Đồng hồ đếm cache**: Khi unmount, bắt đầu đếm ngược → hiển thị thời gian còn lại trước khi cache bị xoá.
        </li>
        <li>
          📁 **QueryKey động**: `["users", group]` → cache tách biệt cho từng group người dùng.
        </li>
        <li>
          📡 **Infinite scroll**: Dùng `IntersectionObserver` để tự fetch thêm khi cuộn tới cuối.
        </li>
      </ul>
    </div>
  );
}