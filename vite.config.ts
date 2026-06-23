import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "crypto", "stream", "util", "process", "path"],
      globals: {
        Buffer: true,
        process: true,
      },
    }),
  ],
  
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
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@headlessui/react", "@heroicons/react"],
          ethers: ["ethers"],
          ogstorage: ["@0gfoundation/0g-storage-ts-sdk"]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      ignore: ["fs"]
    }
  },
  
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "ethers"],
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  
  define: {
    "process.env": {},
    global: "globalThis"
  }
})
