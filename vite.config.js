import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { cpSync, mkdirSync } from "node:fs";
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "copy-static-assets",
      closeBundle() {
        mkdirSync("dist/assets", { recursive: true });
        cpSync("assets", "dist/assets", { recursive: true });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        physicians: resolve("physicians.html"),
        partners: resolve("partners.html"),
        about: resolve("about.html"),
        admin: resolve("admin/index.html"),
      },
    },
  },
});
