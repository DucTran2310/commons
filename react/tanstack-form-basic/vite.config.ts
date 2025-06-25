import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import Terminal from "vite-plugin-terminal";
import chalk from 'chalk'

console.log(chalk.green('[INIT] Starting Vite Dev Server...'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // const cdnUrl = env.VITE_APP_CDN || '';

  return {
    plugins: [
      react(),
      Terminal({
        console: "terminal",
        output: ["terminal", "console"],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
    define: {
      "import.meta.env": env,
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          // đảm bảo không bật kiểu bỏ cú pháp value
          importsNotUsedAsValues: "remove",
          preserveValueImports: false,
        },
      },
    },
  };
});
