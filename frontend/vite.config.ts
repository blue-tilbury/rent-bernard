import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  plugins: [svgr(), react()],
  server: {
    // this sets a default port to 3000
    port: 3000,
    host: true,
  },
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*.test.ts"],
    },
  },
});
