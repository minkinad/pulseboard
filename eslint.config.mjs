import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);
const compat = new FlatCompat({
  baseDirectory: currentDirectory,
});

const eslintConfig = compat.config({
  extends: ["next/core-web-vitals", "next/typescript"],
});

const config = [
  {
    ignores: [".next/**", "out/**", "next-env.d.ts"],
  },
  ...eslintConfig,
];

export default config;
