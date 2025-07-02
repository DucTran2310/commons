import type { MindMapNodeType } from "@/interfaces/mindmap.types";
import React, { useState } from "react";

type MindMapNodeProps = {
  node: MindMapNodeType;
  onDrag: (id: string, newPos: { x: number; y: number }) => void;
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({ node, onDrag }) => {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // tránh gây drag canvas
    setDragging(true);
    setOffset({ x: e.clientX - node.position.x, y: e.clientY - node.position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      onDrag(node.id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setDragging(false);

  React.useEffect(() => {
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
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        background: hovered ? "#1e40af" : node.color ?? "#fff",
        color: "white",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: 600,
        whiteSpace: "nowrap",
        cursor: "move",
        boxShadow: hovered ? "0 0 10px rgba(0,0,0,0.3)" : undefined,
        transition: "background 0.15s, box-shadow 0.15s",
        zIndex: hovered ? 10 : 1,
      }}
    >
      {node.title}
    </div>
  );
};