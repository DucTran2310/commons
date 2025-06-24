import React from "react";
import { useWhyDidYouUpdate } from "@/hooks/useWhyDidYouUpdate";

type Props = {
  label: string;
  count: number;
  onClick: () => void;
};

const CounterCard: React.FC<Props> = ({ label, count, onClick }) => {
  useWhyDidYouUpdate("CounterCard", { label, count, onClick });

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded shadow text-center cursor-pointer hover:bg-blue-50 transition"
    >
      <h2 className="text-lg font-bold">{label}</h2>
      <p className="text-xl text-blue-600">{count}</p>
    </div>
  );
};

// ✅ chỉ re-render nếu props thực sự thay đổi
export default React.memo(CounterCard);