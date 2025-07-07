import React, { useEffect, useRef } from "react";

export type ContextMenuItem = {
  label: string;
  icon?: string;
  action: string;
  children?: ContextMenuItem[];
};

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
  items: ContextMenuItem[];
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction, items }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute z-50 bg-white dark:bg-gray-800 border rounded shadow-md w-56" style={{ top: y, left: x }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex justify-between items-center"
          onClick={() => {
            onAction(item.action);
            onClose();
          }}
        >
          <span>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </span>
          {item.children && <span className="text-xs">▶</span>}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
