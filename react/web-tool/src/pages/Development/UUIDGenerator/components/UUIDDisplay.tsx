import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/pages/Development/UUIDGenerator/components/CopyButton";
import type { OutputFormat, UUIDResult } from "@/types/uuid.types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {QRCodeSVG} from 'qrcode.react';

interface UUIDDisplayProps {
  uuids: UUIDResult[];
  format: OutputFormat;
  onCopy: (id: string) => void;
}

export function UUIDDisplay({ uuids, format, onCopy }: UUIDDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQRCodes, setShowQRCodes] = useState(false);

  const filteredUUIDs = uuids.filter((item) =>
    item.uuid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => setCopiedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const handleCopy = (id: string) => {
    onCopy(id);
    setCopiedId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search UUIDs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="qr-toggle"
            checked={showQRCodes}
            onCheckedChange={setShowQRCodes}
          />
          <Label htmlFor="qr-toggle">Show QR Codes</Label>
        </div>
      </div>

      {filteredUUIDs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUUIDs.map((item) => (
            <div
              key={item.id}
              className={`bg-muted/50 rounded-md p-4 transition-all ${
                copiedId === item.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <code className="text-sm break-all">{item.uuid}</code>
                <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <CopyButton
                        text={item.uuid}
                        size="sm"
                        onClick={() => handleCopy(item.id)}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
              </div>
              {showQRCodes && (
                <div className="mt-3 flex justify-center">
                  <QRCodeSVG
                    value={item.uuid}
                    size={128}
                    level="H"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No matching UUIDs found" : "No UUIDs generated yet"}
        </div>
      )}
    </div>
  );
}