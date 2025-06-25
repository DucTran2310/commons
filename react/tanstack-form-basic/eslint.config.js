import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
      prettier: pluginPrettier,
    },
    rules: {
      "semi": ["error", "always"],
      "prettier/prettier": ["error", { printWidth: 150 }],
      "max-len": ["error", { code: 160 }],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      // "no-console": "warn",
      // "no-debugger": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "no-var": "error",
      "prefer-template": "error",
      "no-trailing-spaces": "error",
      "spaced-comment": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "no-duplicate-imports": "error",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "no-useless-constructor": "error",
      "dot-notation": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
];