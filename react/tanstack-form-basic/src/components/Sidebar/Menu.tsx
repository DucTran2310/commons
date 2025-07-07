import {
  CLIPBOARD_DEMO_BASIC,
  CLIPBOARD_QR_CODE,
  DEBUG_DEMO,
  DEBUG_WITH_HOOK,
  EVENT_BUBBLING,
  EVENT_CUSTOM,
  EVENT_DEBOUNCE_THROTTLE,
  EVENT_DELEGATION,
  EVENT_PHASE,
  EVENT_SYNTHETIC,
  FILE_LIST_WITH_CONTEXT_MENU,
  FORM_BASIC_REACT_HOOK_FORM,
  FORM_USER_WIZARD,
  INFINITE_BIGDATA_SCROLL,
  INFINITE_SCROLL,
  MIND_MAP_LAYOUT,
  PROFILE_PAGE,
  PROFILE_PAGE_COOKIE,
  REGISTER_FORM_TANSTACK,
  REGISTER_FORM_TANSTACK_MUI,
  TANSTACK_BACKGROUND_REFETCHING,
  TANSTACK_QUERY,
  TANSTACK_QUERY_ADVANCE,
  TANSTACK_QUERY_MUTATION,
  TANSTACK_STALE_CACHE_TIME,
  UNDO_REDO,
} from "@/constants/menus.constants";
import {
  Brain,
  GalleryVertical,
  GalleryVerticalEnd,
  Home,
  KeyRound,
  Keyboard,
  MonitorCog,
  MousePointerClick,
  Settings,
  Telescope,
} from "lucide-react";

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
          { label: "Event_Phase", path: EVENT_PHASE },
          { label: "Event_Delegation", path: EVENT_DELEGATION },
          { label: "Event_Synthetic", path: EVENT_SYNTHETIC },
          { label: "Event_Debounce_Throttle", path: EVENT_DEBOUNCE_THROTTLE },
          { label: "Event_Custom", path: EVENT_CUSTOM },
          {
            label: "ClipBoard",
            icon: <Keyboard className="w-4 h-4" />,
            children: [
              { label: "ClipBoard_basic", path: CLIPBOARD_DEMO_BASIC },
              { label: "ClipBoard_QR_CODE", path: CLIPBOARD_QR_CODE },
            ],
          },
          {
            label: "Context & Right Click",
            icon: <MousePointerClick className="w-4 h-4" />,
            children: [
              {
                label: "File list with context menu",
                path: FILE_LIST_WITH_CONTEXT_MENU,
              },
            ],
          },
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
          {
            label: "Tanstack_Background_Refetching",
            path: TANSTACK_BACKGROUND_REFETCHING,
          },
          {
            label: "Tanstack_Stale_Cache_Time",
            path: TANSTACK_STALE_CACHE_TIME,
          },
          { label: "Tanstack_Query_Mutation", path: TANSTACK_QUERY_MUTATION },
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
