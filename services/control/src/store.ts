import { DatabaseSync } from 'node:sqlite';
import { mkdirSync,writeFileSync,readFileSync,renameSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { hash } from '../../../packages/contracts/policy.ts';
export const runSchema=z.object({id:z.string().uuid(),scenario:z.string(),parent:z.string().nullable(),createdAt:z.string(),baseCommit:z.string(),policyHash:z.string(),evaluatorHash:z.string(),seed:z.number().int(),state:z.string(),phase:z.enum(['baseline','broken']),observations:z.array(z.unknown()),incident:z.unknown().nullable(),task:z.unknown().nullable()}).passthrough();
export type Run=z.infer<typeof runSchema> & { [key:string]:any };
export class Store {
 db:DatabaseSync;artifacts:string;interrupted:any[]=[];
 constructor(public directory:string){mkdirSync(directory,{recursive:true});this.artifacts=join(directory,'artifacts');mkdirSync(this.artifacts,{recursive:true});this.db=new DatabaseSync(join(directory,'lab.sqlite'));this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS events(run_id TEXT NOT NULL,seq INTEGER NOT NULL,data TEXT NOT NULL, PRIMARY KEY(run_id,seq)); CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY,run_id TEXT NOT NULL,scope TEXT NOT NULL,kind TEXT NOT NULL,state TEXT NOT NULL,fence INTEGER NOT NULL DEFAULT 1,deadline INTEGER NOT NULL,reason TEXT); CREATE UNIQUE INDEX IF NOT EXISTS active_scope ON jobs(scope) WHERE state='running'; CREATE TABLE IF NOT EXISTS artifacts(id TEXT PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS requests(key TEXT PRIMARY KEY,run_id TEXT NOT NULL,action TEXT NOT NULL,response TEXT NOT NULL);`);
 // A restart cannot prove execution completion. Fence every interrupted worker.

 }
 recoverInterrupted(){this.interrupted=this.db.prepare("SELECT * FROM jobs WHERE state='running'").all();this.db.exec("UPDATE jobs SET state='failed',fence=fence+1,reason='controller_restart_outcome_unproven' WHERE state='running'");}
 transaction<T>(fn:()=>T):T{this.db.exec('BEGIN IMMEDIATE');try{const value=fn();this.db.exec('COMMIT');return value;}catch(e){this.db.exec('ROLLBACK');throw e;}}
 put(run:Run){runSchema.parse(run);this.db.prepare('INSERT INTO runs VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(run.id,JSON.stringify(run));}
 get(id:string):Run {const row=this.db.prepare('SELECT data FROM runs WHERE id=?').get(id);if(!row)throw Error('Run not found');return runSchema.parse(JSON.parse(String(row.data))) as Run;}
 all():Run[]{return this.db.prepare('SELECT data FROM runs ORDER BY rowid DESC').all().map(x=>runSchema.parse(JSON.parse(String(x.data))) as Run);}
 event(id:string,stage:string,status:string,reason:string,artifactIds:string[]=[]){const seq=Number(this.db.prepare('SELECT COALESCE(MAX(seq),0)+1 n FROM events WHERE run_id=?').get(id)?.n);const event={runId:id,seq,at:new Date().toISOString(),stage,status,reason,artifactIds};this.db.prepare('INSERT INTO events VALUES(?,?,?)').run(id,seq,JSON.stringify(event));return event;}
 events(id:string,after=0){return this.db.prepare('SELECT data FROM events WHERE run_id=? AND seq>? ORDER BY seq').all(id,after).map(x=>JSON.parse(String(x.data)));}
 artifact(value:unknown,provenance:Record<string,unknown>){const text=JSON.stringify(value,null,2);const digest=hash(text);const metadata={id:digest,key:digest,mediaType:'application/json',size:Buffer.byteLength(text),sha256:digest,capturedAt:new Date().toISOString(),provenance,redaction:'sanitized-no-credentials'};const target=join(this.artifacts,digest);const temporary=target+'.tmp-'+randomUUID();writeFileSync(temporary,text,{mode:0o600});renameSync(temporary,target);this.db.prepare('INSERT OR IGNORE INTO artifacts VALUES(?,?)').run(digest,JSON.stringify(metadata));return metadata;}
 readArtifact(id:string){if(!/^[a-f0-9]{64}$/.test(id))throw Error('Invalid artifact identity');const row=this.db.prepare('SELECT data FROM artifacts WHERE id=?').get(id);if(!row)throw Error('Artifact missing');const metadata=JSON.parse(String(row.data));const text=readFileSync(join(this.artifacts,id),'utf8');if(hash(text)!==metadata.sha256||Buffer.byteLength(text)!==metadata.size)throw Error('Artifact integrity mismatch');return {metadata,value:JSON.parse(text)};}
 lease(runId:string,kind:string){this.db.prepare("UPDATE jobs SET state='failed',fence=fence+1,reason='lease_expired' WHERE state='running' AND deadline<=?").run(Date.now());const id=randomUUID();this.db.prepare("INSERT INTO jobs(id,run_id,scope,kind,state,deadline) VALUES(?,?,?,?,'running',?)").run(id,runId,'permits',kind,Date.now()+600000);return {id,fence:1};}
 active(){return !!this.db.prepare("SELECT id FROM jobs WHERE state='running' AND deadline>?").get(Date.now());}
 valid(id:string,fence:number){return !!this.db.prepare("SELECT id FROM jobs WHERE id=? AND fence=? AND state='running' AND deadline>?").get(id,fence,Date.now());}
 finish(id:string,fence:number,state:string,reason:string){const result=this.db.prepare("UPDATE jobs SET state=?,reason=? WHERE id=? AND fence=? AND state='running'").run(state,reason,id,fence);if(!result.changes)throw Error('Stale worker fenced');}
 cancel(runId:string){this.db.prepare("UPDATE jobs SET state='cancelled',fence=fence+1,reason='operator_cancelled' WHERE run_id=? AND state='running'").run(runId);}
 cached(key:string,runId:string,action:string){const row=this.db.prepare('SELECT * FROM requests WHERE key=?').get(key);if(!row)return null;if(row.run_id!==runId||row.action!==action)throw Error('Idempotency key reused for different action');return JSON.parse(String(row.response));}
 cache(key:string,runId:string,action:string,response:unknown){this.db.prepare('INSERT INTO requests VALUES(?,?,?,?)').run(key,runId,action,JSON.stringify(response));}
}
