import { buildConsumerAssets } from '../../../scripts/consumer-assets.ts';
import { execFileSync } from 'node:child_process';
import { mkdirSync,writeFileSync,lstatSync,readdirSync,readFileSync } from 'node:fs';
import { join,resolve } from 'node:path';
import { hash,policyHash } from '../../../packages/contracts/policy.ts';
const files=['package.json','src/ui/main.tsx','src/integrations/permits.ts','src/model/permit.ts','src/server/server.ts','src/ui/index.html','src/ui/style.css'];
export function exportConsumer(baseCommit:string,destination:string){if(!/^[a-f0-9]{40}$/.test(baseCommit))throw Error('Invalid baseline commit');mkdirSync(destination,{recursive:true});for(const file of files){const path=join(destination,file);mkdirSync(resolve(path,'..'),{recursive:true});const mode=execFileSync('git',['ls-tree',baseCommit,`apps/consumer/${file}`],{encoding:'utf8'});if(!mode.startsWith('100644 '))throw Error('Baseline export rejects non-regular source');const contents=execFileSync('git',['show',`${baseCommit}:apps/consumer/${file}`]);writeFileSync(path,contents,{mode:file==='src/integrations/permits.ts'?0o644:0o444});}
 buildConsumerAssets(destination,join(destination,'runtime-assets/app.js'));
 const cleanEnv={PATH:process.env.PATH!,HOME:destination,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'};
 execFileSync('git',['init','-b','repair'],{cwd:destination,env:cleanEnv,stdio:'ignore'});execFileSync('git',['add','.'],{cwd:destination,env:cleanEnv});execFileSync('git',['-c','user.name=Azelf','-c','user.email=azelf@localhost','commit','-m','Consumer-only baseline'],{cwd:destination,env:cleanEnv,stdio:'ignore'});
 return {baseCommit,policyHash,files:[...files,'runtime-assets/app.js'].map(path=>({path,sha256:hash(readFileSync(join(destination,path)))}))};
}
export function assertExport(directory:string){const walk=(path:string):string[]=>readdirSync(path).flatMap(name=>{const target=join(path,name);const stat=lstatSync(target);if(stat.isSymbolicLink())throw Error('Symlink rejected');return stat.isDirectory()?walk(target):[target];});const all=walk(directory);if(all.some(x=>/evaluation|scenario|auth\.json|AGENTS\.md|BUILD_GUIDE/.test(x.slice(directory.length))))throw Error('Protected content leaked');return all;}
