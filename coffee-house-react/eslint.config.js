// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser, // 👈 defines RequestInit, fetch, etc.
            },
        },
        plugins: {
            react,
            "@typescript-eslint": ts,
        },
        rules: {
            "no-undef": "off", // optional if you rely on TS type checking
        },
    },
];
