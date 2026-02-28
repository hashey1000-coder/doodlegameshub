import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false, // Modern browsers support modulepreload natively
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: React core in its own chunk (rarely changes → long cache)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Radix UI components in one chunk
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-ui';
          }
          // Icons
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          // Charts/carousel (only used on some pages)
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/embla-carousel')) {
            return 'charts-carousel';
          }
          // Confetti (only triggered on interaction)
          if (id.includes('node_modules/canvas-confetti/')) {
            return 'confetti';
          }
        },
      },
    },
    // Translations are now lazy-loaded, so chunks should be much smaller
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
