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
  LOGIN_PAGE,
  LOGIN_PAGE_COOKIE,
  MIND_MAP_LAYOUT,
  PROFILE_PAGE,
  PROFILE_PAGE_COOKIE,
  REGISTER_FORM_TANSTACK,
  REGISTER_FORM_TANSTACK_MUI,
  TANSTACK_BACKGROUND_REFETCHING,
  TANSTACK_DEPENDENT_QUERY,
  TANSTACK_INFINITE_SCROLL,
  TANSTACK_QUERY,
  TANSTACK_QUERY_ADVANCE,
  TANSTACK_QUERY_MUTATION,
  TANSTACK_RETRY_BACKOFF,
  TANSTACK_STALE_CACHE_TIME,
  UNDO_REDO,
} from "@/constants/menus.constants";
import { lazy } from "react";

// Lazy load các component
const NotFound = lazy(() => import("@/pages/PageNotFound"));
const RegisterForm = lazy(() => import("@/pages/Form/tanstack/RegisterForm"));
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
// tanstack
const Form_Tanstack_MUI = lazy(() => import("@/pages/Form/tanstack/Form_Tanstack_MUI"));
const Tanstack_Query = lazy(() => import("@/pages/Form/tanstack/Tanstack_Query"));
const Tanstack_Query_Advance = lazy(() => import("@/pages/Form/tanstack/Tanstack_Query_Advance"));
const ReactHookFormBasic = lazy(() => import("@/pages/Form/react-hook-form/ReactHookFormBasic"));
const UserFormWizard = lazy(() => import("@/pages/Form/react-hook-form/UserFormWizard"));
const StaleVsCacheDemo = lazy(() => import("@/pages/Form/tanstack/StaleVsCacheDemo"));
const QueryMutationAdvanced = lazy(() => import("@/pages/Form/tanstack/QueryMutation"));
const InfiniteScrollDemo = lazy(() => import("@/pages/Form/tanstack/InfiniteScrollDemo"));
const DependentQueryDemo = lazy(() => import("@/pages/Form/tanstack/DependentQueryDemo"));
const RetryBackoffDemo = lazy(() => import("@/pages/Form/tanstack/RetryBackoffDemo"));
// Mindmap
const MindMapLayout = lazy(() => import("@/pages/Mindmap/MindMapLayout"));
const InfiniteList = lazy(() => import("@/pages/Performace_FE/InfiniteList"));
const InfiniteBigData = lazy(() => import("@/pages/Performace_FE/InfiniteBigData"));
const ProfilePage = lazy(() => import("@/pages/Profile/localStorage/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/Profile/localStorage/LoginPage"));
const LoginPage_Cookie = lazy(() => import("@/pages/Profile/cookie/LoginPage_Cookie"));
const ProfilePage_Cookie = lazy(() => import("@/pages/Profile/cookie/ProfilePage_Cookie"));
const UndoRedoApp = lazy(() => import("@/pages/Feature/Undo_Redo/UndoRedoApp"));
// Event
const Event_Bubbling = lazy(() => import("@/pages/Feature/Event_DOM_Handling/Event_Bubbling"));
const EventPhasesPage = lazy(() => import("@/pages/Feature/Event_DOM_Handling/EventPhase"));
const EventDelegationAdvanced = lazy(() => import("@/pages/Feature/Event_DOM_Handling/EventDelegationAdvanced"));
const EventVisualizer = lazy(() => import("@/pages/Feature/Event_DOM_Handling/EventVisualizer"));
const DebounceThrottleDemo = lazy(() => import("@/pages/Feature/Event_DOM_Handling/DebounceThrottleDemo"));
const Custom_Event = lazy(() => import("@/pages/Feature/Event_DOM_Handling/Custom_Event/Custom_Event"));
// Clipboard
const ClipboardDemo = lazy(() => import("@/pages/Feature/Event_DOM_Handling/Clipboard_API/ClipboardDemo"));
const ClipboardToQR = lazy(() => import("@/pages/Feature/Event_DOM_Handling/Clipboard_API/ClipboardToQR"));
// Context & right click
const FileListWithContextMenu = lazy(() => import("@/pages/Feature/Event_DOM_Handling/ContextMenu&RightClick/FileListWithContextMenu"));
// Debug
const DebuggerDemo = lazy(() => import("@/pages/Debug/DebugDemo"));
const DebugWithHook = lazy(() => import("@/pages/Debug/DebugWithHook"));
const Background_Refetching = lazy(() => import("@/pages/Form/tanstack/Background_Refetching"));

// Danh sách route
export const ROUTES = [
  {
    path: "/",
    component: MainLayout,
    children: [
      // form with tanstack & react-hook-form
      {
        path: REGISTER_FORM_TANSTACK,
        component: RegisterForm,
      },
      {
        path: REGISTER_FORM_TANSTACK_MUI,
        component: Form_Tanstack_MUI,
      },
      // tanstack
      {
        path: TANSTACK_QUERY,
        component: Tanstack_Query,
      },
      {
        path: TANSTACK_QUERY_ADVANCE,
        component: Tanstack_Query_Advance,
      },
      {
        path: TANSTACK_BACKGROUND_REFETCHING,
        component: Background_Refetching,
      },
      {
        path: FORM_BASIC_REACT_HOOK_FORM,
        component: ReactHookFormBasic,
      },
      {
        path: FORM_USER_WIZARD,
        component: UserFormWizard,
      },
      {
        path: TANSTACK_STALE_CACHE_TIME,
        component: StaleVsCacheDemo,
      },
      {
        path: TANSTACK_QUERY_MUTATION,
        component: QueryMutationAdvanced,
      },
      {
        path: TANSTACK_INFINITE_SCROLL,
        component: InfiniteScrollDemo,
      },
      {
        path: TANSTACK_DEPENDENT_QUERY,
        component: DependentQueryDemo,
      },
      {
        path: TANSTACK_RETRY_BACKOFF,
        component: RetryBackoffDemo,
      },
      // performance frontend
      {
        path: INFINITE_SCROLL,
        component: InfiniteList,
      },
      {
        path: INFINITE_BIGDATA_SCROLL,
        component: InfiniteBigData,
      },
      // mind-map
      {
        path: MIND_MAP_LAYOUT,
        component: MindMapLayout,
      },
      // axios
      {
        path: PROFILE_PAGE,
        component: ProfilePage,
      },
      {
        path: PROFILE_PAGE_COOKIE,
        component: ProfilePage_Cookie,
      },
      // feature
      {
        path: UNDO_REDO,
        component: UndoRedoApp,
      },
      {
        path: EVENT_BUBBLING,
        component: Event_Bubbling,
      },
      {
        path: EVENT_PHASE,
        component: EventPhasesPage,
      },
      {
        path: EVENT_DELEGATION,
        component: EventDelegationAdvanced,
      },
      {
        path: EVENT_SYNTHETIC,
        component: EventVisualizer,
      },
      {
        path: EVENT_DEBOUNCE_THROTTLE,
        component: DebounceThrottleDemo,
      },
      {
        path: EVENT_CUSTOM,
        component: Custom_Event,
      },
      // CLIPBOARD
      {
        path: CLIPBOARD_DEMO_BASIC,
        component: ClipboardDemo,
      },
      {
        path: CLIPBOARD_QR_CODE,
        component: ClipboardToQR,
      },
      // CONTEXT MENU & RIGHT CLICK
      {
        path: FILE_LIST_WITH_CONTEXT_MENU,
        component: FileListWithContextMenu,
      },
      // debug
      {
        path: DEBUG_DEMO,
        component: DebuggerDemo,
      },
      {
        path: DEBUG_WITH_HOOK,
        component: DebugWithHook,
      },
      {
        path: "*",
        component: NotFound,
      },
      // có thể thêm nhiều route con khác ở đây
    ],
  },
  {
    path: LOGIN_PAGE,
    component: LoginPage,
  },
  {
    path: LOGIN_PAGE_COOKIE,
    component: LoginPage_Cookie,
  },
];
