import type { MindMapNodeType } from "@/interfaces/mindmap.types";

export const initialNodes: MindMapNodeType[] = [
  {
    id: "center",
    title: "Central Topic",
    position: { x: 500, y: 300 },
    color: "#000033",
  },
  {
    id: "main1",
    title: "Main Topic 1",
    position: { x: 800, y: 200 },
    parentId: "center",
    color: "#f87171",
  },
  {
    id: "main2",
    title: "Main Topic 2",
    position: { x: 800, y: 350 },
    parentId: "center",
    color: "#fbbf24",
  },
  {
    id: "main3",
    title: "Main Topic 3",
    position: { x: 200, y: 250 },
    parentId: "center",
    color: "#34d399",
  },
  {
    id: "sub1",
    title: "Subtopic 1",
    position: { x: 200, y: 380 },
    parentId: "main3",
    color: "#facc15",
  },
];
