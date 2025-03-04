
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import cartographerPlugin from '@replit/vite-plugin-cartographer';
import { themeJsonPlugin } from '@replit/vite-plugin-shadcn-theme-json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cartographerPlugin(),
    themeJsonPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  // Base path for GitHub Pages
  base: './',
  // Define environment
  define: {
    'process.env.NODE_ENV': JSON.stringify('static')
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
      },
    },
  },
});
