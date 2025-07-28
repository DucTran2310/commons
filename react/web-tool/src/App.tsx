import LoadingSpinner from '@/components/common/Loading';
import { LIST_ROUTES } from '@/constants/route.constants';
import { LayoutProvider } from '@/context/LayoutContext';
import { ThemeProvider } from '@/context/ThemeContext';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(LIST_ROUTES);

export default function App() {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <React.Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </LayoutProvider>
    </ThemeProvider>
  );
}