import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
let build = 'dev';
try { build = execSync('git rev-parse --short HEAD').toString().trim() + (execSync('git status --porcelain --untracked-files=no').toString().trim() ? '+' : ''); } catch { /* not a git checkout */ }
// base defaults to './' so dist/ works from any folder or sub-path; CI sets BASE=/<repo>/ for GitHub Pages.
export default defineConfig({ base: process.env.BASE || './', define: { __BUILD__: JSON.stringify(build) }, build: { outDir: 'dist', assetsInlineLimit: 0 } });
