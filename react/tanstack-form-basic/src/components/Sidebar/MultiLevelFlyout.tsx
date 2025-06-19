// ✅ MultiLevelFlyout.tsx: Hỗ trợ submenu nhiều tầng + tự chỉnh vị trí + dark mode

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function MultiLevelFlyout({ item, depth = 0, position }: {
  item: any;
  depth?: number;
  position: { top: number; left: number };
}) {
  const [subHovered, setSubHovered] = useState<string | null>(null);
  const [subPosition, setSubPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto adjust nếu vượt màn hình
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newTop = position.top;
      let newLeft = position.left;

      if (rect.bottom > window.innerHeight) {
        newTop = Math.max(8, window.innerHeight - rect.height - 8);
      }

      if (rect.right > window.innerWidth) {
        newLeft = position.left - rect.width - 16; // lùi về trái nếu vượt phải
      }

      containerRef.current.style.top = `${newTop}px`;
      containerRef.current.style.left = `${newLeft}px`;
    }
  }, [position]);

  return (
    <div
      ref={containerRef}
      className="fixed z-[100] w-48 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      {/* Mũi tên hướng phải */}
      <div className="absolute -left-2 top-3 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-white dark:border-r-neutral-800" />

      {item.children.map((child: any) => {
        const hasChild = !!child.children?.length;
        return (
          <div
            key={child.label}
            className="relative group hover:bg-gray-100 dark:hover:bg-neutral-700 p-2 text-sm text-black dark:text-white whitespace-nowrap"
            onMouseEnter={(e) => {
              if (hasChild) {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setSubHovered(child.label);
                setSubPosition({ top: rect.top, left: rect.right });
              }
            }}
            onMouseLeave={() => {
              setSubHovered(null);
              setSubPosition(null);
            }}
          >
            {child.path ? (
              <Link to={child.path}>{child.label}</Link>
            ) : (
              <span className="cursor-default">{child.label}</span>
            )}

            {/* Flyout đệ quy */}
            {hasChild && subHovered === child.label && subPosition && (
              <MultiLevelFlyout item={child} position={subPosition} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}