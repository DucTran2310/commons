export const programingLanguages = {
  JAVASCRIPT: "javascript",
  REACTJS: "reactjs",
  PHP: "php",
  PYTHON: "python",
  VUE: "vue",
  RUBY: "ruby",
} as const;
export type IndividualLanguage =
  (typeof programingLanguages)[keyof typeof programingLanguages];
// type IndividualProgram = "php" | "python" | "vue" | "ruby"
