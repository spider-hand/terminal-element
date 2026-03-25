import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    minify: "esbuild",
    lib: {
      entry: "src/terminal-element.ts",
      name: "terminal-element",
      formats: ["es"],
      fileName: (format) => `terminal-element.${format}.js`,
    },
    rollupOptions: {
      external: ["lit", "lit/decorators.js"],
    },
  },
  publicDir: false,
});
