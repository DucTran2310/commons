import type { MindMapNodeType } from "@/interfaces/mindmap.types";
import { IconRenderer } from "@/pages/Mindmap/IconRenderer";
import React, { useEffect, useRef, useState } from "react";
import ContextMenuNode from "./ContextMenuNode";

type MindMapNodeProps = {
  node: MindMapNodeType;
  onDrag: (id: string, newPos: { x: number; y: number }) => void;
  onUpdate: (node: MindMapNodeType) => void;
  scale: number;
  canvasPosition: { x: number; y: number };
};


interface ContextMenuPosition {
  x: number;
  y: number;
  nodeX?: number;
  nodeY?: number;
}

export const MindMapNode: React.FC<MindMapNodeProps> = ({
  node,
  onDrag,
  onUpdate,
  scale,
  canvasPosition,
}) => {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  const [isSelectingColor, setIsSelectingColor] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const menuX = rect.right - 500;
    const menuY = rect.top - 200;

    setContextMenu({
      x: menuX,
      y: menuY,
      nodeX: (rect.left - canvasPosition.x) / scale,
      nodeY: (rect.top - canvasPosition.y) / scale,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelectingColor) return;
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelectingColor]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    setOffset({ x: e.clientX - node.position.x, y: e.clientY - node.position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      requestAnimationFrame(() => {
        onDrag(node.id, { x: newX, y: newY });
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditValue(node.title);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...node, title: editValue });
    setEditing(false);
  };

  const toggleBold = () => {
    onUpdate({ ...node, fontWeight: node.fontWeight === "bold" ? "normal" : "bold" });
    setContextMenu(null);
  };

  const toggleItalic = () => {
    onUpdate({ ...node, fontStyle: node.fontStyle === "italic" ? "normal" : "italic" });
    setContextMenu(null);
  };

  const changeTextAlign = (align: "left" | "center" | "right") => {
    onUpdate({ ...node, textAlign: align });
    setContextMenu(null);
  };

  const changeColor = (color: string) => {
    onUpdate({ ...node, color });
  };

  const changeTextColor = (color: string) => {
    onUpdate({ ...node, textColor: color });
  };

  const addIcon = (icon: string) => {
    onUpdate({ ...node, icon });
    setContextMenu(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        background: node.color || "#fff",
        color: node.textColor || "black",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: node.fontWeight || "normal",
        fontStyle: node.fontStyle || "normal",
        fontSize: node.fontSize ? `${node.fontSize}px` : "inherit",
        textAlign: node.textAlign || "center",
        whiteSpace: "nowrap",
        cursor: "move",
        boxShadow: hovered ? "0 0 10px rgba(0,0,0,0.3)" : undefined,
        transition: "all 0.15s",
        border: `${node.borderWidth || 1}px solid ${node.borderColor || "#ddd"}`,
        minWidth: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems:
          node.textAlign === "right"
            ? "flex-end"
            : node.textAlign === "left"
              ? "flex-start"
              : "center",
        zIndex: dragging ? 1000 : hovered ? 100 : 1,
      }}
    >
      {editing ? (
        <form onSubmit={handleEditSubmit} style={{ display: "flex" }}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onMouseEnter={() => setEditValue(node.title)}
            autoFocus
            style={{
              border: "none",
              background: "transparent",
              color: node.textColor || "black",
              fontWeight: node.fontWeight,
              fontStyle: node.fontStyle,
              fontSize: node.fontSize ? `${node.fontSize}px` : "inherit",
              textAlign: node.textAlign,
              width: "100%",
            }}
          />
        </form>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {node.icon && (
            <span style={{ marginRight: "8px" }}>
              <IconRenderer icon={node.icon} />
            </span>
          )}
          {node.title}
        </div>
      )}

      <ContextMenuNode 
        contextMenu={contextMenu}
        contextMenuRef={contextMenuRef}
        node={node}
        toggleBold={toggleBold}
        toggleItalic={toggleItalic}
        changeTextAlign={changeTextAlign}
        changeColor={changeColor}
        changeTextColor={changeTextColor}
        addIcon={addIcon}
        setIsSelectingColor={setIsSelectingColor}
      />
    </div>
  );
};
