import { Button } from '@/components/ui/button'
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'

export interface CheatsheetItem {
  syntax: string
  description: string
}

interface MarkdownCheatsheetProps {
  show: boolean
  onClose: () => void
  items: readonly CheatsheetItem[]
  motionProps?: HTMLMotionProps<'div'>
}

export const MarkdownCheatsheet = ({ show, onClose, items }: MarkdownCheatsheetProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
          className="bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto dark:text-light-background"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold mb-4">Markdown Cheatsheet</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="border-b border-border dark:border-dark-divider pb-2">
                <code className="bg-muted dark:bg-dark-hoverBg px-2 py-1 rounded text-sm">
                  {item.syntax}
                </code>
                <p className="mt-1">{item.description}</p>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={onClose}>
            Close
          </Button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)