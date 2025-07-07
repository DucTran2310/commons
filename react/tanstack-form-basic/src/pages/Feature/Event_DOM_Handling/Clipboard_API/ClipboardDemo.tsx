import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Fake WebSocket broadcast
const subscribers: ((msg: { userId: string; text: string }) => void)[] = [];

const useFakeWebSocket = (onMessage: (msg: { userId: string; text: string }) => void) => {
  useEffect(() => {
    subscribers.push(onMessage);
    return () => {
      const index = subscribers.indexOf(onMessage);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }, [onMessage]);

  const send = (msg: { userId: string; text: string }) => {
    subscribers.forEach((fn) => fn(msg));
  };

  return { send };
};

type ClipboardItem = {
  text: string;
  timestamp: string;
  userId: string;
};

const USER_IDS = ["User A", "User B"];

const ClipboardDemo: React.FC = () => {
  const [userId, setUserId] = useState(USER_IDS[0]);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { send } = useFakeWebSocket((msg) => {
    if (msg.userId !== userId) {
      setToast(`${msg.userId} shared clipboard!`);
      setHistory((prev) => [{ text: msg.text, timestamp: new Date().toLocaleTimeString(), userId: msg.userId }, ...prev]);
    }
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = async () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
    try {
      await navigator.clipboard.writeText(text);
      const timestamp = new Date().toLocaleTimeString();
      const item: ClipboardItem = { text, timestamp, userId };
      setHistory((prev) => [item, ...prev]);
      showToast("✅ Copied!");
      send({ userId, text });
    } catch {
      showToast("❌ Copy failed");
    }
  };

  const handlePaste = async () => {
    try {
      const pasted = await navigator.clipboard.readText();
      setText(pasted);
      showToast("📥 Pasted!");
    } catch {
      showToast("❌ Paste failed");
    }
  };

  const handleRestore = async (text: string) => {
    setText(text);
    await navigator.clipboard.writeText(text);
    showToast("🔁 Restored & Copied!");
  };

  const handleDelete = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📋 Clipboard Manager</h1>
          <select
            value={userId}
            onChange={(e) => {
              setText("");
              setUserId(e.target.value);
            }}
            className="border px-2 py-1 rounded text-sm"
          >
            {USER_IDS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-3 rounded resize-none h-24 shadow focus:outline-none"
          placeholder="Enter your clipboard content"
        />

        <div className="flex gap-4">
          <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            📄 Copy
          </button>
          <button onClick={handlePaste} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            📥 Paste
          </button>
          <button onClick={handleClearAll} className="bg-red-500 text-white px-4 py-2 rounded ml-auto">
            🧹 Clear All
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">🧠 Clipboard History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No items yet</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {history.map((item, idx) => (
                <li key={idx} className="bg-gray-100 rounded p-2 flex justify-between items-center">
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{item.userId}</span>: <code className="bg-white px-1">{item.text}</code>
                    </p>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleRestore(item.text)} className="text-blue-600 hover:underline text-xs">
                      📥 Paste
                    </button>
                    <button onClick={() => handleDelete(idx)} className="text-red-600 hover:underline text-xs">
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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

export default ClipboardDemo;
