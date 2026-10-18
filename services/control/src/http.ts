import { createServer,type IncomingMessage } from 'node:http';
import { randomBytes,timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { Controller } from './controller.ts';
import { scenarios } from '../../../evaluation/scenarios/catalog.ts';
import { policyHash } from '../../../packages/contracts/policy.ts';
export function controlServer(controller:Controller,options:{origins?:Set<string>}={}){
 const token=randomBytes(32).toString('hex');const session=randomBytes(32).toString('hex');
 const allowed=options.origins||new Set(['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:4100']);
 const equals=(a:string,b:string)=>a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
 return createServer(async(req,res)=>{
  res.setHeader('cache-control','no-store');res.setHeader('content-type','application/json');res.setHeader('x-content-type-options','nosniff');
  const send=(code:number,value:unknown)=>{res.writeHead(code);res.end(JSON.stringify(value));};
  try{
   if(!/^((127\.0\.0\.1)|(localhost)):\d+$/.test(req.headers.host||''))return send(403,{error:'Loopback host required'});
   const origin=req.headers.origin;if(origin&&!allowed.has(origin))return send(403,{error:'Origin not allowed'});
   const url=new URL(req.url||'/','http://127.0.0.1:4100');const segments=url.pathname.split('/').filter(Boolean);
   if(req.method==='GET'&&url.pathname==='/api/session'){if(req.headers['sec-fetch-site']==='cross-site')return send(403,{error:'Cross-site session denied'});res.setHeader('set-cookie',`azelf_session=${session}; HttpOnly; SameSite=Strict; Path=/api`);return send(200,{csrf:token,policyHash});}
   if(!req.headers.cookie?.split(';').some(v=>v.trim()===`azelf_session=${session}`))return send(401,{error:'Operator session required'});
   if(req.method==='GET'){
    if(url.pathname==='/api/lab/scenarios')return send(200,scenarios);
    if(url.pathname==='/api/lab/runs')return send(200,controller.store.all());
    if(url.pathname==='/api/projects')return send(200,[{id:'azelf',repository:'local',defaultBranch:'main',connection:'not-connected'}]);
    if(url.pathname==='/api/projects/azelf/capabilities')return send(200,[{id:'permits',intent:'List and filter all permits with correct fees',owner:'local-operator',contract:'1',environment:'synthetic'}]);
    if(url.pathname==='/api/incidents')return send(200,controller.store.all().flatMap(r=>r.incident?[r.incident]:[]));
    if(segments[1]==='artifacts')return send(200,controller.store.readArtifact(z.string().regex(/^[a-f0-9]{64}$/).parse(segments[2])));
    if(segments[1]==='lab'&&segments[2]==='runs'&&segments[3]){const id=z.string().uuid().parse(segments[3]);if(segments[4]==='events')return send(200,controller.store.events(id,z.coerce.number().int().min(0).parse(url.searchParams.get('after')||0)));return send(200,await controller.view(id));}
    return send(404,{error:'Endpoint unavailable'});
   }
   if(req.method!=='POST')return send(405,{error:'Method not allowed'});
   if(!equals(String(req.headers['x-azelf-csrf']||''),token))return send(403,{error:'Invalid operator CSRF token'});
   if(req.headers['content-type']!=='application/json')return send(415,{error:'JSON required'});
   if(req.headers['x-azelf-policy']!==policyHash)return send(409,{error:'Policy changed; refresh before acting'});
   const key=z.string().uuid().parse(req.headers['idempotency-key']);const chunks:Buffer[]=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>4096)return send(413,{error:'Request exceeds limit'});chunks.push(chunk);}const body=JSON.parse(Buffer.concat(chunks).toString()||'{}');
   const scope=segments[3]||'new';const action=segments[4]||'create';const cached=controller.store.cached(key,scope,action);if(cached)return send(200,cached);
   let result:unknown;
   if(url.pathname==='/api/lab/runs'){const input=z.object({scenario:z.string()}).strict().parse(body);result=controller.create(input.scenario);}
   else if(segments[1]==='lab'&&segments[2]==='runs'&&segments[3]){
    const id=z.string().uuid().parse(segments[3]);z.object({}).strict().parse(body);
    switch(action){case 'introduce-change':result=await controller.introduce(id);break;case 'checks':result=controller.enqueueChecks(id);break;case 'repair':result=controller.repair(id);break;case 'evaluate':result=controller.evaluate(id);break;case 'cancel':result=await controller.cancel(id);break;case 'reset':result=await controller.reset(id);break;case 'replay':result=controller.replay(id);break;default:return send(404,{error:'Action not implemented'});}
   }else return send(404,{error:'Endpoint unavailable'});
   controller.store.cache(key,scope,action,result);send(202,result);
  }catch(e){send(409,{error:e instanceof Error?e.message:'Request failed'});}
 });
}
