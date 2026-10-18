import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export const versions = ['v1','v2-rename','v3-pagination','v4-combined','v5-additive','v6-outage','v7-ambiguous','v8-envelope','v9-cents','v10-auth','v11-quota','v12-missing-spec'] as const;
export type VendorVersion = typeof versions[number];
const records = [
 {id:'p_001',project_name:'Solar Project',status:'approved',fee_usd:125},
 {id:'p_002',project_name:'Storage Project',status:'pending',fee_usd:200},
 {id:'p_003',project_name:'Water Project',status:'approved',fee_usd:50},
];
export function vendorServer(version: VendorVersion): Server {
 if (!versions.includes(version)) throw new Error('Unknown immutable vendor version');
 const contract = JSON.parse(readFileSync(fileURLToPath(new URL(`../contracts/${version}.json`, import.meta.url)), 'utf8'));
 return createServer((req,res) => {
   res.setHeader('content-type','application/json'); res.setHeader('x-vendor-version', version); res.setHeader('cache-control','no-store');
   const url = new URL(req.url || '/', 'http://vendor');
   const send = (code:number, body:unknown) => { res.writeHead(code);res.end(JSON.stringify(body)); };
   if (req.method !== 'GET') return send(405,{error:'Read-only API'});
   if (url.pathname === '/health') return send(200,{version,service:'permit-vendor'});
   if (url.pathname === '/openapi.json') return send(version === 'v12-missing-spec' ? 503 : 200, version === 'v12-missing-spec' ? {error:'Specification unavailable'} : contract);
   if (url.pathname !== '/permits') return send(404,{error:'Not found'});
   if (version === 'v6-outage') return send(503,{error:'Vendor temporarily unavailable'});
   if (version === 'v10-auth') return send(401,{error:'Authentication required'});
   if (version === 'v11-quota') { res.setHeader('retry-after','1'); return send(429,{error:'Rate limited'}); }
   let items: any[] = records.map(x=>({...x}));
   if (version === 'v2-rename' || version === 'v4-combined') items=items.map(({status,...rest})=>({...rest,permit_status:status}));
   if (version === 'v5-additive') items=items.map(x=>({...x,region:'east'}));
   if (version === 'v7-ambiguous') items=items.map(x=>({...x,status:x.status === 'approved'?'complete':x.status}));
   if (version === 'v9-cents') items=items.map(({fee_usd,...rest})=>({...rest,fee_cents:fee_usd*100}));
   if (version === 'v8-envelope') return send(200,{data:{permits:items}});
   if (version === 'v3-pagination' || version === 'v4-combined') {
      const cursor=url.searchParams.get('cursor');
      if (cursor && cursor !== 'opaque-page-2') return send(400,{error:'Unknown cursor'});
      return send(200,{permits:cursor?items.slice(2):items.slice(0,2),next_cursor:cursor?null:'opaque-page-2'});
   }
   send(200,{permits:items});
 });
}
