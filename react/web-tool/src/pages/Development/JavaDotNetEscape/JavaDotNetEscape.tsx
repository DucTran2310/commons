import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JavaDotNetEscape() {

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isUnescapeMode, setIsUnescapeMode] = useState(false);
  const [includeWhitespace, setIncludeWhitespace] = useState(false);
  const [escapeMode, setEscapeMode] = useState<"unicode" | "javascript">("javascript");

  const handleConvert = () => {
    if (isUnescapeMode) {
      setOutputText(unescapeString(inputText));
    } else {
      setOutputText(escapeString(inputText, includeWhitespace));
    }
  };

  const escapeString = (str: string, preserveWhitespace: boolean): string => {
    if (escapeMode === "javascript") {
      return str
        .replace(/\\/g, "\\\\")
        .replace(/\t/g, "\\t")
        .replace(/\v/g, "\\v")
        .replace(/\0/g, "\\0")
        .replace(/\b/g, "\\b")
        .replace(/\f/g, "\\f")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
    } else {
      return str
        .split("")
        .map((char) => {
          if (preserveWhitespace && (char === " " || char === "\t" || char === "\n" || char === "\r")) {
            return char;
          }
          const code = char.charCodeAt(0);
          return code < 256 ? `\\u${code.toString(16).padStart(4, "0")}` : char;
        })
        .join("");
    }
  };

  const unescapeString = (str: string): string => {
    if (escapeMode === "javascript") {
      return str
        .replace(/\\\\/g, "\\") // ✅ xử lý trước
        .replace(/\\t/g, "\t")
        .replace(/\\v/g, "\v")
        .replace(/\\0/g, "\0")
        .replace(/\\b/g, "\b")
        .replace(/\\f/g, "\f")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"');
    } else {
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    }
  };

  const handleCopy = () => navigator.clipboard.writeText(outputText);
  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="bg-white text-slate-900 dark:bg-dark-background dark:text-dark-text min-h-screen p-4">
      <Card className="w-full max-w-5xl mx-auto p-4 bg-white text-slate-900 dark:bg-dark-background dark:text-dark-text shadow-md rounded-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl font-semibold">
            Java/.Net String Escape / Unescape
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Switch id="mode-toggle" checked={isUnescapeMode} onCheckedChange={setIsUnescapeMode} />
              <Label htmlFor="mode-toggle">
                {isUnescapeMode ? "Unescape Mode" : "Escape Mode"}
              </Label>
            </div>

            {!isUnescapeMode && (
              <>
                <div className="flex items-center gap-2">
                  <Switch
                    id="whitespace-toggle"
                    checked={includeWhitespace}
                    onCheckedChange={setIncludeWhitespace}
                  />
                  <Label htmlFor="whitespace-toggle">Preserve Whitespace</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Label>Escape Type:</Label>
                  <input
                    type="radio"
                    id="unicode-escape"
                    name="escape-type"
                    checked={escapeMode === "unicode"}
                    onChange={() => setEscapeMode("unicode")}
                  />
                  <Label htmlFor="unicode-escape">Unicode</Label>

                  <input
                    type="radio"
                    id="javascript-escape"
                    name="escape-type"
                    checked={escapeMode === "javascript"}
                    onChange={() => setEscapeMode("javascript")}
                  />
                  <Label htmlFor="javascript-escape">JavaScript</Label>
                </div>
              </>
            )}
          </div>

          {/* Input & Output - dọc trên mobile, ngang trên desktop */}
          <div className="flex flex-col gap-6">
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
              <Label className="mb-2 font-semibold">Input</Label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="min-h-[220px] bg-gray-50 text-gray-900 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col">
              <Label className="mb-2 font-semibold">Output</Label>
              <Textarea
                value={outputText}
                readOnly
                placeholder="Converted result will appear here..."
                className="min-h-[220px] bg-gray-50 text-gray-900 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleConvert} className="px-6">
              {isUnescapeMode ? "Unescape" : "Escape"}
            </Button>
            <Button variant="outline" onClick={handleClear} className="px-6">
              Clear
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!outputText} className="px-6">
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}