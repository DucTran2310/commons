import React, { useRef, useState, useEffect } from "react";
import { MindMapNode } from "./MindMapNode";
import { Edge } from "./Edge";
import { initialNodes } from "@/mock/mindmap.mock";

export const MindMapCanvas = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(null);


  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const canvasSize = { width: 2000, height: 2000 };
  const centerNode = nodes.find((n) => n.id === "center");
  const isMac = /Mac/.test(navigator.platform);

  const handleDragNode = (id: string, newPos: { x: number; y: number }) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, position: newPos } : node
      )
    );
  };

  // Mouse drag with Shift
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && startDrag) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartDrag(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startDrag]);

  // Zoom or Scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomKeyPressed = isMac ? e.metaKey : e.ctrlKey;

    if (zoomKeyPressed) {
      const delta = -e.deltaY;
      const zoomFactor = 0.001;
      setScale((prev) => {
        let next = prev + delta * zoomFactor;
        next = Math.min(3, Math.max(0.3, next));
        return next;
      });
    } else {
      setPosition((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Center canvas on main node
  const centerMainNode = () => {
    if (!containerRef.current || !centerNode) return;
    const { width: vw, height: vh } = containerRef.current.getBoundingClientRect();
    const centerX = centerNode.position.x;
    const centerY = centerNode.position.y;
    const offsetX = vw / 2 - centerX * scale;
    const offsetY = vh / 2 - centerY * scale;
    setPosition({ x: offsetX, y: offsetY });
  };

  // Center on mount
  useEffect(() => {
    centerMainNode();
  }, [scale]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      className="relative w-screen h-screen overflow-hidden bg-gray-100 select-none cursor-default"
    >
      {/* Zoom Indicator + Controls */}
      <div className="absolute top-2 right-4 z-50 flex items-center gap-2">
        <div className="px-3 py-1 bg-white text-sm rounded shadow border border-gray-300">
          Zoom: {(scale * 100).toFixed(0)}%
        </div>
        <button
          className="px-2 py-1 text-sm bg-white border rounded shadow hover:bg-gray-200"
          onClick={() => setScale(1)}
        >
          Reset Zoom
        </button>
        <button
          className="px-2 py-1 text-sm bg-white border rounded shadow hover:bg-gray-200"
          onClick={centerMainNode}
        >
          Center
        </button>
      </div>

      {/* Mini-map */}
      <div className="absolute bottom-4 right-4 z-50 w-48 h-32 border border-gray-400 bg-white bg-opacity-80 rounded overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
          className="absolute top-0 left-0"
        >
          {/* Mini edges */}
          {nodes.map((child) => {
            const parent = nodes.find((n) => n.id === child.parentId);
            return parent ? (
              <line
                key={`${child.id}-${parent.id}`}
                x1={parent.position.x}
                y1={parent.position.y}
                x2={child.position.x}
                y2={child.position.y}
                stroke="gray"
                strokeWidth="1"
              />
            ) : null;
          })}
          {/* Mini nodes */}
          {nodes.map((node) => (
            <circle
              key={node.id}
              cx={node.position.x}
              cy={node.position.y}
              r="8"
              fill={node.color || "#000"}
            />
          ))}
        </svg>

        {/* Viewport box */}
        <div
          className="absolute border border-blue-500"
          style={{
            left: (-position.x / canvasSize.width) * 192,
            top: (-position.y / canvasSize.height) * 128,
            width: (window.innerWidth / scale / canvasSize.width) * 192,
            height: (window.innerHeight / scale / canvasSize.height) * 128,
          }}
        />
      </div>

      {/* Inner Canvas */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          width: canvasSize.width,
          height: canvasSize.height,
          position: "relative",
        }}
      >
        {/* Edges */}
        <svg
          className="absolute top-0 left-0 pointer-events-none z-0"
          style={{ width: "2000px", height: "2000px", overflow: "visible" }}
        >
          {nodes.map((child) => {
            const parent = nodes.find((n) => n.id === child.parentId);
            return parent ? (
              <Edge key={`${child.id}-${parent.id}`} from={parent} to={child} />
            ) : null;
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <MindMapNode key={node.id} node={node} onDrag={handleDragNode} />
        ))}
      </div>
    </div>
  );
};