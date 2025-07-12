import type { MindMapNodeType } from "@/interfaces/mindmap.types";
import { Divider, Label, MenuItem } from "@/pages/Mindmap/Components/Commons_MindMap";
import React from "react";
import {
  FiAlertCircle,
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiCheckCircle, FiHelpCircle, FiImage,
  FiItalic,
  FiType,
} from "react-icons/fi";

interface ContextMenuPosition {
  x: number;
  y: number;
  nodeX?: number;
  nodeY?: number;
}

interface ContextMenuNodeProps {
  contextMenu: ContextMenuPosition | null;
  contextMenuRef: React.RefObject<HTMLDivElement | null>;
  node: MindMapNodeType;
  toggleBold: () => void;
  toggleItalic: () => void;
  changeTextAlign: (align: "left" | "center" | "right") => void;
  changeColor: (color: string) => void;
  changeTextColor: (color: string) => void;
  addIcon: (icon: string) => void;
  setIsSelectingColor: (value: boolean) => void;
}

const ContextMenuNode: React.FC<ContextMenuNodeProps> = ({
  contextMenu,
  contextMenuRef,
  node,
  toggleBold,
  toggleItalic,
  changeTextAlign,
  changeColor,
  changeTextColor,
  addIcon,
  setIsSelectingColor,
}) => {
  if (!contextMenu) return null;

  return (
    <div
      ref={contextMenuRef}
      style={{
        position: "fixed",
        top: contextMenu.y,
        left: contextMenu.x,
        background: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 100000,
        width: "220px",
        borderRadius: "8px",
        padding: "6px 0",
        color: "#333",
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        fontSize: "14px",
        transform:
          window.innerWidth - contextMenu.x < 250
            ? `translateX(-${250 - (window.innerWidth - contextMenu.x)}px)`
            : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      {/* Bold & Italic */}
      <MenuItem icon={<FiBold size={16} />} label="Bold" active={node.fontWeight === "bold"} onClick={toggleBold} />
      <MenuItem icon={<FiItalic size={16} />} label="Italic" active={node.fontStyle === "italic"} onClick={toggleItalic} />
      <Divider />

      {/* Text Align */}
      {[
        { icon: <FiAlignLeft size={16} />, label: "Align Left", value: "left" },
        { icon: <FiAlignCenter size={16} />, label: "Align Center", value: "center" },
        { icon: <FiAlignRight size={16} />, label: "Align Right", value: "right" },
      ].map(({ icon, label, value }) => (
        <MenuItem
          key={value}
          icon={icon}
          label={label}
          active={node.textAlign === value}
          onClick={() => changeTextAlign(value as "left" | "center" | "right")}
        />
      ))}
      <Divider />

      {/* Color Pickers */}
      <div style={{ padding: "8px 16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Label>Text Color</Label>
          <input
            type="color"
            value={node.textColor || "#000000"}
            onChange={(e) => {
              changeTextColor(e.target.value);
              setIsSelectingColor(false);
            }}
            onMouseDown={() => setIsSelectingColor(true)}
            onBlur={() => setIsSelectingColor(false)}
            style={{
              width: "100%",
              cursor: "pointer",
              height: "28px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <Label>Background</Label>
          <input
            type="color"
            value={node.color || "#ffffff"}
            onChange={(e) => {
              changeColor(e.target.value);
              setIsSelectingColor(false);
            }}
            onMouseDown={() => setIsSelectingColor(true)}
            onBlur={() => setIsSelectingColor(false)}
            style={{
              width: "100%",
              cursor: "pointer",
              height: "28px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>
      <Divider />

      {/* Icons */}
      <div style={{ padding: "8px 16px" }}>
        <Label>Icon</Label>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "4px" }}>
          {[
            { icon: "idea", component: <FiAlertCircle size={20} /> },
            { icon: "task", component: <FiCheckCircle size={20} /> },
            { icon: "question", component: <FiHelpCircle size={20} /> },
            { icon: "image", component: <FiImage size={20} /> },
            { icon: "text", component: <FiType size={20} /> },
          ].map((item) => (
            <div
              key={item.icon}
              onClick={() => addIcon(item.icon)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "6px",
                borderRadius: "4px",
                backgroundColor: node.icon === item.icon ? "#e0e7ff" : "transparent",
              }}
            >
              {item.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextMenuNode;