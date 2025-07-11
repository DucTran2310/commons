import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "todo_remote_app", // Nên đặt tên rõ ràng hơn
      filename: "remoteEntry.js",
      exposes: {
        "./TodoApp": "./src/App.tsx", // Export component chính
      },
      shared: [
        "react", 
        "react-dom",
        "@apollo/client",
      ], 
    }),
  ],
  server: {
    port: 5174,
    cors: true,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    assetsDir: "",
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "[name].js",
      },
    },
  },
});