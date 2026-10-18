import type { Server } from 'node:http';
import { vendorServer,type VendorVersion } from '../../../apps/vendor-api/src/server.ts';
import { consumerServer } from '../../../apps/consumer/src/server/server.ts';
import { listen,close } from '../../../scripts/net.ts';
export class Harness {
 environments=new Map<string,{url:string;vendorUrl:string;vendorVersion:VendorVersion;instanceId:string;source:string;servers:Server[]}>();
 async environment(runId:string,phase:string,version:VendorVersion,source:string){const key=`${runId}:${phase}`;const existing=this.environments.get(key);if(existing)return existing;const vendor=vendorServer(version);const vendorUrl=await listen(vendor);const instanceId=key;const consumer=consumerServer(vendorUrl,source,instanceId);try{const url=await listen(consumer);const env={url,vendorUrl,vendorVersion:version,instanceId,source,servers:[consumer,vendor]};this.environments.set(key,env);return env;}catch(e){await close(vendor);throw e;}}
 async stop(runId?:string){for(const [key,env] of this.environments){if(!runId||key.startsWith(`${runId}:`)){await Promise.all(env.servers.map(close));this.environments.delete(key);}}}
}
