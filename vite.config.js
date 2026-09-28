import { defineConfig } from "vite";
import { resolve } from "node:path";
import { cpSync, mkdirSync } from "node:fs";
export default defineConfig({
  base: "./",
  plugins: [
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
        members: resolve("members.html"),
        privacy: resolve("privacy.html"),
        terms: resolve("terms.html"),
        legal: resolve("legal.html"),
        cookies: resolve("cookies.html"),
        accessibility: resolve("accessibility.html"),
        admin: resolve("admin/index.html"),
      },
    },
  },
});
