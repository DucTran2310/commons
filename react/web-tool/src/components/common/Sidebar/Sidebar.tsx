import React from 'react';
import MenuItemComponent from './MenuItem';
import type { SidebarProps } from '@/types/menu.types';
import { useTheme } from '@/context/ThemeContext';

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onItemClick }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`
      w-[280px] h-screen border-r p-4 overflow-y-auto font-sans text-sm
      ${isDarkMode ? 'bg-dark-sidebarBg border-dark-divider' : 'bg-light-sidebarBg border-light-divider'}
    `}>
      {menuItems.map((item) => (
        <MenuItemComponent 
          key={item.id} 
          item={item} 
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default Sidebar;