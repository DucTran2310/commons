import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

// Các level mô phỏng DOM tree
const LEVELS = ["Admin", "Manager", "Staff"] as const;
type Level = (typeof LEVELS)[number];

type Phase = "capture" | "bubble";

type LogType = "native" | "react";

interface LogEntry {
  time: string;
  level: Level;
  phase: Phase;
  type: LogType;
  message: string;
}

export default function EventVisualizer() {
  // Logs lưu lại các event đã xảy ra
  const [logs, setLogs] = useState<LogEntry[]>([]);
  // Chọn phase
  const [phase, setPhase] = useState<Phase>("bubble");
  // Chọn node sẽ stopPropagation
  const [stopAt, setStopAt] = useState<Level | "none">("none");
  // Node đang được highlight
  const [highlighted, setHighlighted] = useState<Level | null>(null);
  // Chế độ so sánh: true = React SyntheticEvent, false = Native Event
  const [useReactEvent, setUseReactEvent] = useState(true);

  // Ref cho từng node
  const refs = useRef<Record<Level, HTMLDivElement | null>>({
    Admin: null,
    Manager: null,
    Staff: null,
  });

  // Để tránh log trùng, lưu lại event đã log (dựa trên event.timeStamp và type)
  const eventLogged = useRef<Set<string>>(new Set());

  // Đăng ký native event listener cho từng node
  useEffect(() => {
    LEVELS.forEach((level) => {
      const el = refs.current[level];
      if (!el) {
        return;
      }

      // Handler cho native event
      const handler = (e: Event) => {
        // Đánh dấu đã log event này (dựa trên timeStamp + level + type)
        const key = `${e.timeStamp}-${level}-native`;
        if (eventLogged.current.has(key)) {
          return;
        }
        eventLogged.current.add(key);

        setHighlighted(level);
        const time = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          {
            time,
            level,
            phase,
            type: "native",
            message: `[Native] ${phase === "capture" ? "🔼" : "🔽"} ${level}`,
          },
        ]);
        if (stopAt === level) {
          setLogs((prev) => [
            ...prev,
            {
              time,
              level,
              phase,
              type: "native",
              message: `[Native] 🛑 stopPropagation at ${level}`,
            },
          ]);
          e.stopPropagation();
        }
        setTimeout(() => setHighlighted(null), 400);
      };

      el.addEventListener("click", handler, phase === "capture");
      return () => el.removeEventListener("click", handler, phase === "capture");
    });
    // Cleanup eventLogged khi phase/stopAt đổi
    eventLogged.current.clear();
  }, [phase, stopAt]);

  // Handler cho React SyntheticEvent
  const handleReactClick = (level: Level, e: React.MouseEvent<HTMLDivElement>) => {
    // Đánh dấu đã log event này (dựa trên nativeEvent.timeStamp + level + type)
    const key = `${e.nativeEvent.timeStamp}-${level}-react`;
    if (eventLogged.current.has(key)) {
      return;
    }
    eventLogged.current.add(key);

    setHighlighted(level);
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      {
        time,
        level,
        phase,
        type: "react",
        message: `[React] ${phase === "capture" ? "🔼" : "🔽"} ${level}`,
      },
    ]);
    if (stopAt === level) {
      setLogs((prev) => [
        ...prev,
        {
          time,
          level,
          phase,
          type: "react",
          message: `[React] 🛑 stopPropagation at ${level}`,
        },
      ]);
      e.stopPropagation();
    }
    setTimeout(() => setHighlighted(null), 400);
  };

  // Dispatch native click event vào node Staff
  const dispatchNativeClick = () => {
    refs.current.Staff?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  };

  // Vẽ SVG minh họa DOM tree
  const renderSVG = () => {
    // Node positions
    const positions = {
      Admin: { x: 150, y: 40 },
      Manager: { x: 150, y: 120 },
      Staff: { x: 150, y: 200 },
    };
    return (
      <svg width={300} height={260}>
        {/* Lines */}
        <line x1={150} y1={60} x2={150} y2={120} stroke="#888" strokeWidth={2} />
        <line x1={150} y1={140} x2={150} y2={200} stroke="#888" strokeWidth={2} />
        {/* Nodes */}
        {LEVELS.map((level) => (
          <g key={level}>
            <circle
              cx={positions[level].x}
              cy={positions[level].y}
              r={28}
              fill={level === "Admin" ? "#f97316" : level === "Manager" ? "#3b82f6" : "#22c55e"}
              stroke={highlighted === level ? "#fde047" : "#fff"}
              strokeWidth={highlighted === level ? 6 : 2}
            />
            <text x={positions[level].x} y={positions[level].y + 6} textAnchor="middle" fontSize={18} fill="#fff" fontWeight="bold">
              {level}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Render node lồng nhau (Admin > Manager > Staff), mỗi node nhỏ dần, có margin để không che nhau
  const renderNestedDivs = () => {
    // Định nghĩa style cho từng level
    const levelStyle: Record<Level, string> = {
      Admin: "w-56 h-56 z-10",
      Manager: "w-40 h-40 -mt-8 -mb-8 z-20",
      Staff: "w-24 h-24 -mt-6 -mb-6 z-30",
    };
    const getDiv = (level: Level, children: React.ReactNode) => (
      <div
        ref={(el) => {
          refs.current[level] = el;
        }}
        data-label={level}
        className={clsx(
          "flex items-center justify-center text-white text-lg font-semibold rounded-full shadow transition-all cursor-pointer select-none relative mx-auto",
          levelStyle[level],
          level === "Admin" && "bg-orange-500",
          level === "Manager" && "bg-blue-500",
          level === "Staff" && "bg-green-500",
          highlighted === level && "ring-4 ring-yellow-300",
        )}
        onClick={useReactEvent ? (e) => handleReactClick(level, e) : undefined}
        onClickCapture={useReactEvent && phase === "capture" ? (e) => handleReactClick(level, e) : undefined}
        style={{ transition: "box-shadow 0.2s" }}
      >
        {level}
        {children}
      </div>
    );
    // Lồng nhau: Admin > Manager > Staff
    return getDiv("Admin", getDiv("Manager", getDiv("Staff", null)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">🫧 Bubble & Capture Visualizer</h1>
      <div className="flex flex-wrap gap-4 mb-8 items-center text-sm">
        <select value={phase} onChange={(e) => setPhase(e.target.value as Phase)} className="border px-3 py-1 rounded shadow">
          <option value="capture">Capture Phase</option>
          <option value="bubble">Bubble Phase</option>
        </select>
        <select value={stopAt} onChange={(e) => setStopAt(e.target.value as Level | "none")} className="border px-3 py-1 rounded shadow">
          <option value="none">Don't stop</option>
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useReactEvent} onChange={(e) => setUseReactEvent(e.target.checked)} />
          Use React SyntheticEvent
        </label>
        <button onClick={() => setLogs([])} className="text-sm text-blue-600 underline">
          🧼 Clear Logs
        </button>
        <button onClick={dispatchNativeClick} className="text-sm text-gray-700 underline hover:text-black">
          ⚡ Dispatch Native Click (Staff)
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SVG DOM Tree minh họa */}
        <div className="flex flex-col items-center gap-6">
          {renderSVG()}
          <div className="mt-6">{renderNestedDivs()}</div>
          <div className="text-xs text-gray-500 mt-2 text-center max-w-xs">
            <b>Chú thích:</b> <br />- <b>React SyntheticEvent</b>: Dùng onClick/onClickCapture trên JSX.
            <br />- <b>Native Event</b>: Dùng addEventListener trực tiếp trên DOM node.
            <br />
            - Có thể chọn phase, stopPropagation, và highlight node đang xử lý.
            <br />- Không log trùng, có thể so sánh thứ tự xử lý giữa hai loại event.
          </div>
        </div>
        {/* Logs */}
        <div>
          <h2 className="text-xl font-semibold mb-2">📋 Timeline Logs</h2>
          <div className="bg-zinc-900 text-white rounded p-4 h-96 overflow-y-auto text-sm font-mono space-y-1">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={clsx(log.type === "react" ? "text-blue-300" : "text-green-300", "mr-2")}>{log.time}</span>
                  <span>{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
