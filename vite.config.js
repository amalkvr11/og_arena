import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    host: true,
    open: true
  },
  
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@headlessui/react", "@heroicons/react"]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  },
  
  define: {
    "process.env": {}
  }
})
