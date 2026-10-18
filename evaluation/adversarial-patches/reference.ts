// Evaluator reference fixture ONLY. Never supplied to Mew; never live repair evidence.
import { IntegrationError,type Permit } from '../../apps/consumer/src/model/permit.ts';
export async function listPermits(baseUrl:string):Promise<Permit[]>{
 const permits=new Map<string,Permit>();const cursors=new Set<string>();let cursor:string|null=null;
 for(let page=0;page<20;page++){
  const url=new URL('/permits',baseUrl);if(cursor!==null)url.searchParams.set('cursor',cursor);
  let response:Response|undefined;for(let attempt=0;attempt<2;attempt++){try{response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(3000)});if(response.status!==503||attempt===1)break;}catch{if(attempt===1)throw new IntegrationError('availability','Vendor request failed');}}
  if(!response||!response.ok)throw new IntegrationError('availability',`Vendor HTTP ${response?.status}`);
  let body:any;try{body=await response.json();}catch{throw new IntegrationError('schema','Invalid JSON');}
  if(body?.data)body=body.data;if(!Array.isArray(body?.permits))throw new IntegrationError('schema','Missing permits');
  for(const raw of body.permits){if(!raw||typeof raw.id!=='string'||!raw.id.trim()||typeof raw.project_name!=='string'||!raw.project_name.trim())throw new IntegrationError('schema','Invalid identity');
   const status=raw.permit_status??raw.status;if(status!=='approved'&&status!=='pending')throw new IntegrationError('semantic','Undocumented status');
   if(raw.fee_cents===undefined&&typeof raw.fee_usd!=='number')throw new IntegrationError('schema','Invalid dollar amount');const cents=raw.fee_cents!==undefined?raw.fee_cents:raw.fee_usd*100;if(typeof cents!=='number'||!Number.isFinite(cents)||cents<0||!Number.isSafeInteger(Math.round(cents))||Math.abs(cents-Math.round(cents))>1e-7)throw new IntegrationError('schema','Invalid fee');
   const normalized:Permit={id:raw.id,projectName:raw.project_name,status,feeCents:Math.round(cents)};if(permits.has(raw.id)&&JSON.stringify(permits.get(raw.id))!==JSON.stringify(normalized))throw new IntegrationError('schema','Conflicting duplicate');permits.set(raw.id,normalized);
  }
  if(body.next_cursor===undefined||body.next_cursor===null)return [...permits.values()];
  if(typeof body.next_cursor!=='string'||!body.next_cursor||cursors.has(body.next_cursor))throw new IntegrationError('incomplete','Invalid or cyclic cursor');cursors.add(body.next_cursor);cursor=body.next_cursor;
 }
 throw new IntegrationError('incomplete','Page budget exhausted');
}
