import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: ["src/**/*.spec.tsx"],
          name: "unit",
          environment: "jsdom",
        },
      },
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: ["src/**/*.browser.{test,spec}.tsx"],
          name: "browser",
          browser: {
            enabled: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
