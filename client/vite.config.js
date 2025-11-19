import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Upewnia React/Vite że działa poprawnie na Render/Replit
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
