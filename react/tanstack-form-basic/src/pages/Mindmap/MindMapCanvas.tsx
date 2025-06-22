import { MindMapNode } from "./MindMapNode";
import { Edge } from "./Edge";
import { initialNodes } from "@/mock/mindmap.mock";

export const MindMapCanvas = () => {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {initialNodes.map((child) => {
          const parent = initialNodes.find((n) => n.id === child.parentId);
          return parent ? (
            <Edge key={`${child.id}-${parent.id}`} from={parent} to={child} />
          ) : null;
        })}
      </svg>

      {initialNodes.map((node) => (
        <MindMapNode key={node.id} node={node} />
      ))}
    </div>
  );
};