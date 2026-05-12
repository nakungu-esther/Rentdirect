import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript supplies prop types; PropTypes on forwardRef UI primitives are redundant.
      "react/prop-types": "off",
    },
  },
];
