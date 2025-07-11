import type { MindMapNodeType } from "@/interfaces/mindmap.types";

type EdgeProps = {
  from: MindMapNodeType;
  to: MindMapNodeType;
};

export const Edge: React.FC<EdgeProps> = ({ from, to }) => {
  // More accurate node dimension estimation
  const getNodeCenter = (node: MindMapNodeType) => {
    // Estimate width based on text length, font size, and padding
    const charWidth = (node.fontSize || 14) * 0.6;
    const textWidth = node.title.length * charWidth;
    const padding = 32; // Total horizontal padding
    const width = textWidth + padding;
    
    // Estimate height based on line height and padding
    const height = (node.fontSize || 14) * 1.5 + 16; // 1.5 line-height + vertical padding
    
    return {
      x: node.position.x + (node.textAlign === 'center' ? width/2 : 
           node.textAlign === 'right' ? width : 0),
      y: node.position.y + height/2
    };
  };

  const fromCenter = getNodeCenter(from);
  const toCenter = getNodeCenter(to);
  
  // Smoother bezier curve calculation
  const controlPoint1 = {
    x: fromCenter.x + (toCenter.x - fromCenter.x) * 0.5,
    y: fromCenter.y
  };
  
  const controlPoint2 = {
    x: fromCenter.x + (toCenter.x - fromCenter.x) * 0.5,
    y: toCenter.y
  };

  const path = `
    M ${fromCenter.x} ${fromCenter.y}
    C ${controlPoint1.x} ${controlPoint1.y},
      ${controlPoint2.x} ${controlPoint2.y},
      ${toCenter.x} ${toCenter.y}
  `;

  return <path 
    d={path} 
    stroke="gray" 
    fill="none" 
    strokeWidth={2 / Math.max(1, 1)} // Adjust for zoom if needed
    style={{ transition: 'all 0.15s ease-out' }} // Smoother transition
  />;
};