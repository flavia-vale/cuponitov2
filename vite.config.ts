import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: false,
      quoteStyle: 'single',
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    fs: {
      allow: ['.', './node_modules', './src'],
    },
    // Garante que o roteador do TanStack gerencie os 404s no dev server
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});