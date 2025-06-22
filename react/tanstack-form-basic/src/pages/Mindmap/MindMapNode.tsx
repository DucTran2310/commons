import type { MindMapNodeType } from "@/interfaces/mindmap.types";

type MindMapNodeProps = {
  node: MindMapNodeType;
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({ node }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        background: node.color ?? "#fff",
        color: "white",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {node.title}
    </div>
  );
};