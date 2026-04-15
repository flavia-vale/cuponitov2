// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsconfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  server: {
    // Este preset configura o Vinxi para gerar o output compatível com Cloudflare Pages automaticamente
    preset: "cloudflare-pages"
  },
  vite: {
    plugins: [
      tsconfigPaths()
    ]
  }
});
export {
  app_config_default as default
};
