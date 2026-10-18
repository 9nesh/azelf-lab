import { spawn } from 'node:child_process';
import { mkdirSync,writeFileSync,rmSync } from 'node:fs';
import { Store } from '../services/control/src/store.ts';
import { Controller } from '../services/control/src/controller.ts';
import { controlServer } from '../services/control/src/http.ts';
import { listen,close } from './net.ts';
const store=new Store(process.env.AZELF_DATA_DIRECTORY||'.azelf');const controller=new Controller(store);const api=controlServer(controller);
await listen(api,Number(process.env.AZELF_CONTROL_PORT||4100));
const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5173','--strictPort'],{stdio:'inherit',env:{PATH:process.env.PATH,NODE_ENV:'development'}});
mkdirSync('.azelf',{recursive:true});writeFileSync('.azelf/lab.pid',String(process.pid));
console.log('Azelf Lab: http://127.0.0.1:5173/lab · control bound to loopback');
let stopping=false;async function stop(){if(stopping)return;stopping=true;vite.kill('SIGTERM');for(const id of controller.pending)await controller.cancel(id);await controller.harness.stop();await close(api);store.db.close();rmSync('.azelf/lab.pid',{force:true});process.exit(0);}
process.on('SIGTERM',stop);process.on('SIGINT',stop);vite.on('exit',()=>{if(!stopping)void stop();});
