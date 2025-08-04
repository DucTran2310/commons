import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { MinifiOptionsProps } from '@/types/json-minifier.type';
import { Minus } from 'lucide-react'

const MinifiOptions = ({ options, setOptions }: MinifiOptionsProps) => {
  return (
    <div className="bg-light-hoverBg dark:bg-dark-hoverBg p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text flex items-center gap-2">
        <Minus className="h-5 w-5" /> Minification Options
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="remove-whitespace"
            checked={options.removeWhitespace}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({ ...prev, removeWhitespace: checked }))
            }
            disabled={options.prettyPrint}
          />
          <Label
            htmlFor="remove-whitespace"
            className="text-light-text dark:text-dark-text"
          >
            Remove whitespace
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="remove-line-breaks"
            checked={options.removeLineBreaks}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({ ...prev, removeLineBreaks: checked }))
            }
            disabled={options.prettyPrint}
          />
          <Label
            htmlFor="remove-line-breaks"
            className="text-light-text dark:text-dark-text"
          >
            Remove line breaks
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="remove-comments"
            checked={options.removeComments}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({ ...prev, removeComments: checked }))
            }
          />
          <Label
            htmlFor="remove-comments"
            className="text-light-text dark:text-dark-text"
          >
            Remove comments
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="pretty-print"
            checked={options.prettyPrint}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({
                ...prev,
                prettyPrint: checked,
                removeWhitespace: checked ? false : prev.removeWhitespace,
                removeLineBreaks: checked ? false : prev.removeLineBreaks,
              }))
            }
          />
          <Label
            htmlFor="pretty-print"
            className="text-light-text dark:text-dark-text"
          >
            Pretty print
          </Label>
        </div>
      </div>
    </div>
  );
};

export default MinifiOptions