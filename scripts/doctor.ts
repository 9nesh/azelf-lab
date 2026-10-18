import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
const checks = [['node',['--version']],['npm',['--version']],['git',['rev-parse','--is-inside-work-tree']],['docker',['info','--format','{{.ServerVersion}}']],['codex',['--version']],['codex',['login','status']],['gh',['auth','status']]] as const;
const results=checks.map(([tool,args])=>{const r=spawnSync(tool,[...args],{encoding:'utf8',timeout:10000});return {check:`${tool} ${args.join(' ')}`,status:r.status===0?'available':'unavailable',detail: tool === 'gh' ? 'Authentication checked; credentials omitted' : (r.stdout+r.stderr).replace(/gh[opsu]_[\w]+/g,'[REDACTED]').slice(0,600)};});
results.push({check:'protected isolated runner',status:'unavailable',detail:'Docker availability alone is insufficient. Canary, credential broker, egress and resource controls must pass before live repair or candidate code.'});
results.push({check:'repository publication target',status:process.env.AZELF_REPOSITORY_URL?'available':'unavailable',detail:'Requires explicit remote, exact verified candidate and trusted publisher.'});
mkdirSync('.azelf',{recursive:true});writeFileSync('.azelf/doctor.json',JSON.stringify({at:new Date().toISOString(),results},null,2));console.log(JSON.stringify(results,null,2));
