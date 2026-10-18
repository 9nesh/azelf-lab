import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { listPermits } from '../integrations/permits.ts';
import { IntegrationError } from '../model/permit.ts';
export function consumerServer(vendorUrl: string, identity: string, instanceId: string, assetPath?:string) {
 return createServer(async (req,res)=>{
  res.setHeader('cache-control','no-store');
  res.setHeader('content-security-policy', "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors http://127.0.0.1:5173 http://localhost:5173; object-src 'none'; base-uri 'none'");
  const path=new URL(req.url || '/', 'http://consumer').pathname;
  const json=(status:number,body:unknown)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));};
  if(req.method!=='GET')return json(405,{error:'Read only'});
  if(path==='/identity') return json(200,{source:identity,instanceId,vendorUrl});
  if(path==='/api/permits') {
    try { return json(200,{permits:await listPermits(vendorUrl),source:identity,instanceId}); }
    catch(error) {return json(502,{error:error instanceof Error?error.message:'Integration failed',code:error instanceof IntegrationError?error.code:'schema',source:identity,instanceId});}
  }
  const assets: Record<string,[string,string]> = {'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
  if(!assets[path])return json(404,{error:'Not found'});
  const [file,type]=assets[path];res.writeHead(200,{'content-type':type});res.end(readFileSync(file==='app.js'&&assetPath?assetPath:new URL(`../ui/${file}`,import.meta.url)));
 });
}
