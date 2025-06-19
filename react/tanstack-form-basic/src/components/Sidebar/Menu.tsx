import {
  Home,
  Users,
  Settings,
} from 'lucide-react';

export const MENU_DATA = [
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