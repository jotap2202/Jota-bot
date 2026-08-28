import nextPlugin from "eslint-config-next";

export default [
  {
    ignores: [".next", "node_modules"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...nextPlugin,
  },
];
