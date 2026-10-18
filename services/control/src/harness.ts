import type { Server } from 'node:http';
import { vendorServer,type VendorVersion } from '../../../apps/vendor-api/src/server.ts';
import { exportConsumer } from '../../executor/src/workspace-builder.ts';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { listen,close } from '../../../scripts/net.ts';
export class Harness {
 previewOrigins=['http://127.0.0.1:5173','http://localhost:5173'];
 environments=new Map<string,{url:string;vendorUrl:string;vendorVersion:VendorVersion;instanceId:string;source:string;servers:Server[]}>();
 async environment(runId:string,phase:string,version:VendorVersion,source:string){const key=`${runId}:${phase}`;const existing=this.environments.get(key);if(existing)return existing;const vendor=vendorServer(version);const vendorUrl=await listen(vendor);const instanceId=key;const exportPath=resolve('.azelf/baselines',runId);if(!existsSync(exportPath))exportConsumer(source,exportPath);const {consumerServer}=await import(pathToFileURL(resolve(exportPath,'src/server/server.ts')).href);const consumer=consumerServer(vendorUrl,source,instanceId,resolve(exportPath,'runtime-assets/app.js'),this.previewOrigins);try{const url=await listen(consumer);const env={url,vendorUrl,vendorVersion:version,instanceId,source,servers:[consumer,vendor]};this.environments.set(key,env);return env;}catch(e){await close(vendor);throw e;}}
 async stop(runId?:string){for(const [key,env] of this.environments){if(!runId||key.startsWith(`${runId}:`)){await Promise.all(env.servers.map(close));this.environments.delete(key);}}}
}
