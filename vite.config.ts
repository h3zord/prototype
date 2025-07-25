import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: true,
  },

  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
