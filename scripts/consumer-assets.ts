import { buildSync } from 'esbuild';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
export function buildConsumerAssets(sourceDirectory:string,destination:string){mkdirSync(resolve(destination,'..'),{recursive:true});buildSync({entryPoints:[resolve(sourceDirectory,'src/ui/main.tsx')],bundle:true,platform:'browser',format:'esm',target:'es2022',minify:true,jsx:'automatic',outfile:destination,nodePaths:[resolve('node_modules')],define:{'process.env.NODE_ENV':'"production"'}});}
