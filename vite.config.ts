import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    fresh({
      ignore: [/pocketbase/]
    }),
    tailwindcss(),
  ],
  server: {
    port: 8000,
    watch: {
      ignored: [/[/\\]pocketbase([/\\]|$)/],
    },
  }
});