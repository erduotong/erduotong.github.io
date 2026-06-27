import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import json from "@eslint/json";
import css from "@eslint/css";
import {defineConfig, globalIgnores} from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default defineConfig([
    globalIgnores([".astro/**", "dist/**", "node_modules/**"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
        plugins: {js},
        extends: ["js/recommended"],
        languageOptions: {globals: {...globals.browser, ...globals.node}}
    },
    {
        files: ["**/*.{ts,mts,cts,vue}"],
        extends: [tseslint.configs.recommended]
    },
    {
        files: ["**/*.vue"],
        extends: [pluginVue.configs["flat/essential"]],
        languageOptions: {parserOptions: {parser: tseslint.parser}}
    },
    {files: ["**/*.json"], plugins: {json}, language: "json/json", extends: ["json/recommended"]},
    {files: ["**/*.jsonc"], plugins: {json}, language: "json/jsonc", extends: ["json/recommended"]},
    {files: ["**/*.json5"], plugins: {json}, language: "json/json5", extends: ["json/recommended"]},
    {files: ["**/*.css"], plugins: {css}, language: "css/css", extends: ["css/recommended"]},
    ...eslintPluginAstro.configs.recommended,
]);