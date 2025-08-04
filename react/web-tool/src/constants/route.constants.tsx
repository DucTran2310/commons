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
      {
        path: 'java-dotnet-escape',
        async lazy() {
          const { default: JavaDotNetEscape } = await import('@/pages/Development/JavaDotNetEscape/JavaDotNetEscape');
          return { Component: JavaDotNetEscape };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'fake-data',
        async lazy() {
          const { default: ToolFakeData } = await import('@/pages/Development/ToolFakeData/ToolFakeData');
          return { Component: ToolFakeData };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'json-minifier',
        async lazy() {
          const { default: JSONMinifier } = await import('@/pages/Development/JSONMinifier/JSONMinifier');
          return { Component: JSONMinifier };
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]