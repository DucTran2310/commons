import { REGISTER_FORM_TANSTACK, REGISTER_FORM_TANSTACK_MUI } from "@/constants/menus.constants";
import { Home, Settings, Users } from "lucide-react";

export const MENU_DATA = [
  {
    label: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    path: "/dashboard",
  },
  {
    label: "Users",
    icon: <Users className="w-4 h-4" />,
    children: [
      { label: "List", path: "/users/list" },
      { label: "Create", path: "/users/create" },
      {
        label: "Roles",
        children: [
          { label: "Admin", path: "/users/roles/admin" },
          { label: "User", path: "/users/roles/user" },
          {
            label: "Super Admin",
            children: [
              { label: "Permissions", path: "/users/roles/super-admin/permissions" },
              { label: "Audit Logs", path: "/users/roles/super-admin/audit-logs" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Form",
    icon: <Settings className="w-4 h-4" />,
    children: [
      { label: "Tanstack", path: REGISTER_FORM_TANSTACK },
      { label: "Tanstack_MUI", path: REGISTER_FORM_TANSTACK_MUI },
    ],
  },
  {
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
    children: [
      { label: "General", path: "/settings/general" },
      { label: "Security", path: "/settings/security" },
    ],
  },
];
