import React, { useEffect, useRef, useState } from "react";

const EventDelegationExtended: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: "🍎 Apple" },
    { id: 2, name: "🍌 Banana" },
    { id: 3, name: "🍇 Grape" },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const dragId = useRef<number | null>(null);

  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const id = target.dataset.id;
    const action = target.dataset.action;

    if (action === "delete" && id) {
      setLogs((prev) => [...prev, `🗑️ Deleted item with id = ${id}`]);
      setItems((prev) => prev.filter((item) => item.id.toString() !== id));
      return;
    }

    if (action === "edit" && id) {
      const item = items.find((i) => i.id.toString() === id);
      if (item) {
        setEditingId(item.id);
        setEditingValue(item.name);
      }
      return;
    }

    if (action === "save" && id) {
      setItems((prev) => prev.map((i) => (i.id.toString() === id ? { ...i, name: editingValue } : i)));
      setLogs((prev) => [...prev, `💾 Saved new name for id = ${id}`]);
      setEditingId(null);
      return;
    }

    if (action === "cancel") {
      setEditingId(null);
      setLogs((prev) => [...prev, `❌ Canceled editing`]);
      return;
    }

    if (target.tagName === "INPUT" && target.getAttribute("type") === "checkbox") {
      const checkboxId = parseInt(target.dataset.id || "0");
      setSelectedIds((prev) => (prev.includes(checkboxId) ? prev.filter((i) => i !== checkboxId) : [...prev, checkboxId]));
      return;
    }

    const li = target.closest("li[data-id]");
    if (li) {
      const liId = li.getAttribute("data-id");
      const text = li.querySelector("span")?.textContent || "Unknown";
      setLogs((prev) => [...prev, `✅ Clicked on: ${text} (id = ${liId})`]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLUListElement>) => {
    e.preventDefault();
    const li = (e.target as HTMLElement).closest("li[data-id]") as HTMLElement | null;
    if (li) {
      const id = parseInt(li.dataset.id || "0");
      setContextMenu({ x: e.clientX, y: e.clientY, id });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const addItem = () => {
    const fruits = ["🍍 Pineapple", "🥭 Mango", "🍑 Peach", "🍓 Strawberry"];
    const random = fruits[Math.floor(Math.random() * fruits.length)];
    const newId = Math.max(0, ...items.map((i) => i.id)) + 1;
    setItems([...items, { id: newId, name: random }]);
  };

  const handleDragStart = (id: number) => () => {
    dragId.current = id;
  };

  const handleDrop = (targetId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromId = dragId.current;
    if (fromId === null || fromId === targetId) {
      return;
    }
    const fromIndex = items.findIndex((i) => i.id === fromId);
    const toIndex = items.findIndex((i) => i.id === targetId);
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);
    setLogs((prev) => [...prev, `🔀 Reordered ${moved.name}`]);
  };

  return (
    <div className="flex">
      <div className="p-6 max-w-md mx-auto space-y-4 relative">
        <h2 className="text-xl font-bold">🍱 Event Delegation (Extended)</h2>

        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="🔍 Filter fruits..."
          className="w-full px-3 py-2 border rounded"
        />

        <div className="flex gap-2">
          <button onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">
            ➕ Add Fruit
          </button>
          <button onClick={() => setSelectedIds(items.map((i) => i.id))} className="bg-gray-500 text-white px-3 py-2 rounded">
            ✅ Select All
          </button>
          <button onClick={() => setSelectedIds([])} className="bg-gray-400 text-white px-3 py-2 rounded">
            ❌ Clear
          </button>
        </div>

        <ul onClick={handleListClick} onContextMenu={handleContextMenu} className="border rounded p-4 space-y-2 bg-gray-100 cursor-pointer">
          {items
            .filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()))
            .map((item) => (
              <li
                key={item.id}
                data-id={item.id}
                draggable
                onDragStart={handleDragStart(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop(item.id)}
                className="bg-white px-3 py-2 rounded shadow flex justify-between items-center gap-2"
              >
                <input type="checkbox" data-id={item.id} checked={selectedIds.includes(item.id)} readOnly />
                {editingId === item.id ? (
                  <>
                    <input className="border px-2 py-1 mr-2" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
                    <div className="space-x-2">
                      <button data-action="save" data-id={item.id} className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        Save
                      </button>
                      <button data-action="cancel" className="bg-gray-400 text-white px-2 py-1 rounded text-xs">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span title={item.name}>{item.name}</span>
                    <div className="space-x-2">
                      <button data-action="edit" data-id={item.id} className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Edit
                      </button>
                      <button data-action="delete" data-id={item.id} className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>

        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="absolute bg-white shadow-lg border rounded px-4 py-2 text-sm z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="mb-1 font-bold">Context Menu</div>
            <ul className="space-y-1">
              <li>🔍 View ID: {contextMenu.id}</li>
              <li>
                <button
                  className="text-red-600"
                  onClick={() => {
                    setItems((prev) => prev.filter((i) => i.id !== contextMenu.id));
                    setLogs((prev) => [...prev, `🗑️ Deleted via right-click: id = ${contextMenu.id}`]);
                    setContextMenu(null);
                  }}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="bg-black text-white p-3 rounded font-mono text-sm">
          <div className="mb-1 font-bold">📋 Logs:</div>
          {logs.length === 0 ? <div className="text-gray-400">Chưa có sự kiện nào</div> : logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>
      <div className="text-sm bg-white rounded shadow p-4 mt-4">
        <h3 className="font-bold mb-2">📘 Lý thuyết: Event Delegation là gì?</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Event Delegation</strong> là kỹ thuật <u>gắn sự kiện vào phần tử cha</u>, rồi dùng <code>event.target</code> để xác định phần tử
            con nào được click.
          </li>
          <li>
            Dựa trên cơ chế <strong>event bubbling</strong>: sự kiện nổi từ con → cha.
          </li>
          <li>
            Hiệu quả trong danh sách <strong>phần tử động</strong> (VD: danh sách todo, table row,...).
          </li>
          <li>
            Dễ bảo trì, ít tốn tài nguyên hơn so với việc gán từng <code>onClick</code> cho từng phần tử.
          </li>
          <li>
            Trong React, có thể áp dụng với các phần tử DOM gốc như <code>&lt;ul&gt;</code>, <code>&lt;table&gt;</code>,...
          </li>
        </ul>

        <h4 className="font-bold mt-4">💡 Cách hoạt động:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Gắn <code>onClick</code> vào <code>&lt;ul&gt;</code> (cha).
          </li>
          <li>
            Khi click vào <code>&lt;li&gt;</code> hoặc <code>&lt;button&gt;</code> bên trong: dùng <code>event.target</code> để biết chính xác phần tử
            nào bị click.
          </li>
          <li>
            Dùng <code>closest()</code> để tìm phần tử tổ tiên như <code>&lt;li data-id&gt;</code>.
          </li>
        </ul>

        <h4 className="font-bold mt-4">📍 Ví dụ cụ thể trong code:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Click vào <code>&lt;span&gt;</code> → log ra trái cây được chọn.
          </li>
          <li>
            Click vào <code>&lt;button&gt;</code> → xóa phần tử tương ứng bằng <code>data-id</code>.
          </li>
          <li>Click vào bất kỳ trái cây mới thêm vào vẫn hoạt động đúng nhờ Event Delegation.</li>
        </ul>
      </div>
    </div>
  );
};

export default EventDelegationExtended;
