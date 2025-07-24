import ErrorBoundary from '@/components/common/ErrorBoundary';
import Layout_Tool from '@/layouts/layout_Tool';

export const LIST_ROUTES = [
  {
    path: '/',
    element: <Layout_Tool />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'format-json',
        async lazy() {
          const { default: JSONFormatter } = await import('@/pages/JSON_Formatter/JSONFormatter');
          return { Component: JSONFormatter };
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]