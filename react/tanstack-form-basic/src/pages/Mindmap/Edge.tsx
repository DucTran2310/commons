import type { MindMapNodeType } from "@/interfaces/mindmap.types";

type EdgeProps = {
  from: MindMapNodeType;
  to: MindMapNodeType;
};

export const Edge: React.FC<EdgeProps> = ({ from, to }) => {
  const startX = from.position.x + 80;
  const startY = from.position.y + 20;
  const endX = to.position.x;
  const endY = to.position.y + 20;
  const path = `
    M ${startX} ${startY}
    C ${(startX + endX) / 2} ${startY},
      ${(startX + endX) / 2} ${endY},
      ${endX} ${endY}
  `;

  return <path d={path} stroke="gray" fill="none" strokeWidth={2} />;
};
