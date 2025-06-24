import CounterCard from "@/pages/Debug/Components/CounterCard";
import { useCallback, useMemo, useState } from "react";

export default function DebugWithHook() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const increaseA = () => setCountA((c) => c + 1);
  const increaseB = () => setCountB((c) => c + 1);

  // ✅ Memo hóa object props để tránh re-render không cần thiết
  const cardAProps = useMemo(() => ({ label: "Counter A", count: countA }), [countA]);
  const cardBProps = useMemo(() => ({ label: "Counter B", count: countB }), [countB]);

  // ✅ Memo hóa callback để giữ nguyên tham chiếu
  const onCardClick = useCallback(() => {
    console.log("Card clicked");
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold">🔍 React.memo + useMemo/useCallback</h1>

      <div className="flex gap-4">
        <button onClick={increaseA} className="px-4 py-2 bg-blue-500 text-white rounded">
          Tăng A
        </button>
        <button onClick={increaseB} className="px-4 py-2 bg-green-500 text-white rounded">
          Tăng B
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CounterCard {...cardAProps} onClick={onCardClick} />
        <CounterCard {...cardBProps} onClick={onCardClick} />
      </div>
    </div>
  );
}