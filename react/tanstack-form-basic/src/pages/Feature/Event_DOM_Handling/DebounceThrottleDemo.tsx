import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useDebounce from "@/hooks/useDebounce";
import { useThrottle } from "@/hooks/useThrottle";

Chart.register(...registerables);

const fakeSearchApi = (query: string): Promise<string[]> => {
  return new Promise((res) => {
    const delay = Math.random() * 500 + 300;
    setTimeout(() => res([`${query} - result 1`, `${query} - result 2`]), delay);
  });
};

type LogType = {
  type: "input" | "fetch";
  time: number;
  query: string;
  latency?: number;
  userId?: number;
  inputTime?: number;
};

const NUM_FAKE_USERS = 5;

const AutocompleteVisualizer = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [log, setLog] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceMs, setDebounceMs] = useState(400);
  const [throttleMs, setThrottleMs] = useState(300);
  const [fakeUsersOn, setFakeUsersOn] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  const throttledFetch = useThrottle(async (q: string, inputTime?: number, userId?: number) => {
    const start = Date.now();
    setLoading(true);
    const res = await fakeSearchApi(q);
    const latency = Date.now() - start;
    const delayFromInput = inputTime ? start - inputTime : undefined;

    setLog((prev) => [
      ...prev,
      {
        type: "fetch",
        time: start,
        query: q,
        latency,
        inputTime,
        userId,
      },
    ]);
    setResults(res);
    setLoading(false);
  }, throttleMs);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const now = Date.now();
      throttledFetch(debouncedQuery, now);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    const q = e.target.value;
    setQuery(q);
    setLog((prev) => [...prev, { type: "input", time: now, query: q }]);
  };

  useEffect(() => {
    chartRef.current?.scrollTo({ left: chartRef.current.scrollWidth, behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    if (!fakeUsersOn) {
      return;
    }
    const intervals: NodeJS.Timeout[] = [];
    for (let i = 1; i <= NUM_FAKE_USERS; i++) {
      const interval = setInterval(
        () => {
          const fakeInput = `User${i}-${Math.random().toString(36).slice(2, 6)}`;
          const now = Date.now();
          setLog((prev) => [...prev, { type: "input", time: now, query: fakeInput, userId: i }]);
          throttledFetch(fakeInput, now, i);
        },
        1000 + i * 150,
      );
      intervals.push(interval);
    }
    return () => intervals.forEach(clearInterval);
  }, [fakeUsersOn, throttleMs]);

  const stats = {
    input: log.filter((l) => l.type === "input").length,
    fetch: log.filter((l) => l.type === "fetch").length,
    avgLatency: (
      log.filter((l) => l.type === "fetch" && l.latency).reduce((sum, l) => sum + (l.latency || 0), 0) /
      Math.max(1, log.filter((l) => l.type === "fetch" && l.latency).length)
    ).toFixed(1),
    avgDelay: (
      log.filter((l) => l.type === "fetch" && l.inputTime).reduce((sum, l) => sum + (l.time - (l.inputTime || 0)), 0) /
      Math.max(1, log.filter((l) => l.type === "fetch" && l.inputTime).length)
    ).toFixed(1),
  };

  const latencyData = {
    labels: log.filter((l) => l.type === "fetch").map((_, i) => i + 1),
    datasets: [
      {
        label: "Fetch Latency (ms)",
        data: log.filter((l) => l.type === "fetch").map((l) => l.latency || 0),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">⚡ Debounce vs Throttle - Real-Time Autocomplete</h1>

        <div className="flex gap-4 items-center">
          <input
            value={query}
            onChange={handleInputChange}
            placeholder="Type to search..."
            className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
          />
          {loading && <div className="loader h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        <div className="flex flex-wrap gap-4 items-center text-sm">
          <label>
            Debounce:
            <input
              type="number"
              className="ml-2 px-2 py-1 border rounded w-20"
              value={debounceMs}
              onChange={(e) => setDebounceMs(Number(e.target.value))}
            />
          </label>
          <label>
            Throttle:
            <input
              type="number"
              className="ml-2 px-2 py-1 border rounded w-20"
              value={throttleMs}
              onChange={(e) => setThrottleMs(Number(e.target.value))}
            />
          </label>
          <label className="flex items-center gap-2 ml-auto">
            <input type="checkbox" checked={fakeUsersOn} onChange={(e) => setFakeUsersOn(e.target.checked)} />
            🔁 Benchmark Mode
          </label>
          <button onClick={() => setLog([])} className="px-3 py-1 bg-red-500 text-white rounded">
            🧹 Clear Log
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">📈 Timeline Log</h2>
          <div ref={chartRef} className="overflow-x-auto whitespace-nowrap flex gap-1 py-2">
            {log.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs px-2 py-1 rounded shadow-sm ${
                  item.type === "input" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"
                }`}
              >
                {new Date(item.time).toLocaleTimeString()} <br />
                {item.type} {item.query} {item.userId ? `(User ${item.userId})` : ""}
                {item.type === "fetch" && item.inputTime && (
                  <>
                    <br />⏱ Delay: {item.time - item.inputTime}ms
                    <br />
                    📡 Latency: {item.latency}ms
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">📊 Performance Chart (Latency)</h2>
          <Line data={latencyData} />
        </div>

        <div className="bg-white p-4 rounded shadow text-sm text-gray-700">
          <h2 className="font-semibold mb-2">📦 Stats</h2>
          <p>
            🧠 Total Input Events: <strong>{stats.input}</strong>
          </p>
          <p>
            📤 Total Fetch Calls: <strong>{stats.fetch}</strong>
          </p>
          <p>
            ⏱ Avg Fetch Latency: <strong>{stats.avgLatency} ms</strong>
          </p>
          <p>
            ⌛ Avg Delay from Input: <strong>{stats.avgDelay} ms</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutocompleteVisualizer;
