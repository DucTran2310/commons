import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCustomEvent } from "@/hooks/useCustomEvent";

export const Toast = () => {
  const [msg, setMsg] = useState<string | null>(null);

  useCustomEvent("toast:show", (e) => {
    setMsg(e.detail);
    setTimeout(() => setMsg(null), 3000);
  });

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-md z-50"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
