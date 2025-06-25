import { ROUTES } from "@/components/Sidebar/configs/route.config";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const renderRoute = (route: any) => {
  if (route.children) {
    return (
      <Route key={route.path} path={route.path} element={React.createElement(route.component)}>
        {route.children.map((child: any) => renderRoute(child))}
      </Route>
    );
  }
  return <Route key={route.path} path={route.path} element={React.createElement(route.component)} />;
};

export default function App() {
  return (
    <Suspense fallback="Loading...">
      <Routes>{ROUTES.map((route) => renderRoute(route))}</Routes>
    </Suspense>
  );
}
