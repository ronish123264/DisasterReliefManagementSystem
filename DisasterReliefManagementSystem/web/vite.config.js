import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" keeps the build portable: dist/index.html can be opened
// from any path or served statically without absolute asset URLs.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
