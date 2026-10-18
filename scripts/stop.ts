import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const pid=Number(readFileSync('.azelf/lab.pid','utf8'));if(!Number.isInteger(pid)||pid<2)throw Error('Invalid Lab PID');const command=execFileSync('ps',['-p',String(pid),'-o','command='],{encoding:'utf8'});if(!command.includes('scripts/lab.ts'))throw Error('PID no longer identifies Azelf Lab; refusing to signal unrelated process');process.kill(pid,'SIGTERM');console.log(`Stop requested for Lab PID ${pid}`);
