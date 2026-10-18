import { execFileSync } from 'node:child_process';
import { mkdtempSync,writeFileSync,readFileSync,rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { policyHash,hash } from '../../../packages/contracts/policy.ts';
import { validatePatch } from '../../verifier/src/patch.ts';
import { evaluatorBundleHash } from '../../verifier/src/identity.ts';
import { runnerImage } from '../../executor/src/docker.ts';
import { validateExistingHead } from './reconciliation.ts';
import type { Store } from '../../control/src/store.ts';
const repo='9nesh/azelf-lab';
const verificationSchema=z.object({status:z.literal('pass'),baseCommit:z.string().regex(/^[a-f0-9]{40}$/),patchHash:z.string().regex(/^[a-f0-9]{64}$/),policyHash:z.literal(policyHash),candidateIdentity:z.object({adapterHash:z.string().regex(/^[a-f0-9]{64}$/),treeHash:z.string().regex(/^[a-f0-9]{64}$/)}),evaluatorHash:z.string(),alternateEvaluatorHash:z.string(),evaluatorBundleHash:z.string(),dependencyLockHash:z.string(),runnerImage:z.string(),vendorVersion:z.string(),checks:z.array(z.object({id:z.string(),status:z.literal('pass')}).passthrough()).min(10),coverageGaps:z.array(z.string()),at:z.string().datetime()});
function trusted(command:string,args:string[],cwd?:string,options:{input?:string;date?:string}={}){
 return execFileSync(command,args,{cwd,input:options.input,encoding:'utf8',timeout:30000,maxBuffer:2*1024*1024,env:{PATH:process.env.PATH,HOME:process.env.HOME,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_TERMINAL_PROMPT:'0',...(options.date?{GIT_AUTHOR_DATE:options.date,GIT_COMMITTER_DATE:options.date}:{})}}).trim();
}
function api(path:string){return JSON.parse(trusted('gh',['api',`repos/${repo}/${path}`]));}
function remoteRef(directory:string,branch:string){return trusted('git',['-c','credential.helper=!gh auth git-credential','ls-remote','origin',`refs/heads/${branch}`],directory).split(/\s/)[0]||null;}
function pushRef(directory:string,branch:string,head:string){const existing=remoteRef(directory,branch);if(existing&&existing!==head)throw Error(`Existing ${branch} differs; refusing overwrite`);if(!existing)trusted('git',['-c','credential.helper=!gh auth git-credential','push','origin',`${head}:refs/heads/${branch}`],directory);}
export function validateVerificationContext(verification:any,expected:{evaluator:string;alternate:string;bundle:string;dependencies:string;runner:string;vendor:string}){
 if(verification.evaluatorHash!==expected.evaluator||verification.alternateEvaluatorHash!==expected.alternate||verification.evaluatorBundleHash!==expected.bundle||verification.dependencyLockHash!==expected.dependencies)throw Error('Evaluator, alternate truth, protected implementation or dependencies changed; verification stale');
 if(verification.runnerImage!==expected.runner||verification.vendorVersion!==expected.vendor)throw Error('Verification runner or pinned vendor differs from task context');
}
export class Publisher {
 constructor(private store:Store){}
 async publish(runId:string){
  const run=this.store.get(runId),task=run.task as any;
  if(!task||task.state!=='awaiting_approval'||run.executor!=='codex')throw Error('Publication requires a live runtime candidate in awaiting_approval');
  const verificationArtifact=this.store.readArtifact(task.verificationArtifactId);
  if(verificationArtifact.metadata.provenance.kind!=='trusted-verifier'||verificationArtifact.metadata.provenance.taskId!==task.id)throw Error('Untrusted verification provenance');
  const verification=verificationSchema.parse(verificationArtifact.value);
  const patchArtifact=this.store.readArtifact(task.patchArtifactId),patch=z.object({patch:z.string()}).parse(patchArtifact.value).patch;
  if(patchArtifact.metadata.provenance.kind!=='runtime-patch'||patchArtifact.metadata.provenance.taskId!==task.id)throw Error('Untrusted patch provenance');
  const inputArtifact=this.store.readArtifact(task.inputManifestHash);
  if(inputArtifact.metadata.provenance.kind!=='agent-input'||inputArtifact.value.baseCommit!==task.baseCommit)throw Error('Task input manifest differs from baseline');
  const pinnedVendor=z.string().regex(/^v[0-9]+(?:-[a-z]+)?$/).parse(inputArtifact.value.current.response.vendorVersion);
  const baselineRunner=JSON.parse(trusted('git',['show',`${verification.baseCommit}:runner/execution-policy.json`])).image;
  if(baselineRunner!==runnerImage)throw Error('Runner policy changed since task baseline');
  if((task.vendorVersion&&task.vendorVersion!==pinnedVendor)||(task.runnerImage&&task.runnerImage!==baselineRunner))throw Error('Task environment identity mismatch');
  validateVerificationContext(verification,{evaluator:hash(readFileSync('evaluation/contracts/permits.ts')),alternate:hash(readFileSync('evaluation/contracts/alternate.ts')),bundle:evaluatorBundleHash(),dependencies:hash(readFileSync('package-lock.json')),runner:baselineRunner,vendor:pinnedVendor});
  if(validatePatch(patch)!==verification.patchHash||task.baseCommit!==verification.baseCommit||task.policyHash!==policyHash||run.policyHash!==policyHash||inputArtifact.value.policyHash!==policyHash)throw Error('Candidate/policy/patch identity mismatch');
  const remoteHead=api('git/ref/heads/main').object.sha;
  if(remoteHead!==verification.baseCommit)throw Error('Remote baseline moved; create a newly scoped verification rather than reusing old proof');
  const branch=`azelf/repair-${task.id}-${verification.candidateIdentity.adapterHash.slice(0,12)}`;
  const directory=mkdtempSync(join(tmpdir(),'azelf-trusted-publisher-'));
  try{
   trusted('git',['-c','core.hooksPath=/dev/null','-c','credential.helper=!gh auth git-credential','clone','--no-checkout',`https://github.com/${repo}.git`,directory]);
   trusted('git',['checkout','-b',branch,verification.baseCommit],directory);
   const patchFile=join(directory,'.azelf-approved.patch');writeFileSync(patchFile,patch,{mode:0o600});
   trusted('git',['apply','--check','--directory=apps/consumer',patchFile],directory);trusted('git',['apply','--directory=apps/consumer',patchFile],directory);rmSync(patchFile);
   if(hash(readFileSync(join(directory,'apps/consumer/src/integrations/permits.ts')))!==verification.candidateIdentity.adapterHash)throw Error('Published adapter differs from verified candidate');
   if(trusted('git',['diff','--name-only'],directory)!=='apps/consumer/src/integrations/permits.ts')throw Error('Publication includes unverified files');
   trusted('git',['add','apps/consumer/src/integrations/permits.ts'],directory);
   // Fixed timestamps make retries compute the same exact commit, not merely similar contents.
   trusted('git',['-c','core.hooksPath=/dev/null','-c','user.name=Azelf','-c','user.email=azelf@localhost','commit','-m',`Repair permit integration for ${verification.vendorVersion}`],directory,{date:verification.at});
   const head=trusted('git',['rev-parse','HEAD'],directory),tree=trusted('git',['rev-parse','HEAD^{tree}'],directory);
   const existing=JSON.parse(trusted('gh',['pr','list','--repo',repo,'--head',branch,'--state','all','--json','url,headRefOid,state,baseRefName,baseRefOid']));
   if(existing.length>1)throw Error('Multiple proposals for one branch require reconciliation');
   if(existing.length){
    const proposal=existing[0],commit=api(`commits/${proposal.headRefOid}`),comparison=api(`compare/${verification.baseCommit}...${proposal.headRefOid}`),contents=api(`contents/apps/consumer/src/integrations/permits.ts?ref=${proposal.headRefOid}`);
    validateExistingHead({...proposal,branchHead:remoteRef(directory,branch),tree:commit.commit.tree.sha,parents:commit.parents.map((parent:any)=>parent.sha),files:comparison.files,adapterHash:hash(Buffer.from(contents.content,'base64'))},{base:verification.baseCommit,head,tree,adapterHash:verification.candidateIdentity.adapterHash});
   }
   pushRef(directory,branch,head);
   const baseline=(run.observations as any[]).find(observation=>observation.phase==='baseline');
   const broken=(run.observations as any[]).filter(observation=>observation.phase==='broken').at(-1);
   const execution=this.store.readArtifact(task.executionArtifactId).value;
   const response=(value:any)=>({status:value.response.status,vendorVersion:value.response.vendorVersion,body:value.response.body,publishedContract:value.spec.body});
   const report={schemaVersion:1,runId,taskId:task.id,incident:run.incident,baseCommit:verification.baseCommit,candidate:verification.candidateIdentity,patchHash:verification.patchHash,sourceChange:{path:'apps/consumer/src/integrations/permits.ts',patch},baseline:{vendorVersion:baseline?.vendorVersion,checks:baseline?.checks},broken:{vendorVersion:broken?.vendorVersion,checks:broken?.checks,confirmation:broken?.confirmation},previousPublishedEvidence:response(inputArtifact.value.previous),currentPublishedEvidence:response(inputArtifact.value.current),runtime:{model:execution.model||'gpt-6.1-sol',threadId:execution.threadId,invocationAttempted:execution.invocationAttempted,modelInvoked:execution.modelInvoked,usage:execution.usage,cost:execution.cost??null},verification,localArtifactIntegrity:{inputManifest:task.inputManifestHash,execution:task.executionArtifactId,patch:task.patchArtifactId,verification:verificationArtifact.metadata.id},coverageLimits:verification.coverageGaps,release:{authorized:false,deployed:false,observationComplete:false}};
   const reportText=JSON.stringify(report,null,2);
   if(/\b(?:gh[opusr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,})\b|Bearer\s+[A-Za-z0-9._-]{20,}/.test(reportText))throw Error('Evidence redaction guard rejected credential-like content');
   const blob=trusted('git',['hash-object','-w','--stdin'],directory,{input:reportText});
   const evidenceTree=trusted('git',['mktree'],directory,{input:`100644 blob ${blob}\treport.json\n`});
   const evidenceCommit=trusted('git',['-c','user.name=Azelf','-c','user.email=azelf@localhost','commit-tree',evidenceTree,'-m',`Sanitized evidence for ${task.id}`],directory,{date:verification.at});
   const evidenceBranch=`azelf/evidence-${task.id}-${verificationArtifact.metadata.id.slice(0,12)}`;pushRef(directory,evidenceBranch,evidenceCommit);
   const uploaded=api(`contents/report.json?ref=${evidenceCommit}`);if(hash(Buffer.from(uploaded.content,'base64'))!==hash(reportText))throw Error('Remote evidence content failed integrity check');
   const evidenceUrl=`https://github.com/${repo}/blob/${evidenceCommit}/report.json`;
   const body=`The permit capability failed against pinned vendor ${verification.vendorVersion}. A real isolated runtime run produced this adapter-only repair, and independent protected verification passed.\n\n[Sanitized failure, source diff and verification evidence](${evidenceUrl}) — available to this private repository's reviewers. The report contains reproduced failure, baseline/candidate checks, immutable identities, actual model usage and coverage limits.\n\nBase: ${verification.baseCommit}\nCandidate adapter SHA-256: ${verification.candidateIdentity.adapterHash}\nCandidate consumer tree SHA-256: ${verification.candidateIdentity.treeHash}\nPatch SHA-256: ${verification.patchHash}\nRunner: ${verification.runnerImage}\nProtected checks: ${verification.checks.length}/${verification.checks.length} pass.\n\nCoverage limits:\n${verification.coverageGaps.map(gap=>`- ${gap}`).join('\n')}\n\nHuman merge and test-deployment approval remain required. Automatic merge is disabled. Post-release health is not established. If deployed behavior fails, leave the incident open and make any rollback a human decision.`;
   const bodyFile=join(directory,'.azelf-pr-body');writeFileSync(bodyFile,body);
   if(api('git/ref/heads/main').object.sha!==verification.baseCommit)throw Error('Remote baseline moved during publication; proposal remains unverified for new base');
   let url:string;if(existing.length){url=existing[0].url;trusted('gh',['pr','edit',url,'--body-file',bodyFile],directory);}else url=trusted('gh',['pr','create','--repo',repo,'--base','main','--head',branch,'--title',`Restore permit capability for ${verification.vendorVersion}`,'--body-file',bodyFile],directory);
   run.proposal={url,branch,head,base:verification.baseCommit,evidenceUrl,evidenceCommit,evidenceSha256:hash(reportText),verificationArtifactId:verificationArtifact.metadata.id,autoMerge:false};
   this.store.transaction(()=>{this.store.put(run);this.store.event(runId,'publication','passed',url,[verificationArtifact.metadata.id]);});return run.proposal;
  }finally{rmSync(directory,{recursive:true,force:true});}
 }
}
