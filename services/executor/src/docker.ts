import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import runnerPolicy from '../../../runner/execution-policy.json' with { type: 'json' };
export const runnerImage=runnerPolicy.image;
export async function docker(args:string[],options:{input?:string;signal?:AbortSignal;timeout?:number;maxBytes?:number}={}):Promise<string>{
 return new Promise((resolve,reject)=>{const child=spawn('docker',args,{env:{PATH:process.env.PATH,HOME:process.env.HOME},stdio:['pipe','pipe','pipe']});let output='',error='',bytes=0,done=false;const max=options.maxBytes||1048576;const kill=()=>child.kill('SIGKILL');const timer=setTimeout(kill,options.timeout||30000);const onAbort=()=>kill();options.signal?.addEventListener('abort',onAbort,{once:true});if(options.signal?.aborted)kill();
 for(const [stream,isError] of [[child.stdout,false],[child.stderr,true]] as const)stream.on('data',data=>{bytes+=data.length;if(bytes>max){kill();return;}if(isError)error+=data.toString();else output+=data.toString();});child.on('error',reject);child.on('exit',(code)=>{if(done)return;done=true;clearTimeout(timer);options.signal?.removeEventListener('abort',onAbort);if(options.signal?.aborted)return reject(Error('Cancelled'));if(bytes>max)return reject(Error('Output budget exceeded'));if(code!==0)return reject(Error(`Docker ${args[0]} failed: ${(error+output).slice(0,3000)}`));resolve(output.trim());});child.stdin.end(options.input);});
}
export const resourceArgs=['--read-only','--user','1000:1000','--cpus','1','--memory','512m','--memory-swap','512m','--pids-limit','64','--cap-drop','ALL','--security-opt','no-new-privileges','--tmpfs','/tmp:rw,noexec,nosuid,size=64m,uid=1000,gid=1000','--ulimit','fsize=10240:10240','--log-driver','none'];
export class ContainerScope {
 names:string[]=[];networks:string[]=[];
 async network(){const name=`azelf-${randomUUID()}`;await docker(['network','create','--internal',name]);this.networks.push(name);return name;}
 async start(args:string[]){const name=`azelf-${randomUUID()}`;this.names.push(name);await docker(['run','-d','--name',name,...resourceArgs,...args]);return name;}
 async cleanup(){for(const name of this.names.reverse())await docker(['rm','-f',name]).catch(()=>{});for(const name of this.networks.reverse())await docker(['network','rm',name]).catch(()=>{});}
}
