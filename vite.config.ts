import { defineConfig } from 'vite';
// Library build for milestone 1; browser entry and React screens come later.
export default defineConfig({ build: { lib: { entry: 'src/engine/index.ts', formats: ['es'], fileName: 'school-transformation-engine' } } });
