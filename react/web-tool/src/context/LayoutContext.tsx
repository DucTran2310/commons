import type { LayoutContextType } from '@/types/context.types';
import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext<LayoutContextType>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
  setSidebarOpen: () => {},
});

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const setSidebarOpen = (open: boolean) => setIsSidebarOpen(open);

  return (
    <LayoutContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);