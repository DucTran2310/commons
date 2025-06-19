import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./configs/route.config";

const renderRoute = (route: any) => {
  if (route.children) {
    return (
      <Route key={route.path} path={route.path} element={<route.component />}>
        {route.children.map((child: any) => renderRoute(child))}
      </Route>
    );
  }
  return <Route key={route.path} path={route.path} element={<route.component />} />;
};

export default function App() {
  return (
    <Suspense fallback="Loading...">
      <Routes>
        {ROUTES.map((route) => renderRoute(route))}
      </Routes>
    </Suspense>
  );
}