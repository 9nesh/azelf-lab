import { readFileSync } from 'node:fs';
const pid=Number(readFileSync('.azelf/lab.pid','utf8'));if(!Number.isInteger(pid)||pid<2)throw Error('Invalid Lab PID');process.kill(pid,'SIGTERM');console.log(`Stop requested for Lab PID ${pid}`);
