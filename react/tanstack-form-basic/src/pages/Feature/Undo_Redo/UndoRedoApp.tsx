import { useUndoRedo } from "@/hooks/useUndo";
import { ToastList } from "./ToastList";
import { useToastQueue } from "@/hooks/useToastQueue";

const UndoRedoApp = () => {
  const { value, update, undo, redo, clear, canUndo, canRedo } = useUndoRedo("");
  const { queue, addToast } = useToastQueue();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧪 Undo / Redo + Toast Queue</h1>

      {/* Input */}
      <input
        value={value}
        onChange={(e) => {
          update(e.target.value);
          addToast(`✅ Đã nhập: ${e.target.value}`);
        }}
        className="border p-2 w-full rounded"
        placeholder="Nhập nội dung..."
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => (undo(), addToast("⏪ Undo"))} disabled={!canUndo} className="btn">
          Undo
        </button>
        <button onClick={() => (redo(), addToast("⏩ Redo"))} disabled={!canRedo} className="btn">
          Redo
        </button>
        <button onClick={() => (clear(), addToast("🧹 Đã xoá stack"))} className="btn text-red-500">
          Clear Stack
        </button>
      </div>

      {/* Value hiện tại */}
      <div className="text-gray-600 text-lg">
        <strong>Giá trị hiện tại:</strong> {value || "Chưa nhập"}
      </div>

      {/* 👉 Thông tin học tập */}
      <div className="bg-gray-100 p-4 rounded-lg shadow space-y-2">
        <h2 className="text-lg font-semibold">📘 Kiến thức Undo / Redo</h2>
        <ul className="list-disc list-inside text-sm leading-relaxed text-gray-700">
          <li>
            <strong>Undo</strong>: Quay lại trạng thái trước đó (Lưu bằng Stack - LIFO).
          </li>
          <li>
            <strong>Redo</strong>: Lặp lại hành động đã undo (Dùng Stack phụ).
          </li>
          <li>
            <strong>Stack</strong>: Cấu trúc dữ liệu LIFO (Last In First Out) – ví dụ như Ctrl+Z.
          </li>
          <li>
            <strong>Queue</strong>: FIFO (First In First Out), thường dùng trong hàng đợi, ví dụ như toast queue.
          </li>
          <li>Ứng dụng: Text Editor, Figma, VSCode, Photoshop, Todo App, Form editing…</li>
          <li>Mỗi thao tác cần ghi lại "snapshot" hoặc "diff" để undo/redo hiệu quả.</li>
        </ul>
      </div>

      {/* Toast Queue */}
      <ToastList messages={queue} />
    </div>
  );
};

export default UndoRedoApp;
