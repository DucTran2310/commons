import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomEvent } from "@/hooks/useCustomEvent";

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useCustomEvent("modal:open", () => setIsOpen(true));
  useCustomEvent("modal:close", () => setIsOpen(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">🚀 Modal Event Triggered!</h2>
            <p className="text-gray-600 mb-4">You opened this modal via Custom Event.</p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};