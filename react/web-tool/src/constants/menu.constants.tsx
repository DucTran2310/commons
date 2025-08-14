import { BookMarked, Braces, BrushCleaning, CaseSensitive, Crop, DatabaseZap, FileDiff, FileJson, IdCard, Key, Paintbrush, Palette } from 'lucide-react';

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
      {
        id: 11,
        title: "JWT Decode",
        icon: <Key />,
        path: "/jwt-decode",
      },
      {
        id: 12,
        title: "Trình tạo UUID",
        icon: <IdCard />,
        path: "/uuid-generator",
      },
    ],
  },
  {
    id: 7,
    title: "Converter",
    children: [
      {
        id: 8,
        title: "Chuyển đổi chữ hoa/ chữ thường",
        icon: <CaseSensitive />,
        path: "/text-converter",
      },
      {
        id: 9,
        title: "Chuyển đổi màu",
        icon: <Palette />,
        path: "/color-converter",
      },
      {
        id: 10,
        title: "Chuyển đổi markdown sang HTML",
        icon: <BookMarked />,
        path: "/markdown-converter",
      }
    ],
  },
  {
    id: 13,
    title: "Web",
    children: [
      {
        id: 14,
        title: "Sinh bảng màu",
        icon: <Paintbrush />,
        path: "/color-palette-generator",
      },
      {
        id: 15,
        title: "Tạo box-shadow",
        icon: <Crop />,
        path: "/box-shadow-generator",
      },
    ],
  },
];