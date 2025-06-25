import { AnimatePresence, motion } from "framer-motion";

type ToastProps = {
  messages: { id: number; message: string }[];
};

export const ToastList = ({ messages }: ToastProps) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      <AnimatePresence>
        {messages.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-black text-white px-4 py-2 rounded shadow-md"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
