import { useState } from "react";

type Toast = {
  id: number;
  message: string;
};

export function useToastQueue(delay = 3000) {
  const [queue, setQueue] = useState<Toast[]>([]);

  const addToast = (msg: string) => {
    const id = Date.now();
    setQueue((prev) => [...prev, { id, message: msg }]);
    setTimeout(() => {
      setQueue((prev) => prev.filter((t) => t.id !== id));
    }, delay);
  };

  return { queue, addToast };
}