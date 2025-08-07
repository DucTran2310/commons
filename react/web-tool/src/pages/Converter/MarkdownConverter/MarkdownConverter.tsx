import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useDebounce from '@/hooks/useDebounce'
import { CopyFeedback } from '@/pages/Converter/MarkdownConverter/components/CopyFeedback'
import { MarkdownCheatsheet, type CheatsheetItem } from '@/pages/Converter/MarkdownConverter/components/MarkdownCheatsheet'
import { MarkdownPreview } from '@/pages/Converter/MarkdownConverter/components/MarkdownPreview'
import { MarkdownToolbar } from '@/pages/Converter/MarkdownConverter/components/MarkdownToolbar'
import DOMPurify from 'dompurify'
import { CodeIcon, CopyIcon, DownloadIcon, EyeIcon, HelpCircleIcon, Maximize2Icon, Minimize2Icon, UploadIcon } from 'lucide-react'
import { marked } from 'marked'
import { useCallback, useMemo, useRef, useState } from 'react'

// Constants
const DEFAULT_MARKDOWN = `# Welcome to Markdown Editor

## Getting Started

- Type Markdown on the **left**
- See HTML on the **right**
- Use the toolbar above for quick formatting

\`\`\`javascript
// Example code
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> This editor is inspired by StackEdit.io`

const CHEATSHEET_ITEMS: CheatsheetItem[] = [
  { syntax: '# Heading 1', description: 'Largest heading' },
  { syntax: '## Heading 2', description: 'Medium heading' },
  { syntax: '**bold**', description: 'Bold text' },
  { syntax: '*italic*', description: 'Italic text' },
  { syntax: '`code`', description: 'Inline code' },
  { syntax: '```\ncode block\n```', description: 'Code block' },
  { syntax: '- Item', description: 'Unordered list item' },
  { syntax: '1. Item', description: 'Ordered list item' },
  { syntax: '> Quote', description: 'Blockquote' },
  { syntax: '[text](url)', description: 'Link' },
  { syntax: '![alt](url)', description: 'Image' },
  { syntax: '| Header |\n|--------|\n| Cell   |', description: 'Table' }
];

const DEFAULT_OPTIONS: MarkdownOptions = {
  gfm: true,
  breaks: false,
  headerIds: true
}

// Types
type MarkdownOptions = {
  gfm: boolean
  breaks: boolean
  headerIds: boolean
}

type ViewMode = 'split' | 'edit' | 'preview'
type CopyType = 'md' | 'html' | null
type FileType = 'md' | 'html'

export default function MarkdownEditor() {
  // State
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [options] = useState<MarkdownOptions>(DEFAULT_OPTIONS)
  const [errors, setErrors] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [copyFeedback, setCopyFeedback] = useState<{ type: CopyType; show: boolean }>({
    type: null,
    show: false
  })
  const [showCheatsheet, setShowCheatsheet] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Derived values
  const debouncedMarkdown = useDebounce(markdown, 500)
  const wordCount = markdown.split(/\s+/).filter(Boolean).length

  const html = useMemo(() => {
    try {
      marked.setOptions(options)
      const rawHtml = marked(debouncedMarkdown)
      const cleanHtml = DOMPurify.sanitize(rawHtml)
      setErrors([])
      return cleanHtml
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unknown error'])
      return '<p>Error rendering Markdown</p>'
    }
  }, [debouncedMarkdown, options])

  // Handlers
  const handleTextSelection = (prefix: string, suffix: string, defaultText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const selectedText = markdown.substring(selectionStart, selectionEnd)
    const newText = selectedText || defaultText

    return {
      newMarkdown: markdown.substring(0, selectionStart) + prefix + newText + suffix + markdown.substring(selectionEnd),
      newCursorPos: selectionStart + prefix.length,
      selectionLength: newText.length
    }
  }

  const formatText = (prefix: string, suffix: string, defaultText = '') => {
    const result = handleTextSelection(prefix, suffix, defaultText)
    if (!result) return

    setMarkdown(result.newMarkdown)
    focusAndSetCursor(result.newCursorPos, result.newCursorPos + result.selectionLength)
  }

  const formatBlock = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const selectedText = markdown.substring(selectionStart, selectionEnd)
    const newText = selectedText || defaultText

    const beforeText = markdown.substring(0, selectionStart)
    const afterText = markdown.substring(selectionEnd)
    const needsPrefixNewline = selectionStart > 0 && !beforeText.endsWith('\n')
    const needsSuffixNewline = selectionEnd < markdown.length && !afterText.startsWith('\n')

    const newMarkdown =
      markdown.substring(0, selectionStart) +
      (needsPrefixNewline ? '\n' : '') +
      prefix + newText + suffix +
      (needsSuffixNewline ? '\n' : '') +
      markdown.substring(selectionEnd)

    setMarkdown(newMarkdown)

    const newCursorPos = selectionStart + (needsPrefixNewline ? 1 : 0) + prefix.length
    focusAndSetCursor(newCursorPos, newCursorPos + newText.length)
  }

  const formatList = (ordered: boolean) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const selectedText = markdown.substring(selectionStart, selectionEnd)

    if (selectedText.includes('\n')) {
      const lines = selectedText.split('\n')
      const formattedLines = lines.map((line, i) =>
        line.trim() === '' ? line : (ordered ? `${i + 1}. ${line}` : `- ${line}`)
      )
      const newMarkdown = markdown.substring(0, selectionStart) + formattedLines.join('\n') + markdown.substring(selectionEnd)
      setMarkdown(newMarkdown)
    } else {
      formatBlock(ordered ? '1. ' : '- ', '', 'List item')
    }
  }

  const formatTable = () => {
    const tableMarkdown = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |`
    insertAtCursor(`\n${tableMarkdown}\n`, tableMarkdown.length + 2)
  }

  const insertAtCursor = (content: string, cursorOffset: number) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart } = textarea
    const newMarkdown = markdown.substring(0, selectionStart) + content + markdown.substring(selectionStart)
    setMarkdown(newMarkdown)
    focusAndSetCursor(selectionStart + cursorOffset)
  }

  const focusAndSetCursor = (start: number, end: number = start) => {
    setTimeout(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.focus()
        textarea.selectionStart = start
        textarea.selectionEnd = end
      }
    }, 0)
  }

  const handleCopy = useCallback((type: CopyType, content: string) => {
    navigator.clipboard.writeText(content)
    setCopyFeedback({ type, show: true })
    setTimeout(() => setCopyFeedback({ type: null, show: false }), 2000)
  }, []);

  const exportToFile = (content: string, type: FileType) => {
    const blob = new Blob([content], { type: type === 'md' ? 'text/markdown' : 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown-${new Date().toISOString().slice(0, 10)}.${type}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setMarkdown(content)
    }
    reader.readAsText(file)
  }

  // UI Components
  const renderViewToggle = () => (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) => setViewMode(value as ViewMode)}
      className="border border-light-divider dark:border-dark-divider"
      size="sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="edit" aria-label="Edit mode">
            <CodeIcon className="h-4 w-4 text-light-text dark:text-dark-text" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Edit Mode</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="preview" aria-label="Preview mode">
            <EyeIcon className="h-4 w-4 text-light-text dark:text-dark-text" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Preview Mode</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  )

  const renderToolbarButtons = () => (
    <>
      <MarkdownToolbar
        formatText={formatText}
        formatBlock={formatBlock}
        formatList={formatList}
        formatTable={formatTable}
      />
      <Button variant="ghost" size="sm" onClick={() => handleCopy('md', markdown)}>
        <CopyIcon className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="ghost" size="sm" onClick={() => exportToFile(markdown, 'md')}>
        <DownloadIcon className="mr-2 h-4 w-4" />
        Download
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        id="markdown-upload"
        accept=".md,text/markdown"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button variant="ghost" size="sm" asChild>
        <Label htmlFor="markdown-upload" className="cursor-pointer">
          <UploadIcon className="mr-2 h-4 w-4" />
          Upload
        </Label>
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setShowCheatsheet(true)}>
        <HelpCircleIcon className="h-4 w-4" />
      </Button>
    </>
  )

  const renderEditor = () => (
    <Textarea
      ref={textareaRef}
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      className="h-[100vh] w-full rounded-none border-none font-mono resize-none p-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
      placeholder="Type your Markdown here..."
    />
  )

  const renderPreview = () => (
    <MarkdownPreview html={html} errors={errors} className="h-[100vh] p-6" />
  )

  const renderSplitView = () => (
    <div className="flex h-full">
      <div className="flex-1 border-r border-light-divider dark:border-dark-divider overflow-hidden">
        {renderEditor()}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <MarkdownPreview html={html} errors={errors} />
      </div>
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case 'edit': return renderEditor()
      case 'preview': return renderPreview()
      default: return renderSplitView()
    }
  }

  return (
    <div className={`w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "max-w-6xl mx-auto"}`}>
      <CopyFeedback show={copyFeedback.show} type={copyFeedback.type} />

      <MarkdownCheatsheet
        show={showCheatsheet}
        onClose={() => setShowCheatsheet(false)}
        items={CHEATSHEET_ITEMS}
      />

      <Card className={`flex flex-col bg-light-background dark:bg-dark-background ${isFullscreen ? 'h-screen' : 'my-8'}`}>
        <CardHeader className="border-b border-light-divider dark:border-dark-divider p-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {isFullscreen ? "Markdown Editor (Fullscreen)" : "Markdown Editor"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {renderViewToggle()}
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2Icon className="h-4 w-4" />
                ) : (
                  <Maximize2Icon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-center gap-1">
              {renderToolbarButtons()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          {renderContent()}
        </CardContent>

        <CardFooter className="border-t border-light-divider dark:border-dark-divider p-2 px-4">
          <div className="w-full flex justify-between items-center text-sm">
            <div>
              {errors.length > 0 ? (
                <span className="text-red-500">Error in Markdown</span>
              ) : (
                <span>Markdown is valid</span>
              )}
            </div>
            <div>
              {markdown.length} chars, {wordCount} words
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}