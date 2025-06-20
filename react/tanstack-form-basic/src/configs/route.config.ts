import { REGISTER_FORM_TANSTACK, REGISTER_FORM_TANSTACK_MUI } from "@/constants/menus.constants";
import { lazy } from "react";

// Lazy load các component
const NotFound = lazy(() => import("@/pages/PageNotFound"));
const RegisterForm = lazy(() => import("@/pages/Form/RegisterForm"));
const Form_Tanstack_MUI = lazy(() => import("@/pages/Form/Form_Tanstack_MUI"));
const MainLayout = lazy(() => import("@/layouts/MainLayout"));

// Danh sách route
export const ROUTES = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: REGISTER_FORM_TANSTACK,
        component: RegisterForm,
      },
      {
        path: REGISTER_FORM_TANSTACK_MUI,
        component: Form_Tanstack_MUI,
      },
      {
        path: "*",
        component: NotFound,
      },
      // có thể thêm nhiều route con khác ở đây
    ],
  },
];
