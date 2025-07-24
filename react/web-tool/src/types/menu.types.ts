export interface MenuItem {
  id: number;
  title: string;
  icon?: React.ReactNode;
  path?: string;
  isActive?: boolean;
  children?: MenuItem[];
  isSectionHeader?: boolean;
  isDivider?: boolean;
}

export interface MenuItemProps {
  item: MenuItem;
  level?: number;
  onItemClick?: (id: number) => void;
}

export interface SidebarProps {
  menuItems: MenuItem[];
  onItemClick?: (id: number) => void;
}