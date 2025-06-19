import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Menu,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_DATA } from '@/components/Sidebar/Menu';
import { MultiLevelFlyout } from '@/components/Sidebar/MultiLevelFlyout';

export default function SidebarLayout() {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number; left: number } | null>(null);
  const location = useLocation();

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

  const RecursiveMenuItem = ({ item, level = 0 }: { item: any; level?: number }) => {
    const isOpen = submenuOpen[item.label] || false;
    const hasChildren = !!item.children?.length;
    const isActive = item.path && location.pathname === item.path;
    const padding = open ? 16 + level * 12 : 18;
    const isTopLevel = level === 0;

    const content = (
      <div
        className={`flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition w-full text-sm rounded-lg ${isActive ? 'bg-blue-100 font-medium' : ''
          }`}
        style={{ paddingLeft: `${padding}px` }}
      >
        {isTopLevel && item.icon}
        <span className={open ? 'truncate' : 'sr-only'}>{item.label}</span>
        {hasChildren && open && (
          <ChevronDown
            className={`w-4 h-4 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        )}
      </div>
    );

    const Wrapper = hasChildren ? 'button' : 'div';

    return (
      <div
        className="relative group"
        onMouseEnter={(e) => {
          if (!open && hasChildren) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setHoveredMenu(item.label);
            setFlyoutPosition({ top: rect.top, left: rect.right });
          }
        }}
        onMouseLeave={() => {
          if (!open) {
            setHoveredMenu(null);
            setFlyoutPosition(null);
          }
        }}
      >
        {hasChildren ? (
          <Wrapper
            type="button"
            className="w-full text-left"
            onClick={() => open && toggleSubmenu(item.label)}
          >
            {content}
          </Wrapper>
        ) : item.path ? (
          <Link to={item.path}>{content}</Link>
        ) : (
          content
        )}

        {!open && hasChildren && hoveredMenu === item.label && flyoutPosition && (
          <MultiLevelFlyout item={item} position={flyoutPosition} />
        )}

        {hasChildren && open && (
          <AnimatePresence initial={false}>
            <motion.div
              key={isOpen ? 'open' : 'closed'}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0,
              }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div>
                {item.children.map((child: any) => (
                  <RecursiveMenuItem key={child.label} item={child} level={level + 1} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`bg-[#9393aa] border-r h-screen transition-all duration-300 flex flex-col ${open ? 'w-60' : 'w-16'
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
            <RecursiveMenuItem key={item.label} item={item} />
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