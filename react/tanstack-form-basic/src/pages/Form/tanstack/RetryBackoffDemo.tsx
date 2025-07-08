import { fetchRandomData } from "@/mock/fakeUserAPI";
import { Skeleton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RetryBackoffDemo() {
  const queryClient = useQueryClient();
  const [retrySeed, setRetrySeed] = useState(0); // force refetch

  const { data, error, isError, isLoading, isFetching, failureCount, refetch } = useQuery({
    queryKey: ["random", retrySeed],
    queryFn: fetchRandomData,

    // ✅ Retry logic nâng cao
    retry: (failureCount, error: any) => {
      const errMsg = error?.message || "";
      console.log(`🔁 Retry ${failureCount}: ${errMsg}`);

      // ❌ Không retry lỗi xác thực
      if (errMsg.includes("AuthError")) {
        return false;
      }

      // ✅ Retry tối đa 5 lần cho các lỗi khác
      return failureCount < 5;
    },

    // ✅ Delay retry theo Exponential Backoff + random jitter
    retryDelay: (attempt) => {
      const base = 1000 * Math.pow(2, attempt); // 1s → 2s → 4s → ...
      const jitter = Math.random() * 1000; // thêm 0–1s ngẫu nhiên
      const totalDelay = base + jitter;
      console.log(`⏱️ Delay lần ${attempt}: ${Math.round(totalDelay)}ms`);
      return totalDelay;
    },

    onError: (err: any) => {
      toast.error(`❌ ${err.message}`);
    },

    onSuccess: () => {
      toast.success("✅ Thành công!");
    },
  });

  const resetQuery = () => {
    queryClient.removeQueries({ queryKey: ["random"] });
    setRetrySeed(Math.random()); // force refetch
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">💣 Retry + Backoff + Jitter</h2>

      {isLoading || isFetching ? (
        <div>
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : isError ? (
        <p className="text-red-500">❌ {error?.message}</p>
      ) : (
        <p className="text-green-600 font-semibold">{data?.message}</p>
      )}

      <p className="text-sm mt-4 text-gray-500">🔁 Retry count: {failureCount}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={refetch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          🔄 Refetch
        </button>
        <button onClick={resetQuery} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          🧹 Reset Query
        </button>
      </div>

      <TheoryBox />
    </div>
  );
}

function TheoryBox() {
  return (
    <div className="mt-6 bg-yellow-50 p-4 rounded text-sm">
      <h3 className="font-semibold mb-2">📘 Lý thuyết:</h3>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          💣 <strong>Error retry:</strong> Thử lại khi lỗi mạng/tạm thời.
        </li>
        <li>
          🧠 <strong>Custom retry:</strong> Phân loại lỗi để quyết định retry.
        </li>
        <li>
          ⏱️ <strong>Exponential backoff:</strong> Tăng thời gian chờ sau mỗi lần fail.
        </li>
        <li>
          🎲 <strong>Jitter:</strong> Random thêm delay để tránh thắt nút cổ chai.
        </li>
        <li>
          🧹 <strong>Reset:</strong> Xoá cache để thử lại sạch sẽ.
        </li>
      </ul>
    </div>
  );
}
