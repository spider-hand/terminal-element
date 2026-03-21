// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import eslintPluginLit from "eslint-plugin-lit";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([{
  files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  plugins: { js },
  extends: ["js/recommended"],
  languageOptions: { globals: globals.browser },
}, tseslint.configs.recommended, eslintPluginLit.configs["flat/recommended"], eslintConfigPrettier, {
  files: ["**/*.css"],
  plugins: { css },
  language: "css/css",
  extends: ["css/recommended"],
}, ...storybook.configs["flat/recommended"]]);
