import { AnimatePresence, motion } from 'framer-motion'

interface MarkdownPreviewProps {
  html: string
  errors: string[]
  className?: string
}

export const MarkdownPreview = ({ html, errors, className = '' }: MarkdownPreviewProps) => (
  <AnimatePresence mode="wait">
    <motion.div
      key="preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`overflow-auto bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text ${className}`}
    >
      {errors.length > 0 ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <h3 className="font-bold">Markdown Error:</h3>
          <ul className="list-disc pl-5 mt-2">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className="custom-prose max-w-none p-4 prose-headings:text-light-text dark:prose-headings:text-dark-text prose-p:text-light-text dark:prose-p:text-dark-text prose-strong:text-light-text dark:prose-strong:text-dark-text prose-em:text-light-text dark:prose-em:text-dark-text prose-blockquote:text-light-text dark:prose-blockquote:text-dark-text prose-code:text-light-text dark:prose-code:text-dark-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </motion.div>
  </AnimatePresence>
)