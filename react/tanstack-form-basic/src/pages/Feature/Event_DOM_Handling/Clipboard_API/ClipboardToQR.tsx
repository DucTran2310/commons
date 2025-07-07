// ClipboardToQR.tsx
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "clipboard_history";
const MAX_QR_LENGTH = 200;

const ClipboardToQR: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [toast, setToast] = useState("");
  const originalHistory = useRef<any[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setHistory(parsed);
      originalHistory.current = parsed;
    }
  }, []);

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setHistory(parsed);
        originalHistory.current = parsed;
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const saveHistory = (items: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setHistory(items);
    originalHistory.current = items;
  };

  const handlePaste = async () => {
    try {
      const clipboard = await navigator.clipboard.readText();
      if (!clipboard.trim()) {
        return showToast("📭 Clipboard empty");
      }
      if (clipboard.length > MAX_QR_LENGTH) {
        return showToast("❌ Text too long for QR! Limit 200 characters.");
      }
      const item = { id: uuidv4(), text: clipboard, createdAt: Date.now() };
      const newHistory = [item, ...history.slice(0, 19)];
      saveHistory(newHistory);
      setSelected(item);
      showToast("✅ Loaded clipboard!");
    } catch {
      showToast("❌ Cannot access clipboard");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("📋 Copied!");
    } catch {
      showToast("❌ Copy failed");
    }
  };

  const handleDelete = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    saveHistory(newHistory);
    if (selected?.id === id) {
      setSelected(null);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clipboard_history.json";
    link.click();
  };

  const handleSearch = debounce((keyword: string) => {
    const filtered = originalHistory.current.filter((h) => h.text.toLowerCase().includes(keyword.toLowerCase()));
    setHistory(filtered);
  }, 300);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const newItems = Array.from(history);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    saveHistory(newItems);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6 space-y-6">
        <h1 className="text-xl font-bold text-center">📋 Clipboard QR Manager</h1>

        <input
          type="text"
          placeholder="Enter any text here..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
          onChange={(e) => {
            const manualText = e.target.value.trim();
            if (manualText.length > MAX_QR_LENGTH) {
              return showToast("❌ Manual input too long for QR");
            }
            if (manualText) {
              const item = { id: "manual", text: manualText, createdAt: Date.now() };
              setSelected(item);
            } else {
              setSelected(null);
            }
          }}
        />

        <div className="flex justify-between items-center gap-2">
          <button onClick={handlePaste} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            📥 Load Clipboard
          </button>
          <button onClick={handleExportJSON} className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded">
            📤 Export JSON
          </button>
        </div>

        {selected && (
          <div className="text-center space-y-2">
            <QRCodeCanvas value={selected.text} size={180} />
            <p className="text-sm text-gray-600 break-words">{selected.text}</p>
          </div>
        )}

        <input
          type="text"
          className="w-full px-3 py-1 border rounded text-sm"
          placeholder="🔍 Search history..."
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="text-sm text-gray-600">
          <h2 className="font-semibold mb-2">🕘 History</h2>
          {history.length === 0 && <p className="text-gray-400">No clipboard history</p>}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="history-list">
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-start justify-between bg-gray-100 px-3 py-2 rounded shadow-sm"
                        >
                          <div onClick={() => setSelected(item)} className="cursor-pointer flex-1">
                            <p className="text-sm text-gray-800 hover:underline">
                              {item.text.length > 50 ? `${item.text.slice(0, 50)}...` : item.text}
                            </p>
                            <p className="text-xs text-gray-400">{formatDistanceToNow(item.createdAt)} ago</p>
                          </div>
                          <div className="flex gap-2 ml-2 text-xs">
                            <button className="text-blue-600 hover:underline" onClick={() => handleCopy(item.text)}>
                              📤 Copy
                            </button>
                            <button className="text-red-500 hover:underline" onClick={() => handleDelete(item.id)}>
                              ❌ Delete
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClipboardToQR;
