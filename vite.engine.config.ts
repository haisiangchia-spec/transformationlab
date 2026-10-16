import { defineConfig } from "vite";
export default defineConfig({
  build: {
    outDir: "dist-engine",
    lib: {
      entry: "src/engine/index.ts",
      formats: ["es"],
      fileName: "school-transformation-engine",
    },
  },
});
