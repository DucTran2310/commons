export interface JSONNodeProps {
  data: any;
  name?: string;
  level?: number;
  searchTerm?: string;
  allExpanded?: boolean;
  theme?: 'light' | 'dark';
}