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
      {
        path: 'text-converter',
        async lazy() {
          const { default: TextCaseConverter } = await import('@/pages/Converter/TextConverter/TextCaseConverter');
          return { Component: TextCaseConverter };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'color-converter',
        async lazy() {
          const { default: ColorConverter } = await import('@/pages/Converter/ColorConverter/ColorConverter');
          return { Component: ColorConverter };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'markdown-converter',
        async lazy() {
          const { default: MarkdownConverter } = await import('@/pages/Converter/MarkdownConverter/MarkdownConverter');
          return { Component: MarkdownConverter };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'jwt-decode',
        async lazy() {
          const { default: JwtDecoder } = await import('@/pages/Development/JWT-Decoder/JwtDecoder');
          return { Component: JwtDecoder };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'uuid-generator',
        async lazy() {
          const { default: UUIDGenerator } = await import('@/pages/Development/UUIDGenerator/UUIDGenerator');
          return { Component: UUIDGenerator };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'color-palette-generator',
        async lazy() {
          const { default: ColorPaletteGenerator } = await import('@/pages/Web/ColorPaletteGenerator/ColorPaletteGenerator');
          return { Component: ColorPaletteGenerator };
        },
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'box-shadow-generator',
        async lazy() {
          const { default: BoxShadowGenerator } = await import('@/pages/Web/BoxShadowGenerator/BoxShadowGenerator');
          return { Component: BoxShadowGenerator };
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]