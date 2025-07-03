import React, { useEffect, useRef, useState } from "react";
import "./EventPhasesPage.module.css";

const EventPhasesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonARef = useRef<HTMLButtonElement>(null);
  const buttonBRef = useRef<HTMLButtonElement>(null);

  const [stopProp, setStopProp] = useState(false);
  const [stopImmediate, setStopImmediate] = useState(false);
  const [showCapturing, setShowCapturing] = useState(false);
  const [showBubbling, setShowBubbling] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => (prev.at(-1) === msg ? prev : [...prev, msg]));
  };

  const highlight = (el: HTMLElement) => {
    el.classList.add("highlight");
    setTimeout(() => el.classList.remove("highlight"), 300);
  };

  useEffect(() => {
    const listeners: { target: HTMLElement; type: string; listener: EventListener; options?: any }[] = [];

    const container = containerRef.current!;
    const box = boxRef.current!;
    const btnA = buttonARef.current!;
    const btnB = buttonBRef.current!;

    const handleCapture = (label: string, el: HTMLElement) => (e: Event) => {
      if (showCapturing) {
        highlight(el);
        addLog(`🔼 Capturing - ${label}`);
      }
    };

    const handleBubbling = (label: string, el: HTMLElement) => (e: Event) => {
      if (showBubbling) {
        highlight(el);
        addLog(`🔽 Bubbling - ${label}`);
      }
    };

    // Button A handlers
    const handleButtonACapture = (e: Event) => {
      if (showCapturing) addLog("🔼 Capturing - Button A");
    };

    const handleButtonABubbling1 = (e: Event) => {
      highlight(btnA);
      addLog("🔽 Bubbling - Button A - [Handler 1]");
      if (stopImmediate) {
        addLog("🛑 stopImmediatePropagation()");
        e.stopImmediatePropagation();
      } else if (stopProp) {
        addLog("🛑 stopPropagation()");
        e.stopPropagation();
      }
    };

    const handleButtonABubbling2 = (e: Event) => {
      highlight(btnA);
      addLog("🔽 Bubbling - Button A - [Handler 2]");
    };

    const handleButtonBCapture = (e: Event) => {
      if (showCapturing) addLog("🔼 Capturing - Button B");
    };

    const handleButtonBBubbling = (e: Event) => {
      highlight(btnB);
      if (showBubbling) addLog("🔽 Bubbling - Button B");
    };

    // Attach listeners
    const attachListeners = (target: HTMLElement, label: string) => {
      const cap = handleCapture(label, target);
      const bub = handleBubbling(label, target);

      target.addEventListener("click", cap, true);
      target.addEventListener("click", bub);
      listeners.push({ target, type: "click", listener: cap, options: true });
      listeners.push({ target, type: "click", listener: bub });
    };

    attachListeners(container, "Container");
    attachListeners(box, "Box");

    btnA.addEventListener("click", handleButtonACapture, true);
    btnA.addEventListener("click", handleButtonABubbling1);
    btnA.addEventListener("click", handleButtonABubbling2);
    btnB.addEventListener("click", handleButtonBCapture, true);
    btnB.addEventListener("click", handleButtonBBubbling);

    listeners.push({ target: btnA, type: "click", listener: handleButtonACapture, options: true });
    listeners.push({ target: btnA, type: "click", listener: handleButtonABubbling1 });
    listeners.push({ target: btnA, type: "click", listener: handleButtonABubbling2 });
    listeners.push({ target: btnB, type: "click", listener: handleButtonBCapture, options: true });
    listeners.push({ target: btnB, type: "click", listener: handleButtonBBubbling });

    return () => {
      listeners.forEach(({ target, type, listener, options }) => {
        target.removeEventListener(type, listener, options);
      });
    };
  }, [stopProp, stopImmediate, showCapturing, showBubbling]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🎯 DOM Event Phases (React + Native)</h1>

      <div className="flex gap-4 flex-wrap justify-center text-sm mb-6">
        <label><input type="checkbox" checked={stopProp} onChange={(e) => {
          setStopProp(e.target.checked); if (e.target.checked) setStopImmediate(false);
        }} /> stopPropagation()</label>
        <label><input type="checkbox" checked={stopImmediate} onChange={(e) => {
          setStopImmediate(e.target.checked); if (e.target.checked) setStopProp(false);
        }} /> stopImmediatePropagation()</label>
        <label><input type="checkbox" checked={showCapturing} onChange={(e) => setShowCapturing(e.target.checked)} /> Show Capturing</label>
        <label><input type="checkbox" checked={showBubbling} onChange={(e) => setShowBubbling(e.target.checked)} /> Show Bubbling</label>
        <button onClick={() => setShowTheory((prev) => !prev)} className="underline text-blue-600">
          {showTheory ? "Ẩn lý thuyết" : "Hiện lý thuyết"}
        </button>
      </div>

      <div ref={containerRef} className="bg-white border shadow-lg rounded-xl p-8 w-[320px] text-center">
        <span>CONTAINER</span>
        <div ref={boxRef} className="bg-gray-200 flex flex-col gap-4 p-6 mt-2 rounded-lg">
          <span>BOX</span>
          <button ref={buttonARef} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Button A
          </button>
          <button ref={buttonBRef} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
            Button B
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-lg bg-black text-white rounded p-4 text-sm font-mono">
        <div className="flex justify-between mb-2">
          <span>📋 Log</span>
          <button onClick={() => setLogs([])} className="bg-white text-black text-xs px-2 py-1 rounded">
            Clear
          </button>
        </div>
        <div className="h-64 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <p className="text-gray-400">Chưa có sự kiện nào</p>
          ) : logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>

      {showTheory && (
        <div className="mt-6 w-full max-w-xl bg-white p-4 rounded shadow text-sm text-left space-y-2">
          <h2 className="text-lg font-bold">📚 Lý thuyết</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Capturing phase</strong>: từ Container → Box → Button (top-down)</li>
            <li><strong>Bubbling phase</strong>: từ Button → Box → Container (bottom-up)</li>
            <li><code>stopPropagation()</code>: chặn lan truyền lên cha, nhưng handler khác cùng phần tử vẫn chạy</li>
            <li><code>stopImmediatePropagation()</code>: chặn luôn handler còn lại ở cùng phần tử</li>
            <li>React synthetic events chạy sau DOM bubbling → cần test DOM trực tiếp để hiểu chính xác</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventPhasesPage;