import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [{ find: "~", replacement: "/src" }],
    },
    build: {
        rollupOptions: {
            input: {
                main: "./index.html",
            }
        }
    },
    plugins: [
        react(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
        },
    },
});
