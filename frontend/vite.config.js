import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During local dev (`npm run dev`), forward API calls to the FastAPI
      // backend running on port 8000 (see backend/README or render.yaml).
      "/api": "http://localhost:8000",
    },
  },
  build: {
    outDir: "dist",
  },
});
