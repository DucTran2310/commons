import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

interface FileItem {
  id: string;
  name: string;
  type: "pdf" | "image" | "text";
}

const initialFiles: FileItem[] = [
  { id: "1", name: "Resume.pdf", type: "pdf" },
  { id: "2", name: "Photo.png", type: "image" },
  { id: "3", name: "Notes.txt", type: "text" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return "📄";
    case "image":
      return "🖼️";
    case "text":
      return "📑";
    default:
      return "📁";
  }
};

// ✅ Refactor file card thành component riêng
const SortableFileCard = ({
  file,
  renamingId,
  newName,
  inputRef,
  onRightClick,
  onDoubleClick,
  onChangeNewName,
  onConfirmRename,
}: {
  file: FileItem;
  renamingId: string | null;
  newName: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onRightClick: (e: React.MouseEvent, file: FileItem) => void;
  onDoubleClick: () => void;
  onChangeNewName: (value: string) => void;
  onConfirmRename: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={(e) => onRightClick(e, file)}
      onDoubleClick={onDoubleClick}
      className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
    >
      {renamingId === file.id ? (
        <input
          ref={inputRef}
          value={newName}
          onChange={(e) => onChangeNewName(e.target.value)}
          onBlur={() => onConfirmRename(file.id)}
          onKeyDown={(e) => e.key === "Enter" && onConfirmRename(file.id)}
          autoFocus
          className="border px-2 py-1 rounded w-full"
        />
      ) : (
        <>
          <p className="text-2xl">{getFileIcon(file.type)}</p>
          <p className="font-semibold">{file.name}</p>
          <p className="text-xs text-gray-500">{file.type.toUpperCase()} file</p>
        </>
      )}
    </div>
  );
};

const FileListWithContextMenu: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileItem | null }>({ x: 0, y: 0, file: null });
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const contextRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submenuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (renamingId && inputRef.current && !inputRef.current.contains(target)) {
        setRenamingId(null);
        setNewName("");
      }

      if (contextRef.current && !contextRef.current.contains(target) && submenuRef.current && !submenuRef.current.contains(target)) {
        setContextMenu({ x: 0, y: 0, file: null });
        setSubmenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [renamingId]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contextMenu.file) {
        return;
      }
      if (e.ctrlKey && e.key === "c") {
        alert(`Copied ${contextMenu.file.name}`);
      }
      if (e.key === "Delete") {
        handleDelete(contextMenu.file.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contextMenu]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleRightClick = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const handleRename = () => {
    if (contextMenu.file) {
      setRenamingId(contextMenu.file.id);
      setNewName(contextMenu.file.name);
      setContextMenu({ ...contextMenu, file: null });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const confirmRename = (id: string) => {
    const currentFile = files.find((f) => f.id === id);
    if (!currentFile) {
      return;
    }

    const originalExt = currentFile.name.split(".").pop()?.toLowerCase();
    const newExt = newName.split(".").pop()?.toLowerCase();
    const trimmedName = newName.trim();

    if (originalExt !== newExt) {
      showToast("❌ Không được đổi đuôi file.");
      return;
    }
    const nameExists = files.some((f) => f.id !== id && f.name.toLowerCase() === trimmedName.toLowerCase());
    if (nameExists) {
      showToast("❌ Tên đã tồn tại.");
      return;
    }

    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: trimmedName } : f)));
    setRenamingId(null);
    setNewName("");
    showToast("✅ Đổi tên thành công!");
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setContextMenu({ x: 0, y: 0, file: null });
    showToast("🗑️ Đã xóa");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over?.id);
      setFiles((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const renderPreview = (file: FileItem) => {
    switch (file.type) {
      case "pdf":
        return <iframe src="https://mozilla.github.io/pdf.js/web/viewer.html" className="w-full h-96" title="PDF Preview" />;
      case "image":
        return <img src="https://via.placeholder.com/600x400" alt={file.name} className="w-full max-h-96 object-contain" />;
      case "text":
        return <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">Sample text content...</pre>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 select-none">
      <h1 className="text-2xl font-bold mb-6">📂 Rename Validation + Toast + Preview</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
        <SortableContext items={files} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {files.map((file) => (
              <SortableFileCard
                key={file.id}
                file={file}
                renamingId={renamingId}
                newName={newName}
                inputRef={inputRef}
                onRightClick={handleRightClick}
                onDoubleClick={() => setPreviewFile(file)}
                onChangeNewName={setNewName}
                onConfirmRename={confirmRename}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.file && (
          <motion.ul
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bg-white border shadow-md rounded w-48 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            ref={contextRef}
          >
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleRename}>
              ✏️ Rename
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setPreviewFile(contextMenu.file)}>
              🔍 Preview
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={(e) => {
                const toElement = e.relatedTarget as HTMLElement;
                if (!submenuRef.current?.contains(toElement)) {
                  setSubmenuOpen(false);
                }
              }}
            >
              ⚙️ More
              <AnimatePresence>
                {submenuOpen && (
                  <motion.ul
                    ref={submenuRef}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute top-0 left-full ml-2 bg-white border rounded shadow-md w-40"
                  >
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">📎 Info</li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (contextMenu.file) {
                          setPreviewFile(contextMenu.file);
                        }
                      }}
                    >
                      🔍 Preview
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={() => handleDelete(contextMenu.file!.id)}>
              🗑️ Delete
            </li>
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setPreviewFile(null)}
          >
            <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
              <h2 className="text-lg font-semibold mb-4">Preview: {previewFile.name}</h2>
              {renderPreview(previewFile)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileListWithContextMenu;
