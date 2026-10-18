import { defineConfig } from 'vitest/config';
export default defineConfig({test:{include:['evaluation/**/*.test.ts'],testTimeout:10000,pool:'forks',maxWorkers:2}});
