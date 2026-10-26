import { defineConfig } from 'vite';
// base defaults to './' so dist/ works from any folder or sub-path; CI sets BASE=/<repo>/ for GitHub Pages.
export default defineConfig({ base: process.env.BASE || './', build: { outDir: 'dist', assetsInlineLimit: 0 } });
