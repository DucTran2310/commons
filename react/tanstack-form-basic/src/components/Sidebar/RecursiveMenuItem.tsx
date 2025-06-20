import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MultiLevelFlyout } from './MultiLevelFlyout';

export function RecursiveMenuItem({
  item,
  level = 0,
  open,
  submenuOpen,
  toggleSubmenu,
  hoveredMenu,
  setHoveredMenu,
  flyoutPosition,
  setFlyoutPosition,
}: any) {
  const location = useLocation();
  const isOpen = submenuOpen[item.label] || false;
  const hasChildren = !!item.children?.length;
  const isActive = item.path && location.pathname === item.path;
  const padding = open ? 16 + level * 12 : 18;
  const isTopLevel = level === 0;

  const content = (
    <div
      className={`flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition w-full text-sm rounded-lg ${isActive ? 'bg-blue-100 font-medium' : ''}`}
      style={{ paddingLeft: `${padding}px` }}
    >
      {isTopLevel && item.icon}
      <span className={open ? 'truncate' : 'sr-only'}>{item.label}</span>
      {hasChildren && open && (
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div>
              {item.children.map((child: any) => (
                <RecursiveMenuItem
                  key={child.label}
                  item={child}
                  level={level + 1}
                  open={open}
                  submenuOpen={submenuOpen}
                  toggleSubmenu={toggleSubmenu}
                  hoveredMenu={hoveredMenu}
                  setHoveredMenu={setHoveredMenu}
                  flyoutPosition={flyoutPosition}
                  setFlyoutPosition={setFlyoutPosition}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}