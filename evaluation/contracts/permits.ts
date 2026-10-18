// TRUSTED EVALUATOR. Never export this module or its expected values to repair jobs.
import { isDeepStrictEqual } from 'node:util';
export const expected = [
{id:'p_001',projectName:'Solar Project',status:'approved',feeCents:12500},
{id:'p_002',projectName:'Storage Project',status:'pending',feeCents:20000},
{id:'p_003',projectName:'Water Project',status:'approved',feeCents:5000},
];
export type Check={id:string;status:'pass'|'fail'|'error'|'not_run';expected?:unknown;observed?:unknown;reason?:string};
export function contractChecks(actual:unknown,truth=expected):Check[]{
 const permits=Array.isArray(actual)?actual:[];
 const check=(id:string,e:unknown,o:unknown):Check=>({id,status:isDeepStrictEqual(e,o)?'pass':'fail',expected:e,observed:o});
 const ordered=(items:any[])=>[...items].sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 return [check('records',ordered(truth),ordered(permits)),check('unique_ids',truth.length,new Set(permits.map(p=>p.id)).size),check('total_cents',truth.reduce((s,p)=>s+p.feeCents,0),permits.reduce((s,p)=>s+p.feeCents,0)),...(['approved','pending'] as const).flatMap(status=>[check(`${status}_records`,ordered(truth.filter(p=>p.status===status)),ordered(permits.filter(p=>p.status===status))),check(`${status}_fees`,truth.filter(p=>p.status===status).reduce((s,p)=>s+p.feeCents,0),permits.filter(p=>p.status===status).reduce((s,p)=>s+p.feeCents,0))])];
}
export async function probeConsumer(url:string):Promise<Check[]>{try{const response=await fetch(`${url}/api/permits`,{signal:AbortSignal.timeout(5000),redirect:'error'});const data=await response.json();if(!response.ok)return [{id:'fetch',status:'fail',expected:'successful permit retrieval',observed:data}];return contractChecks(data.permits);}catch(e){return [{id:'fetch',status:'error',reason:String(e)}];}}
