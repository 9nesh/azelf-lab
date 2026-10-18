import React,{ useEffect,useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Permit } from '../model/permit.ts';
const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value/100);
function PermitDashboard(){
 const [permits,setPermits]=useState<Permit[]>([]),[status,setStatus]=useState('all'),[error,setError]=useState<string|null>(null),[loading,setLoading]=useState(true),[identity,setIdentity]=useState('Connecting…');
 async function load(){setLoading(true);setError(null);try{const [source,response]=await Promise.all([fetch('/identity').then(r=>r.json()),fetch('/api/permits')]);setIdentity(`Instance ${source.instanceId} · source ${source.source.slice(0,12)}`);const data=await response.json();if(!response.ok)throw Error(data.error);setPermits(data.permits);}catch(e){setError(e instanceof Error?e.message:'Integration failed');}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);const filtered=permits.filter(p=>status==='all'||p.status===status);
 return <main><p className="label">PERMIT DESK / SYNTHETIC TEST APPLICATION</p><h1>Projects in progress.</h1><p id="identity">{identity}</p><label htmlFor="status">Filter status</label><select id="status" value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All permits</option><option value="approved">Approved</option><option value="pending">Pending</option></select><div id="error" role="alert" hidden={!error}>{error&&`Unable to load permits: ${error}`}</div><section id="results" hidden={loading||!!error}><div className="summary"><div><span>Permits in filtered set</span><strong id="count">{filtered.length}</strong></div><div><span>Fees in filtered set</span><strong id="total">{money(filtered.reduce((sum,p)=>sum+p.feeCents,0))}</strong></div></div><ul id="permits">{filtered.map(p=><li key={p.id}><strong>{p.projectName}</strong><span>{p.id} · {p.status} · {money(p.feeCents)}</span></li>)}</ul></section><button id="reload" onClick={load} disabled={loading}>{loading?'Loading permits…':'Run request again'}</button></main>;
}
createRoot(document.getElementById('root')!).render(<PermitDashboard/>);
