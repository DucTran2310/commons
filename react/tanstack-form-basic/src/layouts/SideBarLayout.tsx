import {
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Home,
  Menu,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuData = [
  {
    label: 'Dashboard',
    icon: <Home className="w-4 h-4" />,
    path: '/dashboard',
  },
  {
    label: 'Users',
    icon: <Users className="w-4 h-4" />,
    children: [
      { label: 'List', path: '/users/list' },
      { label: 'Create', path: '/users/create' },
      {
        label: 'Roles',
        children: [
          { label: 'Admin', path: '/users/roles/admin' },
          { label: 'User', path: '/users/roles/user' },
          {
            label: 'Super Admin',
            children: [
              { label: 'Permissions', path: '/users/roles/super-admin/permissions' },
              { label: 'Audit Logs', path: '/users/roles/super-admin/audit-logs' },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Form',
    icon: <Settings className="w-4 h-4" />,
    children: [
      { label: 'Tanstack', path: '/form/tanstack' },
      { label: 'Security', path: '/settings/security' },
    ],
  },
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    children: [
      { label: 'General', path: '/settings/general' },
      { label: 'Security', path: '/settings/security' },
    ],
  },
];

export default function SidebarLayout() {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
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
    traverse(menuData);
    setSubmenuOpen(allLabels);
  };

  const filteredMenu = useMemo(() => {
    if (!search.trim()) return menuData;
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
    return filter(menuData);
  }, [search]);

  const RecursiveMenuItem = ({ item, level = 0 }: { item: any; level?: number }) => {
    const isOpen = submenuOpen[item.label] || false;
    const hasChildren = !!item.children?.length;
    const isActive = item.path && location.pathname === item.path;

    const padding = open ? 16 + level * 12 : 12;

    const content = (
      <div
        className={`flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition w-full text-sm rounded-lg ${isActive ? 'bg-blue-100 font-medium' : ''
          }`}
        style={{ paddingLeft: `${padding}px` }}
      >
        {level === 0 && item.icon}
        <span className={open ? 'truncate' : 'sr-only'}>{item.label}</span>
        {hasChildren && open && (
          <ChevronDown
            className={`w-4 h-4 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
    );

    return (
      <div>
        {hasChildren ? (
          <button
            type="button"
            className="w-full text-left"
            onClick={() => toggleSubmenu(item.label)}
          >
            {content}
          </button>
        ) : item.path ? (
          <Link to={item.path}>{content}</Link>
        ) : (
          content
        )}

        {hasChildren && (
          <div
            className={`transition-all overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'
              } duration-300`}
          >
            {item.children.map((child: any) => (
              <RecursiveMenuItem key={child.label} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`bg-white border-r h-screen transition-all duration-300 bg-[#9393aa] flex flex-col ${open ? 'w-60' : 'w-16'
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
              <Search className="absolute left-2 w-4 h-4 top-1.5 text-gray-500" />
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
