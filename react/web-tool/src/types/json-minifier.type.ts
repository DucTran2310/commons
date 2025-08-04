export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
}

export interface HistoryJsonProps {
  history: HistoryItem[];
  setInputJson: (input: string) => void;
  setOutputJson: (output: string) => void;
}

export interface Options {
  removeWhitespace: boolean
  removeLineBreaks: boolean
  removeComments: boolean
  prettyPrint: boolean
}

export interface MinifiOptionsProps {
  options: Options
  setOptions: React.Dispatch<React.SetStateAction<Options>>
}
