import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: { overlay: false },
    proxy: {
      "/api/chat": {
        target: "https://openrouter.ai/api/v1/chat/completions",
        changeOrigin: true,
        rewrite: () => "",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const apiKey = process.env.VITE_OPENROUTER_API_KEY ||
              "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";
            proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
            proxyReq.setHeader("HTTP-Referer", "http://localhost:3000");
            proxyReq.setHeader("X-Title", "OMNI Expert");
          });
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime",
             "@tanstack/react-query", "@tanstack/query-core"],
  },
});
