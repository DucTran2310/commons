import {
  DEBUG_DEMO,
  DEBUG_WITH_HOOK,
  EVENT_BUBBLING,
  FORM_BASIC_REACT_HOOK_FORM,
  FORM_USER_WIZARD,
  INFINITE_BIGDATA_SCROLL,
  INFINITE_SCROLL,
  MIND_MAP_LAYOUT,
  PROFILE_PAGE,
  PROFILE_PAGE_COOKIE,
  REGISTER_FORM_TANSTACK,
  REGISTER_FORM_TANSTACK_MUI,
  TANSTACK_QUERY,
  TANSTACK_QUERY_ADVANCE,
  UNDO_REDO,
} from "@/constants/menus.constants";
import { Brain, GalleryVertical, GalleryVerticalEnd, Home, KeyRound, MonitorCog, Settings, Telescope } from "lucide-react";

export const MENU_DATA = [
  {
    label: "Dashboard",
    icon: <Home className="w-4 h-4" />,
    path: "/dashboard",
  },
  {
    label: "Feature",
    icon: <MonitorCog className="w-4 h-4" />,
    children: [
      {
        label: "Event & DOM Handling",
        children: [
          { label: "Undo_Redo", path: UNDO_REDO },
          { label: "Event_Bubbling", path: EVENT_BUBBLING },
        ],
      },
      {
        label: "Debug",
        children: [
          { label: "Debugger", path: DEBUG_DEMO },
          { label: "Debug with Hook", path: DEBUG_WITH_HOOK },
        ],
      },
    ],
  },
  {
    label: "AXios",
    icon: <KeyRound className="w-4 h-4" />,
    children: [
      { label: "Interceptor-LocalStorage", path: PROFILE_PAGE },
      { label: "Interceptor-Cookie", path: PROFILE_PAGE_COOKIE },
    ],
  },
  {
    label: "Form",
    icon: <Settings className="w-4 h-4" />,
    children: [
      {
        label: "Tanstack",
        children: [
          { label: "Tanstack_basic", path: REGISTER_FORM_TANSTACK },
          { label: "Tanstack_MUI", path: REGISTER_FORM_TANSTACK_MUI },
          { label: "Tanstack_Query", path: TANSTACK_QUERY },
          { label: "Tanstack_Query_Advance", path: TANSTACK_QUERY_ADVANCE },
        ],
      },
      {
        label: "React-hook-form",
        children: [
          { label: "form-basic", path: FORM_BASIC_REACT_HOOK_FORM },
          { label: "user-form-wizard", path: FORM_USER_WIZARD },
        ],
      },
    ],
  },
  {
    label: "Performance-FE",
    icon: <Telescope className="w-4 h-4" />,
    children: [
      {
        label: "Infinite-scroll",
        icon: <GalleryVerticalEnd className="w-4 h-4" />,
        path: INFINITE_SCROLL,
      },
      {
        label: "Infinite-big-data-scroll",
        icon: <GalleryVertical className="w-4 h-4" />,
        path: INFINITE_BIGDATA_SCROLL,
      },
    ],
  },
  {
    label: "Mind-map",
    icon: <Brain className="w-4 h-4" />,
    path: MIND_MAP_LAYOUT,
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
