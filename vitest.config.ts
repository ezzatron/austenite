import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
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
