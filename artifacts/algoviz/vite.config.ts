import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";



// PORT environment variable check
const rawPort = process.env.PORT;
if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided."
  );
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH environment variable check
const basePath = process.env.BASE_PATH;
if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided."
  );
}

// ✅ Edited Vite config for local Windows usage
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // Removed Replit-specific plugins for local development
  ],
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
    "@assets": path.resolve(__dirname, "..", "..", "attached_assets"),
  },
  dedupe: ["react", "react-dom"],
},
  root: path.resolve(import.meta.url),
  build: {
    outDir: path.resolve(import.meta.url, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});