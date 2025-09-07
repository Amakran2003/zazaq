import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // Utiliser la racine pour les chemins sur GitHub Pages
  server: {
    host: "::",
    port: 2222,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    outDir: "dist",
    // Assurer que les types MIME sont correctement définis
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
