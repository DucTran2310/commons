import type { MenuItemProps } from '@/types/menu.types';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  level = 0,
  onItemClick
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isClickable = !!item.path;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    if (isClickable && onItemClick) {
      onItemClick(item.id);
    }
  };

  // Style for section header
  if (item.isSectionHeader) {
    return (
      <div className={`
        ${level === 0 ? 'mt-6' : 'mt-3'} mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider
        ${isDarkMode ? 'text-dark-sectionHeader' : 'text-light-sectionHeader'}
      `}>
        {item.title}
      </div>
    );
  }

  // Style for divider
  if (item.isDivider) {
    return (
      <div className={`
        my-3 border-b
        ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}
      `} />
    );
  }

  return (
    <div className="relative" style={{ marginLeft: `${level * 16}px`, marginBottom: '2px' }}>
      <div
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-all
          ${item.isActive ? 
            (isDarkMode ? 'bg-dark-activeBg text-dark-activeText font-semibold' : 'bg-light-activeBg text-light-activeText font-semibold') : 
            (isDarkMode ? 'text-dark-text' : 'text-light-text')
          }
          ${(isClickable || hasChildren) ? 'cursor-pointer' : 'cursor-default'}
          ${(isClickable || hasChildren) && !item.isActive ? 
            (isDarkMode ? 'hover:bg-dark-hoverBg' : 'hover:bg-light-hoverBg') : 
            ''
          }
        `}
      >
        {/* Chevron icon */}
        {hasChildren && (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center mr-2 ${isDarkMode ? 'text-dark-chevron' : 'text-light-chevron'}`}
          >
            <ChevronRight size={16} />
          </motion.span>
        )}

        {item.icon && (
          <span className={`flex items-center ${item.isActive ? 
            (isDarkMode ? 'text-dark-activeText' : 'text-light-activeText') : 
            (isDarkMode ? 'text-dark-text' : 'text-light-text')
          }`}>
            {item.icon}
          </span>
        )}

        <span className={`flex-1 text-sm text-ellipsis overflow-hidden w-[160px] whitespace-nowrap ${item.isActive ? 
          (isDarkMode ? 'text-dark-activeText' : 'text-light-activeText') : 
          (isDarkMode ? 'text-dark-text' : 'text-light-text')
        }`}>
          {item.title}
        </span>
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden relative"
          >
            {/* Vertical line connecting child items */}
            {level === 0 && item.children && item.children.length > 0 && (
              <div className={`
                absolute left-2 top-0 bottom-0 w-px
                ${isDarkMode ? 'bg-dark-divider' : 'bg-light-divider'}
              `} />
            )}

            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                level={level + 1}
                onItemClick={onItemClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuItemComponent;