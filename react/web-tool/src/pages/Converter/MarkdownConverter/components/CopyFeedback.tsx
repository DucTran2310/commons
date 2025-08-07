import { AnimatePresence, motion } from 'framer-motion'

interface CopyFeedbackProps {
  show: boolean
  type: 'md' | 'html' | null
}

export const CopyFeedback = ({ show, type }: CopyFeedbackProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
      >
        {type === "md" ? "Markdown copied!" : "HTML copied!"}
      </motion.div>
    )}
  </AnimatePresence>
)