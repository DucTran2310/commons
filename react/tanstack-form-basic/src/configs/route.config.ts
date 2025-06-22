import {
  FORM_BASIC_REACT_HOOK_FORM,
  FORM_USER_WIZARD,
  INFINITE_BIGDATA_SCROLL,
  INFINITE_SCROLL,
  MIND_MAP_LAYOUT,
  REGISTER_FORM_TANSTACK,
  REGISTER_FORM_TANSTACK_MUI,
} from "@/constants/menus.constants";
import { lazy } from "react";

// Lazy load các component
const NotFound = lazy(() => import("@/pages/PageNotFound"));
const RegisterForm = lazy(() => import("@/pages/Form/RegisterForm"));
const Form_Tanstack_MUI = lazy(() => import("@/pages/Form/Form_Tanstack_MUI"));
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const ReactHookFormBasic = lazy(
  () => import("@/pages/Form/react-hook-form/ReactHookFormBasic")
);
const UserFormWizard = lazy(
  () => import("@/pages/Form/react-hook-form/UserFormWizard")
);
const MindMapLayout = lazy(() => import("@/pages/Mindmap/MindMapLayout"));
const InfiniteList = lazy(() => import("@/pages/Performace_FE/InfiniteList"));
const InfiniteBigData = lazy(
  () => import("@/pages/Performace_FE/InfiniteBigData")
);

// Danh sách route
export const ROUTES = [
  {
    path: "/",
    component: MainLayout,
    children: [
      //form with tanstack & react-hook-form
      {
        path: REGISTER_FORM_TANSTACK,
        component: RegisterForm,
      },
      {
        path: REGISTER_FORM_TANSTACK_MUI,
        component: Form_Tanstack_MUI,
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
      {
        path: "*",
        component: NotFound,
      },
      // có thể thêm nhiều route con khác ở đây
    ],
  },
];
