import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended, // ESLint's built-in recommended rules
  prettierConfig, // disables ESLint rules that conflict with Prettier
  {
    languageOptions: {
      globals: {
        ...globals.browser, // document, window, fetch, alert, etc.
      },
    },
    rules: {
      "no-unused-vars": "warn", // warn, not error — less noise while learning
      "no-console": "off", // console.log freely during development
    },
  },
];
