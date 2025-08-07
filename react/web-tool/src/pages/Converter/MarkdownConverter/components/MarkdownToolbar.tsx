import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  TableIcon
} from 'lucide-react'

type FormattingFunction = (prefix: string, suffix: string, defaultText?: string) => void
type BlockFormattingFunction = (prefix: string, suffix?: string, defaultText?: string) => void

interface MarkdownToolbarProps {
  formatText: FormattingFunction
  formatBlock: BlockFormattingFunction
  formatList: (ordered: boolean) => void
  formatTable: () => void
}

export const MarkdownToolbar = ({ 
  formatText, 
  formatBlock, 
  formatList, 
  formatTable,
}: MarkdownToolbarProps) => {
  const buttons = [
    {
      icon: <Heading1Icon className="h-4 w-4" />,
      tooltip: 'Heading 1',
      action: () => formatBlock('# ', '', 'Heading')
    },
    {
      icon: <Heading2Icon className="h-4 w-4" />,
      tooltip: 'Heading 2',
      action: () => formatBlock('## ', '', 'Heading')
    },
    {
      icon: <BoldIcon className="h-4 w-4" />,
      tooltip: 'Bold',
      action: () => formatText('**', '**', 'bold text')
    },
    {
      icon: <ItalicIcon className="h-4 w-4" />,
      tooltip: 'Italic',
      action: () => formatText('*', '*', 'italic text')
    },
    {
      icon: <CodeIcon className="h-4 w-4" />,
      tooltip: 'Inline Code',
      action: () => formatText('`', '`', 'code')
    },
    {
      icon: <CodeIcon className="h-4 w-4" />,
      tooltip: 'Code Block',
      action: () => formatBlock('```\n', '\n```', 'code block')
    },
    {
      icon: <QuoteIcon className="h-4 w-4" />,
      tooltip: 'Blockquote',
      action: () => formatBlock('> ', '', 'quote')
    },
    {
      icon: <ListIcon className="h-4 w-4" />,
      tooltip: 'Unordered List',
      action: () => formatList(false)
    },
    {
      icon: <ListOrderedIcon className="h-4 w-4" />,
      tooltip: 'Ordered List',
      action: () => formatList(true)
    },
    {
      icon: <TableIcon className="h-4 w-4" />,
      tooltip: 'Insert Table',
      action: formatTable
    },
    
  ]

  return (
    <TooltipProvider>
      <div className="flex border rounded-md border-light-divider dark:border-dark-divider">
        {buttons.map(({ icon, tooltip, action }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={action}
                className="text-light-text dark:text-dark-text"
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}