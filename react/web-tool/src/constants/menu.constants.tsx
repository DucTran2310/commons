import { Braces, BrushCleaning, DatabaseZap, FileDiff, FileJson } from 'lucide-react';

export const LIST_MENUS = [
  {
    id: 1,
    title: "Development",
    children: [
      {
        id: 2,
        title: "Định dạng và làm đẹp JSON",
        icon: <Braces />,
        path: "/format-json",
      },
      {
        id: 3,
        title: "So sánh 2 JSON",
        icon: <FileDiff />,
        path: "/diff-json",
      },
      {
        id: 4,
        title: "Loại bỏ ký tự trong Java",
        icon: <BrushCleaning />,
        path: "/java-dotnet-escape",
      },
      {
        id: 5,
        title: "Tạo dữ liệu ảo",
        icon: <DatabaseZap />,
        path: "/fake-data",
      },
      {
        id: 6,
        title: "Giảm kích thước JSON",
        icon: <FileJson />,
        path: "/json-minifier",
      },
    ],
  },
];