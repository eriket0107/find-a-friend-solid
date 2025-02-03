import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: { globals: globals.node },
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-require-imports": "error",
      eqeqeq: "off",
      "no-unused-vars": "error",
      "prefer-const": ["error", { "ignoreReadBeforeAssign": true }],
      semi: ["error", "always"],
      "no-unused-expressions": "error",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
