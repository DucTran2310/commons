import { fetchAllUsers, fetchUserById, fetchUserPosts, updateUserName } from "@/mock/fakeUserAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DependentQueryDemo() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [highlightUserId, setHighlightUserId] = useState<number | null>(null);

  // Lấy toàn bộ user cho dropdown
  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorUsers,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 3, // 🔁 3 phút
  });

  // Lấy thông tin user được chọn
  const {
    data: user,
    isLoading: loadingUser,
  } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => fetchUserById(selectedUserId!),
    enabled: !!selectedUserId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 3, // 🔁 3 phút
  });

  // Lấy bài viết của user
  const {
    data: posts,
    isLoading: loadingPosts,
    isError: errorPosts,
  } = useQuery({
    queryKey: ["posts", selectedUserId],
    queryFn: () => fetchUserPosts(selectedUserId!),
    enabled: !!selectedUserId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 3, // 🔁 3 phút
  });

  // Mutation cập nhật tên user
  const updateMutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: (updated) => {
      toast.success("✅ Đã cập nhật tên!");
      queryClient.invalidateQueries({ queryKey: ["user", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["posts", selectedUserId] });

      // 🎨 Hiệu ứng highlight tên
      setHighlightUserId(updated.id);
      setTimeout(() => setHighlightUserId(null), 2000);
    },
    onError: () => toast.error("❌ Cập nhật thất bại!"),
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">🎯 Dependent Queries + Mutation</h2>

      {/* Dropdown chọn user */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Chọn User:</label>
        <select className="border p-2 rounded w-full" value={selectedUserId ?? ""} onChange={(e) => setSelectedUserId(Number(e.target.value))}>
          <option value="">-- Chọn user --</option>
          {users?.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        {loadingUsers && <p className="text-sm text-gray-500">⏳ Đang tải users...</p>}
        {errorUsers && <p className="text-red-500 text-sm">❌ Lỗi tải danh sách users</p>}
      </div>

      {/* Thông tin user */}
      {loadingUser ? (
        <div className="animate-pulse h-10 bg-gray-100 rounded mb-3" />
      ) : user ? (
        <div className="mb-4">
          <p
            className={clsx("transition-all", {
              "bg-yellow-100 px-2 py-1 rounded": highlightUserId === user.id,
            })}
          >
            🧑‍💼 <strong>Tên:</strong> {user.name}
          </p>
          <p>
            📧 <strong>Email:</strong> {user.email}
          </p>

          <div className="mt-2 flex gap-2">
            <input className="border p-1 rounded flex-1" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nhập tên mới" />
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => updateMutation.mutate({ id: user.id, name: newName })}>
              💾 Lưu
            </button>
          </div>
        </div>
      ) : null}

      {/* Danh sách bài viết */}
      <div>
        <h3 className="font-semibold mb-2">📝 Bài viết:</h3>
        {loadingPosts && <p className="text-sm text-gray-500">⏳ Đang tải bài viết...</p>}
        {errorPosts && <p className="text-red-500 text-sm">❌ Lỗi tải bài viết</p>}
        <ul className="list-disc ml-6 space-y-1">
          {posts?.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      </div>

      <TheoryBox />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

function TheoryBox() {
  return (
    <div className="mt-6 p-4 bg-yellow-50 rounded text-sm">
      <h3 className="font-semibold mb-2">📘 Lý thuyết:</h3>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          🔗 <strong>Dependent Query</strong>: Gọi khi đủ điều kiện (enabled).
        </li>
        <li>
          🧠 <strong>Refetch interval</strong>: Tự đồng bộ mỗi 3 phút.
        </li>
        <li>
          🎨 <strong>Hiệu ứng</strong>: Tô màu sau khi cập nhật user.
        </li>
      </ul>
    </div>
  );
}
