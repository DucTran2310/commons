import React from 'react';
import MenuItemComponent from './MenuItem';
import type { SidebarProps } from '@/types/menu.types';
import { useTheme } from '@/context/ThemeContext';
import { useLayout } from '@/context/LayoutContext';
import { motion } from 'framer-motion';

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onItemClick }) => {
  const { isSidebarOpen } = useLayout();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <motion.div
      className={`
        h-screen overflow-y-auto font-sans text-sm
        ${isDarkMode ? 'bg-dark-sidebarBg' : 'bg-light-sidebarBg border-r border-light-divider p-4'}
      `}
      initial={false}
      animate={{
        width: isSidebarOpen ? 280 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {isSidebarOpen && (
        <div style={{ width: 280 }}>
          {menuItems.map((item) => (
            <MenuItemComponent 
              key={item.id} 
              item={item} 
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;