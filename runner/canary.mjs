import { existsSync,readFileSync,writeFileSync,readdirSync } from 'node:fs';
const checks=[];
const denied=(id,fn)=>{try{fn();checks.push({id,status:'fail',reason:'Forbidden operation succeeded'});}catch{checks.push({id,status:'pass'});}};
denied('host_canary',()=>readFileSync(process.env.CANARY_PATH));
denied('protected_evaluation',()=>readdirSync('/evaluation'));
denied('publisher_credentials',()=>readFileSync('/run/secrets/fake-publisher-token'));
denied('model_credentials',()=>readFileSync('/run/secrets/codex-auth.json'));
denied('outside_export_write',()=>writeFileSync('/outside-export','test'));
denied('docker_socket',()=>readFileSync('/var/run/docker.sock'));
denied('evidence_write',()=>writeFileSync('/evidence/proof.json','tamper'));
try{await fetch('https://example.com',{signal:AbortSignal.timeout(1500)});checks.push({id:'unrelated_network',status:'fail'});}catch{checks.push({id:'unrelated_network',status:'pass'});}
checks.push({id:'unprivileged_uid',status:process.getuid()===1000?'pass':'fail'});
checks.push({id:'no_host_env',status:!process.env.GITHUB_TOKEN&&!process.env.OPENAI_API_KEY&&!process.env.AWS_ACCESS_KEY_ID?'pass':'fail'});
console.log(JSON.stringify(checks));if(checks.some(x=>x.status!=='pass'))process.exitCode=1;
