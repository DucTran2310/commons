import type { MindMapNodeType } from '@/interfaces/mindmap.types';
import React from 'react';
import { FiAlertCircle, FiAlignCenter, FiAlignLeft, FiAlignRight, FiBold, FiCheckCircle, FiHelpCircle, FiImage, FiItalic, FiType } from 'react-icons/fi';

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
  setIsSelectingColor
}) => {
  return (
    <>
      {contextMenu && (
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
          {/* --- Bold / Italic section */}
          <div style={{ padding: "4px 0" }}>
            <div
              onClick={toggleBold}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiBold size={16} />
              <span>Bold</span>
              {node.fontWeight === "bold" && (
                <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
              )}
            </div>
            <div
              onClick={toggleItalic}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiItalic size={16} />
              <span>Italic</span>
              {node.fontStyle === "italic" && (
                <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#eee", margin: "4px 0" }} />

          {/* --- Text align section */}
          <div style={{ padding: "4px 0" }}>
            <div
              onClick={() => changeTextAlign("left")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiAlignLeft size={16} />
              <span>Align Left</span>
              {node.textAlign === "left" && (
                <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
              )}
            </div>
            <div
              onClick={() => changeTextAlign("center")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiAlignCenter size={16} />
              <span>Align Center</span>
              {node.textAlign === "center" && (
                <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
              )}
            </div>
            <div
              onClick={() => changeTextAlign("right")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiAlignRight size={16} />
              <span>Align Right</span>
              {node.textAlign === "right" && (
                <span style={{ marginLeft: "auto", color: "#2563eb" }}>✓</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#eee", margin: "4px 0" }} />

          {/* --- Color pickers */}
          <div style={{ padding: "8px 16px" }}>
            <div style={{ marginBottom: "8px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px"
              }}>
                Text Color
              </label>
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
                  border: "1px solid #ddd"
                }}
              />
            </div>
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px"
              }}>
                Background
              </label>
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
                  border: "1px solid #ddd"
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#eee", margin: "4px 0" }} />

          {/* --- Icon section */}
          <div style={{ padding: "8px 16px" }}>
            <label style={{
              display: "block",
              fontSize: "12px",
              color: "#666",
              marginBottom: "8px"
            }}>
              Icon
            </label>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "4px"
            }}>
              {[
                { icon: "idea", component: <FiAlertCircle size={20} /> },
                { icon: "task", component: <FiCheckCircle size={20} /> },
                { icon: "question", component: <FiHelpCircle size={20} /> },
                { icon: "image", component: <FiImage size={20} /> },
                { icon: "text", component: <FiType size={20} /> }
              ].map((item) => (
                <div
                  key={item.icon}
                  onClick={() => addIcon(item.icon)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  style={{
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "4px"
                  }}
                >
                  {item.component}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextMenuNode;