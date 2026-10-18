import { describe,it,expect } from 'vitest';
import { createServer } from 'node:http';
import { listPermits } from '../../apps/consumer/src/integrations/permits.ts';
import { vendorServer, versions } from '../../apps/vendor-api/src/server.ts';
import { consumerServer } from '../../apps/consumer/src/server/server.ts';
import { listen,close } from '../../scripts/net.ts';
import { probeConsumer,contractChecks } from './permits.ts';
describe('frozen baseline through HTTP',()=>{
 it.each(versions)('observes %s without editing baseline',async(version)=>{
  const vendor=vendorServer(version);const vendorUrl=await listen(vendor);const consumer=consumerServer(vendorUrl,'baseline-test','test');const url=await listen(consumer);
  try{const checks=await probeConsumer(url);expect(checks.every(x=>x.status==='pass')).toBe(['v1','v5-additive','v12-missing-spec'].includes(version));}finally{await close(consumer);await close(vendor);}
 });
 it.each([
  {id:'x',project_name:'Name',status:'unknown',fee_usd:1},
  {id:'x',project_name:'Name',status:'approved',fee_usd:NaN},
  {id:'x',project_name:'Name',status:'approved',fee_usd:1.001},
  {id:'',project_name:'Name',status:'approved',fee_usd:1},
  {id:'x',project_name:'Name',status:'approved',fee_usd:-1},
 ])('rejects malformed/ambiguous values %j',async(record)=>{
  const server=createServer((req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({permits:[record]}));});const url=await listen(server);try{await expect(listPermits(url)).rejects.toThrow();}finally{await close(server);}
 });
 it('fails conflicting duplicates',async()=>{const server=createServer((req,res)=>res.end(JSON.stringify({permits:[{id:'x',project_name:'X',status:'approved',fee_usd:1},{id:'x',project_name:'X',status:'pending',fee_usd:1}]})));const url=await listen(server);try{await expect(listPermits(url)).rejects.toThrow('Conflicting');}finally{await close(server);}});
});
