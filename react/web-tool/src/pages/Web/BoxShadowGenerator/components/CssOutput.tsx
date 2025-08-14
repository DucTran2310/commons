import { Button } from "@/components/ui/button";
import { Check, Copy, Edit, Save } from "lucide-react";
import { useState } from "react";

interface CssOutputProps {
  cssValue: string;
  onCssChange?: (newValue: string) => void;
  editable?: boolean;
}

export default function CssOutput({ cssValue, onCssChange, editable = false }: CssOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(cssValue);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditToggle = () => {
    if (isEditing && onCssChange) {
      try {
        // Basic validation
        if (!editedValue.trim()) {
          throw new Error("CSS value cannot be empty");
        }
        
        // More complex validation could be added here
        onCssChange(editedValue);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid CSS format");
        return; // Don't exit edit mode if there's an error
      }
    }
    setIsEditing(!isEditing);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedValue(e.target.value);
  };

  const tailwindValue = cssValue
    ? `shadow-[${cssValue.replace(/, /g, "], shadow-[")}]`
    : "shadow-none";

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mt-8">
      {/* CSS Output Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">CSS Output</h2>
          <div className="flex gap-2">
            {editable && (
              <Button
                size="sm"
                variant={isEditing ? "default" : "outline"}
                onClick={handleEditToggle}
                className="gap-2"
              >
                {isEditing ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => handleCopy(`box-shadow: ${cssValue || "none"};`)}
              className="gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Copy CSS
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div>
            <textarea
              className={`w-full h-32 p-4 bg-gray-800 text-gray-100 rounded-md font-mono text-sm ${error ? "border border-red-500" : ""
                }`}
              value={editedValue}
              onChange={handleValueChange}
              spellCheck="false"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Format: [inset] h-offset v-offset blur spread color
            </p>
          </div>
        ) : (
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
            <code>box-shadow: {cssValue || "none"};</code>
          </pre>
        )}
      </div>

      {/* Tailwind Output Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tailwind Output</h2>
        <div className="relative">
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{tailwindValue}</code>
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2"
            onClick={() => handleCopy(tailwindValue)}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}