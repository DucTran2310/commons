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
          const { default: JSONFormatter } = await import('@/pages/Development/JSON_Formatter/JSONFormatter');
          return { Component: JSONFormatter };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'diff-json',
        async lazy() {
          const { default: JsonDiffViewer } = await import('@/pages/Development/JSON_Diff/JsonDiffViewer');
          return { Component: JsonDiffViewer };
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]