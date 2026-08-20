import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * Configuración de ESLint.
 *
 * No existía. El CI corría `next lint` sin tener eslint instalado, así que
 * fallaba en el primer paso y ni los tipos, ni las pruebas, ni el build
 * llegaban a ejecutarse: el CI daba rojo siempre y no verificaba nada.
 *
 * Se usa la CLI de eslint en vez de `next lint`, que está deprecado y se
 * elimina en Next 16.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Las pruebas corren con el TypeScript nativo de Node, fuera del bundle de
    // Next: no aplican las reglas pensadas para componentes del navegador.
    files: ["pruebas/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default config;
