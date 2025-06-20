import { MENU_DATA } from '@/components/Sidebar/Menu';
import { RecursiveMenuItem } from '@/components/Sidebar/RecursiveMenuItem';
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Menu,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function SidebarLayout() {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number; left: number } | null>(null);

  const toggleDrawer = () => {
    handleExpandAll(false);
    setOpen(!open);
  };

  const toggleSubmenu = (label: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleExpandAll = (expand: boolean) => {
    const allLabels: Record<string, boolean> = {};
    const traverse = (items: any[]) => {
      for (const item of items) {
        if (item.children) {
          allLabels[item.label] = expand;
          traverse(item.children);
        }
      }
    };
    traverse(MENU_DATA);
    setSubmenuOpen(allLabels);
  };

  const filteredMenu = useMemo(() => {
    if (!search.trim()) return MENU_DATA;
    const filter = (items: any[]): any[] => {
      return items
        .map((item) => {
          const matched = item.label.toLowerCase().includes(search.toLowerCase());
          const filteredChildren = item.children ? filter(item.children) : [];
          if (matched || filteredChildren.length) {
            return { ...item, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean) as any[];
    };
    return filter(MENU_DATA);
  }, [search]);



  return (
    <>
      <aside
        className={`bg-[#9393aa] border-r h-[100vw] transition-all duration-300 flex flex-col ${open ? 'w-60' : 'w-16'
          }`}
      >
        <div className="flex items-center justify-between p-3 border-b">
          {open && <span className="font-bold text-lg">Menu</span>}
          <button onClick={toggleDrawer} className="p-1 hover:bg-gray-100 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {open && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2 w-4 h-4 top-1.5 text-gray-500 z-100" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-8 pr-2 py-1 w-full border rounded text-sm"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-auto">
          {filteredMenu.map((item) => (
            <RecursiveMenuItem
              key={item.label}
              item={item}
              level={0}
              open={open}
              submenuOpen={submenuOpen}
              toggleSubmenu={toggleSubmenu}
              hoveredMenu={hoveredMenu}
              setHoveredMenu={setHoveredMenu}
              flyoutPosition={flyoutPosition}
              setFlyoutPosition={setFlyoutPosition}
            />
          ))}
        </nav>

        {open && (
          <div className="border-t p-2 flex justify-center gap-2">
            <button onClick={() => handleExpandAll(true)} className="hover:bg-gray-100 p-1 rounded">
              <ChevronsDownUp className="w-4 h-4" />
            </button>
            <button onClick={() => handleExpandAll(false)} className="hover:bg-gray-100 p-1 rounded">
              <ChevronsUpDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}