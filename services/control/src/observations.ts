import { probeConsumer,type Check } from '../../../evaluation/contracts/permits.ts';
import { hash } from '../../../packages/contracts/policy.ts';
export function diagnose(checks:Check[],documentationAvailable:boolean){
 if(checks.every(x=>x.status==='pass'))return {classification:'healthy',eligible:false,reason:documentationAvailable?'Protected capability healthy; no patch needed':'Capability healthy; published specification unavailable (evidence gap)'};
 const code=(checks.find(x=>x.id==='fetch')?.observed as any)?.code;
 if(code==='availability')return {classification:'availability_failure',eligible:false,reason:'Vendor unavailable; a schema patch is not authorized'};
 if(code==='authentication')return {classification:'authentication_failure',eligible:false,reason:'Operator must restore vendor credentials or permission'};
 if(code==='quota')return {classification:'quota_failure',eligible:false,reason:'Vendor quota exhausted after bounded observations'};
 if(code==='semantic')return {classification:'semantic_change',eligible:false,reason:'Decision required: does vendor complete mean application approved? No mapping is authorized.'};
 if(!documentationAvailable)return {classification:'insufficient_evidence',eligible:false,reason:'Published contract unavailable; obtain documented semantics before repair'};
 return {classification:'schema_mismatch',eligible:true,reason:'Protected behavior failed twice against unchanged identities; published contract available'};
}
export async function snapshot(url:string){const response=await fetch(url,{signal:AbortSignal.timeout(5000),redirect:'error'});const body=await response.text();if(Buffer.byteLength(body)>65536)throw Error('Evidence response exceeds limit');return {url,status:response.status,vendorVersion:response.headers.get('x-vendor-version'),body,at:new Date().toISOString()};}
export { probeConsumer };
