export interface JSONNodeProps {
  data: any;
  name?: string;
  level?: number;
  searchTerm?: string;
  allExpanded?: boolean;
  theme?: 'light' | 'dark';
}

export interface JSONInputProps {
  input: string;
  setInput: (value: string) => void;
  valid: boolean;
  handleInputScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  error: { message: string; position?: number } | null;
}

export interface JSONOutputProps {
  valid: boolean;
  outputObj: any;
  searchTerm: string;
  allExpanded: boolean;
  theme: string;
}
