import { isolatedPreview } from '../../verifier/src/preview.ts';
import { applyPatch,validateTree } from '../../verifier/src/patch.ts';
import { hash } from '../../../packages/contracts/policy.ts';
import type { Server } from 'node:http';
import { vendorServer,type VendorVersion } from '../../../apps/vendor-api/src/server.ts';
import { exportConsumer } from '../../executor/src/workspace-builder.ts';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { listen,close } from '../../../scripts/net.ts';
export class Harness {
 previewOrigins=['http://127.0.0.1:5173','http://localhost:5173'];
 candidates=new Map<string,Awaited<ReturnType<typeof isolatedPreview>>>();
 pending=new Map<string,Promise<any>>();
 environments=new Map<string,{url:string;vendorUrl:string;vendorVersion:VendorVersion;instanceId:string;source:string;servers:Server[]}>();
 async environment(runId:string,phase:string,version:VendorVersion,source:string){const key=`${runId}:${phase}`;const pending=this.pending.get(key);if(pending)return pending;const operation=this.launch(runId,phase,version,source);this.pending.set(key,operation);try{return await operation;}finally{this.pending.delete(key);}}
 async launch(runId:string,phase:string,version:VendorVersion,source:string){const key=`${runId}:${phase}`;const existing=this.environments.get(key);if(existing)return existing;const vendor=vendorServer(version);const vendorUrl=await listen(vendor);const instanceId=key;const exportPath=resolve('.azelf/baselines',runId);if(!existsSync(exportPath))exportConsumer(source,exportPath);const {consumerServer}=await import(pathToFileURL(resolve(exportPath,'src/server/server.ts')).href);const consumer=consumerServer(vendorUrl,source,instanceId,resolve(exportPath,'runtime-assets/app.js'),this.previewOrigins);try{const url=await listen(consumer);const env={url,vendorUrl,vendorVersion:version,instanceId,source,servers:[consumer,vendor]};this.environments.set(key,env);return env;}catch(e){await close(vendor);throw e;}}
 async candidate(runId:string,baseCommit:string,patch:string,version:VendorVersion){const prior=this.candidates.get(runId);if(prior&&new Date(prior.expiresAt).getTime()>Date.now())return prior;await prior?.cleanup();const workspace=resolve('.azelf/candidates',runId);if(!existsSync(workspace)){const manifest=exportConsumer(baseCommit,workspace);applyPatch(workspace,patch,hash(patch));validateTree(workspace,manifest);}const identity=hash((await import('node:fs')).readFileSync(resolve(workspace,'src/integrations/permits.ts')));const preview=await isolatedPreview(workspace,identity,version);this.candidates.set(runId,preview);return preview;}
 async stop(runId?:string){for(const [key,preview]of this.candidates){if(!runId||key===runId){await preview.cleanup();this.candidates.delete(key);}}await Promise.allSettled([...this.pending.entries()].filter(([key])=>!runId||key.startsWith(`${runId}:`)).map(([,value])=>value));for(const [key,env] of this.environments){if(!runId||key.startsWith(`${runId}:`)){await Promise.all(env.servers.map(close));this.environments.delete(key);}}}
}
