import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    watch: false,
    attachmentsDir: "artifacts/vitest/attachments",
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
