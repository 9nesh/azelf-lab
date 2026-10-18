import { mkdtempSync,writeFileSync,mkdirSync,rmSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { tmpdir } from 'node:os';
import { docker,resourceArgs,runnerImage } from '../services/executor/src/docker.ts';
import { randomUUID } from 'node:crypto';
const dir=mkdtempSync(join(tmpdir(),'azelf-canary-'));const canary=join(dir,'host-canary');writeFileSync(canary,'SYNTHETIC NOT A SECRET');const evidence=join(dir,'evidence');mkdirSync(evidence);writeFileSync(join(evidence,'proof.json'),'read-only');const name=`azelf-canary-${randomUUID()}`;
try{const result=await docker(['run','--name',name,'--network','none',...resourceArgs,'--env',`CANARY_PATH=${canary}`,'--mount',`type=bind,src=${resolve('runner/canary.mjs')},dst=/canary.mjs,readonly`,'--mount',`type=bind,src=${evidence},dst=/evidence,readonly`,runnerImage,'node','/canary.mjs']);const checks=JSON.parse(result);mkdirSync('.azelf',{recursive:true});writeFileSync('.azelf/isolation-report.json',JSON.stringify({at:new Date().toISOString(),image:runnerImage,scope:'network-none verifier boundary; model broker not yet proven',checks},null,2));console.log(result);}finally{await docker(['rm','-f',name]).catch(()=>{});rmSync(dir,{recursive:true,force:true});}
