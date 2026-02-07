import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
  ],
  server: {
    port: 8000
  }
});