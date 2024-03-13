import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["./test/suite/**/*.spec.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
