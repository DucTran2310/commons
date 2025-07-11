export interface MindMapNodeType {
  id: string;
  title: string;
  parentId?: string | null;
  position: { x: number; y: number };
  color?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  icon?: string;
  borderColor?: string;
  borderWidth?: number;
  shape?: string; // Add this line
}