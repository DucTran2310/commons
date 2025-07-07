import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/mock/fakeProductAPI";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function QueryMutationAdvanced() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // ✅ Add
  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setNewName("");
      toast.success("✅ Đã thêm sản phẩm!");
    },
    onError: () => {
      toast.error("❌ Thêm sản phẩm thất bại!");
    },
  });

  // ❌ Delete (Optimistic)
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const prevData = queryClient.getQueryData(["products"]);
      queryClient.setQueryData(["products"], (old: any) =>
        old.filter((item: any) => item.id !== id)
      );
      return { prevData };
    },
    onError: (_err, _id, context) => {
      toast.error("❌ Xoá thất bại – đã khôi phục!");
      queryClient.setQueryData(["products"], context?.prevData);
    },
    onSuccess: () => {
      toast.success("🗑️ Đã xoá sản phẩm!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ✏️ Update (Optimistic)
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const prevData = queryClient.getQueryData(["products"]);
      queryClient.setQueryData(["products"], (old: any) =>
        old.map((item: any) => (item.id === id ? { ...item, name } : item))
      );
      return { prevData };
    },
    onError: (_err, _newData, context) => {
      toast.error("✏️ Cập nhật thất bại – khôi phục lại tên cũ!");
      queryClient.setQueryData(["products"], context?.prevData);
    },
    onSuccess: () => {
      toast.success("💾 Đã cập nhật tên!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-4">
        🚀 Mutation nâng cao (Add / Delete / Update)
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Tên sản phẩm mới"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={() => addMutation.mutate(newName)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Thêm
        </button>
      </div>

      <ul className="list-disc ml-5 space-y-2">
        <AnimatePresence>
          {products?.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ProductRow
                item={item}
                onDelete={() => deleteMutation.mutate(item.id)}
                onUpdate={(name) =>
                  updateMutation.mutate({ id: item.id, name })
                }
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <TheoryBox />
    </div>
  );
}

function ProductRow({
  item,
  onDelete,
  onUpdate,
}: {
  item: { id: number; name: string };
  onDelete: () => void;
  onUpdate: (name: string) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(item.name);

  return (
    <div className="flex items-center gap-2">
      {edit ? (
        <>
          <input
            className="border px-2 py-1 rounded"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={() => {
              onUpdate(newName);
              setEdit(false);
            }}
            className="px-2 py-1 bg-green-600 text-white rounded"
          >
            💾 Lưu
          </button>
        </>
      ) : (
        <>
          <span className="flex-1">{item.name}</span>
          <button
            onClick={() => setEdit(true)}
            className="px-2 py-1 bg-yellow-500 text-white rounded"
          >
            ✏️ Sửa
          </button>
        </>
      )}

      <button
        onClick={onDelete}
        className="px-2 py-1 bg-red-600 text-white rounded"
      >
        ❌ Xoá
      </button>
    </div>
  );
}

function TheoryBox() {
  return (
    <div className="mt-6 bg-yellow-50 p-4 rounded text-sm">
      <h3 className="font-semibold mb-2">📘 Lý thuyết:</h3>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          ✅ <strong>Mutation</strong>: Dùng để thêm / xoá / sửa dữ liệu.
        </li>
        <li>
          ⛳ <strong>Optimistic Update</strong>: Tạm cập nhật UI trước khi server trả về.
        </li>
        <li>
          🔁 <strong>rollback on error</strong>: Khôi phục data cũ nếu mutation lỗi.
        </li>
        <li>
          ♻️ <strong>invalidateQueries</strong>: Làm mới cache để đồng bộ với server.
        </li>
        <li>
          🍞 <strong>Toast</strong>: Hiển thị trạng thái thành công hoặc lỗi ngay tức thì.
        </li>
        <li>
          🎬 <strong>Animation</strong>: Làm mượt UI khi thêm hoặc xoá.
        </li>
      </ul>
    </div>
  );
}