import type { MindMapNodeType } from "@/interfaces/mindmap.types";

// Utility functions for collision detection
export const getNodeBounds = (node: MindMapNodeType) => {
  // Estimate node dimensions (similar to Edge component)
  const charWidth = (node.fontSize || 14) * 0.6;
  const textWidth = node.title.length * charWidth;
  const padding = 32;
  const width = textWidth + padding;
  const height = (node.fontSize || 14) * 1.5 + 16;
  
  return {
    x: node.position.x,
    y: node.position.y,
    width,
    height
  };
};

export const checkNodeCollision = (node1: MindMapNodeType, node2: MindMapNodeType) => {
  if (node1.id === node2.id) return false;
  
  const rect1 = getNodeBounds(node1);
  const rect2 = getNodeBounds(node2);
  
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

export const checkEdgeCollision = (node: MindMapNodeType, from: MindMapNodeType, to: MindMapNodeType) => {
  // Simplified edge collision check (can be improved)
  const nodeRect = getNodeBounds(node);
  const edgeRect = {
    x: Math.min(from.position.x, to.position.x),
    y: Math.min(from.position.y, to.position.y),
    width: Math.abs(to.position.x - from.position.x),
    height: Math.abs(to.position.y - from.position.y)
  };
  
  return (
    nodeRect.x < edgeRect.x + edgeRect.width &&
    nodeRect.x + nodeRect.width > edgeRect.x &&
    nodeRect.y < edgeRect.y + edgeRect.height &&
    nodeRect.y + nodeRect.height > edgeRect.y
  );
};

const checkAllEdgeCollisions = (node: MindMapNodeType, nodes: MindMapNodeType[]) => {
  for (let i = 0; i < nodes.length; i++) {
    const parent = nodes[i];
    const children = nodes.filter(n => n.parentId === parent.id);
    
    for (const child of children) {
      if (checkEdgeCollision(node, parent, child)) {
        return true;
      }
    }
  }
  return false;
};

// Then update the findNearestValidPosition function to include edge checks
export const findNearestValidPosition = (
  node: MindMapNodeType,
  nodes: MindMapNodeType[],
  originalPos: { x: number; y: number },
  step = 20
) => {
  for (let radius = 1; radius < 10; radius++) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const x = originalPos.x + Math.cos(angle) * radius * step;
      const y = originalPos.y + Math.sin(angle) * radius * step;
      
      const testNode = { ...node, position: { x, y } };
      const collidesWithNode = nodes.some(otherNode => checkNodeCollision(testNode, otherNode));
      const collidesWithEdge = checkAllEdgeCollisions(testNode, nodes);
      
      if (!collidesWithNode && !collidesWithEdge) {
        return { x, y };
      }
    }
  }
  
  return originalPos;
};