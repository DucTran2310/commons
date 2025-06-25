import { useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type?: ToastType;
};

export function useToastQueue(delay = 3000) {
  const [queue, setQueue] = useState<Toast[]>([]);

  const addToast = (message: string, type?: ToastType) => {
    const id = Date.now();
    setQueue((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setQueue((prev) => prev.filter((t) => t.id !== id));
    }, delay);
  };

  return { queue, addToast };
}
