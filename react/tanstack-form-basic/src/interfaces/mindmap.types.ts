export type MindMapNodeType = {
  id: string;
  title: string;
  position: { x: number; y: number };
  parentId?: string;
  color?: string;
};
