import { spawnSync } from 'node:child_process';
import { readFileSync,readdirSync,lstatSync } from 'node:fs';
import { join } from 'node:path';
import { hash,policy } from '../../../packages/contracts/policy.ts';
export function validatePatch(patch:string){
 if(!patch.trim()||Buffer.byteLength(patch)>policy.maxPatchBytes||patch.includes('\0')||patch.includes('\r')||Buffer.from(patch).toString('utf8')!==patch)throw Error('Empty, oversized or malformed patch');
 const headers=patch.split('\n').filter(line=>line.startsWith('diff --git '));if(headers.length!==1||headers[0]!=='diff --git a/src/integrations/permits.ts b/src/integrations/permits.ts')throw Error('Patch must modify only the authorized adapter');
 if(/^(new file mode|deleted file mode|old mode|new mode|rename |copy |similarity |GIT binary patch|Binary files|--- (?!a\/src\/integrations\/permits\.ts$)|\+\+\+ (?!b\/src\/integrations\/permits\.ts$))/m.test(patch))throw Error('Modes, renames, binary and unexpected paths forbidden');
 if(!patch.includes('\n--- a/src/integrations/permits.ts\n+++ b/src/integrations/permits.ts\n@@'))throw Error('Patch anatomy invalid');return hash(patch);
}
export function applyPatch(workspace:string,patch:string,expectedHash:string){if(validatePatch(patch)!==expectedHash)throw Error('Patch hash mismatch');const result=spawnSync('git',['apply','--check','--whitespace=error','-'],{cwd:workspace,input:patch,encoding:'utf8'});if(result.status!==0)throw Error(`Patch does not apply exactly: ${result.stderr.slice(0,1000)}`);const apply=spawnSync('git',['apply','--whitespace=error','-'],{cwd:workspace,input:patch,encoding:'utf8'});if(apply.status!==0)throw Error('Patch apply failed');}
export function validateTree(workspace:string,manifest:{files:{path:string;sha256:string}[]}){for(const file of manifest.files){const target=join(workspace,file.path);const stat=lstatSync(target);if(!stat.isFile()||stat.isSymbolicLink())throw Error('Source file type changed');if(file.path!=='src/integrations/permits.ts'&&hash(readFileSync(target))!==file.sha256)throw Error('Protected source changed');}
 const changed=spawnSync('git',['status','--porcelain','--untracked-files=all'],{cwd:workspace,encoding:'utf8'});if(changed.status!==0||changed.stdout.trim()!=='M src/integrations/permits.ts')throw Error('Unexpected tree changes or empty candidate');
 const tree=spawnSync('git',['diff','--binary','HEAD'],{cwd:workspace,encoding:'utf8'});validatePatch(tree.stdout);return {patchHash:hash(tree.stdout),adapterHash:hash(readFileSync(join(workspace,'src/integrations/permits.ts'))),treeHash:hash(JSON.stringify(manifest.files.map(file=>({path:file.path,sha256:hash(readFileSync(join(workspace,file.path)))}))))};
}
