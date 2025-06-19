import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] }, // Hỗ trợ TypeScript nếu cần
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: { 
      react: { 
        version: "detect" // 👈 Thêm vào đây để ESLint tự động lấy phiên bản React từ package.json
      } 
    },
    rules: {
      "react/prop-types": "off", 
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn"], 
      "no-multi-spaces": "error", 
      "space-in-parens": ["error", "never"], 
      "semi": ["error", "always"], 
      "prettier/prettier": "error", 
      "no-multiple-empty-lines": ["error", { "max": 1 }], 
      "max-len": ["error", { "code": 150, "ignoreStrings": true, "ignoreTemplateLiterals": true, "ignoreComments": true }], 
      "prettier/prettier": ["error", { "printWidth": 150 }],
    
      // 🔥 Rule nâng cao
      "eqeqeq": ["error", "always"], 
      "curly": ["error", "all"], 
      "no-console": "warn", 
      "no-debugger": "error", 
      "prefer-const": "error", 
      "arrow-spacing": ["error", { "before": true, "after": true }], 
      "object-curly-spacing": ["error", "always"], 
      "array-bracket-spacing": ["error", "never"], 
      "no-var": "error", 
      "prefer-template": "error", 
      "no-trailing-spaces": "error", 
      "spaced-comment": ["error", "always"], 
      "keyword-spacing": ["error", { "before": true, "after": true }], 
      "no-duplicate-imports": "error", 
      "sort-imports": ["error", { "ignoreDeclarationSort": true }], 
      "no-useless-constructor": "error",
      "dot-notation": "error", 
    },
    plugins: {
      prettier: pluginPrettier, // 👈 Thêm plugin Prettier vào để hỗ trợ fix lỗi
    }
  },
];