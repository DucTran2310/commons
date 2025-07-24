import Sidebar from '@/components/common/Sidebar/Sidebar';
import { LIST_MENUS } from '@/constants/menu.constants';
import { SearchLayout } from '@/layouts/SearchLayout';
import type { MenuItem } from '@/types/menu.types';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout_Tool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(LIST_MENUS);

  // Update active states based on current route
  useEffect(() => {
    setMenuItems(prevItems => updateActiveStates(prevItems, location.pathname));
  }, [location.pathname]);

  const updateActiveStates = (items: MenuItem[], currentPath: string): MenuItem[] => {
    return items.map(item => {
      const isActive = item.path === currentPath;
      
      return {
        ...item,
        isActive,
        children: item.children ? updateActiveStates(item.children, currentPath) : undefined,
      };
    });
  };

  const handleItemClick = (id: number) => {
    setMenuItems(prevItems => {
      // Find the clicked item
      const findItem = (items: MenuItem[]): MenuItem | null => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children) {
            const found = findItem(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      const clickedItem = findItem(prevItems);
      
      // If the item has a path, navigate to it
      // The useEffect will then update the active states based on the new route
      if (clickedItem?.path) {
        navigate(clickedItem.path);
      }

      // Return the previous items (the useEffect will handle the state update)
      return prevItems;
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        menuItems={menuItems}
        onItemClick={handleItemClick}
      />
      <div className='flex flex-col w-full'>
        <SearchLayout />
        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#f9f9f9'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout_Tool;