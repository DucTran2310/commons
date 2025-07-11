import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    plugins: [
      react(),
      federation({
        name: "host_app",
        remotes: {
          todo_remote: "http://localhost:5174/remoteEntry.js",
        },
        shared: [
          "react",
          "react-dom",
          "@apollo/client",
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
    build: {
      target: "esnext",
      modulePreload: false,
    },
  };
});