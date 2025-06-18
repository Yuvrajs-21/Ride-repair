import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Move cartographer logic inside a plugin-safe function
function getPlugins() {
  const plugins = [react(), runtimeErrorOverlay()];

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
  ) {
    try {
      const { cartographer } = require("@replit/vite-plugin-cartographer");
      plugins.push(cartographer());
    } catch (e) {
      console.warn("Failed to load cartographer plugin:", e);
    }
  }

  return plugins;
}

export default defineConfig({
  plugins: getPlugins(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
  root: __dirname, // Already in the client folder
  build: {
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
