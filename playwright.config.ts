import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./evaluation/acceptance',testMatch:'**/*.spec.ts',workers:1,timeout:60000,use:{headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},reporter:[['list'],['json',{outputFile:'.azelf/acceptance-results.json'}]]});
