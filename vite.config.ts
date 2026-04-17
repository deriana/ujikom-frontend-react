import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "HRIS Hideri App",
        short_name: "HRIS",
        description: "Human Resource Information System Ujikom",
        theme_color: "#4f46e5",
        background_color: "#312e81",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    visualizer({ open: true, filename: "bundle-stats.html" }) as any,
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    allowedHosts: [".ngrok-free.app"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // FIX: Gabungkan semua core dependencies React agar tidak "unstable_now"
            if (
              id.includes("react") || 
              id.includes("react-dom") || 
              id.includes("scheduler") || 
              id.includes("react-router")
            ) {
              return "react-core";
            }
            
            // Pisahkan library raksasa sesuai kebutuhan
            if (id.includes("face-api.js")) return "vendor-ai-face";
            if (id.includes("leaflet")) return "vendor-maps";
            if (id.includes("apexcharts") || id.includes("chart.js")) return "vendor-charts";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("axios") || id.includes("tanstack")) return "network";
            
            // Sisanya masuk ke vendor umum
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});