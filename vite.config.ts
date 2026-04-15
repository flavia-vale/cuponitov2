import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      routesDirectory: "./src/routes", // Força o diretório correto
      generatedRouteTree: "./src/routeTree.gen.ts", // Garante o destino do mapa
      autoCodeSplitting: true, 
      quoteStyle: 'single', // Padroniza as aspas para o crawler do DYAD
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});