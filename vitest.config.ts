import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    watch: false,
    include: ["test/suite/**/*.spec.ts"],
    setupFiles: ["test/setup.ts"],
    typecheck: {
      enabled: true,
    },
    coverage: {
      include: ["src/**/*.ts"],
    },
  },
});
