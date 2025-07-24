import { useState } from "react";
import { Search, Home, X, Menu, Sun, Moon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from "@/context/ThemeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SearchLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`
      flex items-center justify-between gap-2 p-4 border-b
      ${isDarkMode ? 'bg-dark-background border-dark-divider' : 'bg-light-background border-light-divider'}
    `}>
      <div className="flex items-center justify-between">
        {/* Sidebar toggle button */}
        <Button
          size="icon"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          variant="ghost"
          className={`
            ${isDarkMode ? 'text-dark-text hover:bg-dark-hoverBg' : 'text-light-text hover:bg-light-hoverBg'}
          `}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Home button with tooltip */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/'}
                aria-label="Go to homepage"
                className={`
                  ${isDarkMode ? 'text-dark-text hover:bg-dark-hoverBg' : 'text-light-text hover:bg-light-hoverBg'}
                `}
              >
                <Home className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={5}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md shadow-lg border animate-in fade-in-50 zoom-in-95
                ${isDarkMode ? 'bg-dark-activeBg text-dark-text border-dark-divider' : 'bg-light-activeBg text-light-text border-light-divider'}
              `}
            >
              <p>Trang chủ</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className={`
            absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
            ${isDarkMode ? 'text-dark-sectionHeader' : 'text-light-sectionHeader'}
          `} />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className={`
              pl-10 pr-4 py-2 rounded-full border focus-visible:ring
              ${isDarkMode ? 
                'bg-dark-hoverBg border-dark-divider focus-visible:ring-dark-activeText' : 
                'bg-light-hoverBg border-light-divider focus-visible:ring-light-activeText'}
            `}
          />
        </div>
      </div>

      {/* Language selector and theme toggle */}
      <div className="flex items-center justify-between">
        <div className="w-32 mr-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className={`
              w-full border
              ${isDarkMode ? 
                'bg-dark-background border-dark-divider text-dark-text' : 
                'bg-light-background border-light-divider text-light-text'}
            `}>
              <SelectValue placeholder="Ngôn ngữ" />
            </SelectTrigger>
            <SelectContent className={`
              border
              ${isDarkMode ? 
                'bg-dark-background border-dark-divider' : 
                'bg-light-background border-light-divider'}
            `}>
              <SelectItem 
                value="en" 
                className={isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg'}
              >
                English
              </SelectItem>
              <SelectItem 
                value="vi" 
                className={isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg'}
              >
                Tiếng Việt
              </SelectItem>
              <SelectItem 
                value="ja" 
                className={isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg'}
              >
                日本語
              </SelectItem>
              <SelectItem 
                value="zh" 
                className={isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg'}
              >
                中文
              </SelectItem>
              <SelectItem 
                value="ko" 
                className={isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg'}
              >
                한국어
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`
                  ${isDarkMode ? 'text-dark-text hover:bg-dark-hoverBg' : 'text-light-text hover:bg-light-hoverBg'}
                `}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={5}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md shadow-lg border animate-in fade-in-50 zoom-in-95
                ${isDarkMode ? 'bg-dark-activeBg text-dark-text border-dark-divider' : 'bg-light-activeBg text-light-text border-light-divider'}
              `}
            >
              {isDarkMode ? "Sáng" : "Tối"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}