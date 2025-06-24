import { useUndoRedo } from "@/hooks/useUndo";
import { ToastList } from "./ToastList";
import { useToastQueue } from "@/hooks/useToastQueue";

const UndoRedoApp = () => {
  const { value, update, undo, redo, clear, canUndo, canRedo } = useUndoRedo("");
  const { queue, addToast } = useToastQueue();

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Undo / Redo + Toast Queue</h1>

      <input
        value={value}
        onChange={(e) => {
          update(e.target.value);
          addToast(`Đã cập nhật: ${e.target.value}`);
        }}
        className="border p-2 w-full"
        placeholder="Nhập nội dung..."
      />

      <div className="flex gap-2">
        <button onClick={() => (undo(), addToast("⏪ Undo"))} disabled={!canUndo} className="btn">
          Undo
        </button>
        <button onClick={() => (redo(), addToast("⏩ Redo"))} disabled={!canRedo} className="btn">
          Redo
        </button>
        <button onClick={() => (clear(), addToast("🧹 Clear Stack"))} className="btn text-red-500">
          Clear
        </button>
      </div>

      <p className="text-gray-600">Current: {value || "..."}</p>

      <ToastList messages={queue} />
    </div>
  );
};

export default UndoRedoApp;