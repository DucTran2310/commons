import {
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
  TANSTACK_QUERY,
  TANSTACK_QUERY_ADVANCE,
} from "@/constants/menus.constants";
import { lazy } from "react";

// Lazy load các component
const NotFound = lazy(() => import("@/pages/PageNotFound"));
const RegisterForm = lazy(() => import("@/pages/Form/tanstack/RegisterForm"));
const Form_Tanstack_MUI = lazy(() => import("@/pages/Form/tanstack/Form_Tanstack_MUI"));
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const Tanstack_Query = lazy(() => import("@/pages/Form/tanstack/Tanstack_Query"));
const Tanstack_Query_Advance = lazy(() => import("@/pages/Form/tanstack/Tanstack_Query_Advance"));
const ReactHookFormBasic = lazy(() => import("@/pages/Form/react-hook-form/ReactHookFormBasic"));
const UserFormWizard = lazy(() => import("@/pages/Form/react-hook-form/UserFormWizard"));
const MindMapLayout = lazy(() => import("@/pages/Mindmap/MindMapLayout"));
const InfiniteList = lazy(() => import("@/pages/Performace_FE/InfiniteList"));
const InfiniteBigData = lazy(() => import("@/pages/Performace_FE/InfiniteBigData"));
const ProfilePage = lazy(() => import("@/pages/Profile/localStorage/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/Profile/localStorage/LoginPage"));
const LoginPage_Cookie = lazy(() => import("@/pages/Profile/cookie/LoginPage_Cookie"));
const ProfilePage_Cookie = lazy(() => import("@/pages/Profile/cookie/ProfilePage_Cookie"));

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
      {
        path: TANSTACK_QUERY,
        component: Tanstack_Query,
      },
      {
        path: TANSTACK_QUERY_ADVANCE,
        component: Tanstack_Query_Advance,
      },
      {
        path: FORM_BASIC_REACT_HOOK_FORM,
        component: ReactHookFormBasic,
      },
      {
        path: FORM_USER_WIZARD,
        component: UserFormWizard,
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
