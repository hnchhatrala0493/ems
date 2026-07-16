import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Loader2, Search, ShieldAlert, X } from 'lucide-react';

type Audit = { _id:string; createdAt:string; user?:{name:string;email:string}|null; userId?:string; role?:string; action:string; module:string; submodule?:string; description:string; record:string; ip:string; status:'SUCCESS'|'FAILED'; severity:'INFO'|'WARNING'|'CRITICAL'; method:string; path:string; statusCode:number; durationMs?:number; userAgent?:string; params?:unknown; query?:unknown; body?:unknown; organization?:string; branch?:string; department?:string; source?:string; entityType?:string; entityCode?:string; requestId?:string; correlationId?:string; actorType?: 'USER'|'SYSTEM' };
const auth=()=>({authorization:`Bearer ${localStorage.getItem('token')||sessionStorage.getItem('token')||''}`});

export function AuditLogs(){
  const [items,setItems]=useState<Audit[]>([]); const [loading,setLoading]=useState(true); const [selected,setSelected]=useState<Audit|null>(null);
  const [page,setPage]=useState(1); const pageSize=25;
  const [filters, setFilters] = useState({
    search: '', status: '', severity: '', dateFrom: '', dateTo: '', user: '', module: '', action: '', ip: '',
    actorType: '', role: '', organization: '', branch: '', department: '', submodule: '', source: '',
    entityType: '', entityId: '', entityCode: '', deviceType: '', browser: '', os: '', method: '',
    requestId: '', correlationId: ''
  });
  const setFilter = (key: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  useEffect(()=>{setLoading(true);fetch('/api/v1/audit?limit=200',{headers:auth()}).then(r=>r.json()).then(r=>setItems(r.data||[])).finally(()=>setLoading(false))},[]);
  const filtered=useMemo(()=>items.filter(x=>{
    const searchText=`${x.user?.name||''} ${x.user?.email||''} ${x.record||''} ${x.entityCode||''} ${x.description} ${x.requestId||''} ${x.ip}`.toLowerCase();
    if (filters.search && !searchText.includes(filters.search.toLowerCase())) return false;
    if (filters.status && x.status !== filters.status) return false;
    if (filters.severity && x.severity !== filters.severity) return false;
    if (filters.dateFrom && new Date(x.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(x.createdAt) > new Date(filters.dateTo)) return false;
    if (filters.user && x.userId !== filters.user) return false;
    if (filters.module && x.module !== filters.module) return false;
    if (filters.action && x.action !== filters.action) return false;
    if (filters.ip && x.ip !== filters.ip) return false;
    if (filters.actorType && x.actorType !== filters.actorType) return false;
    if (filters.role && x.role !== filters.role) return false;
    // Other filters can be added here
    return true;
  }),[items, filters]);
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const paged=filtered.slice((page-1)*pageSize,page*pageSize);
  useEffect(()=>{setPage(1)},[filters]);
  useEffect(()=>{if(page>totalPages)setPage(totalPages)},[page,totalPages]);

  return <div className="mx-auto max-w-[1600px]">
    <div className="mb-6"><h2 className="text-2xl font-bold">Audit logs</h2><p className="text-slate-500">Complete, traceable history of user and system activity.</p></div>
    <div className="card mb-5 p-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="relative col-span-full"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input className="input pl-10" placeholder="Search actor, email, entity, description, request ID, IP..." value={filters.search} onChange={e=>setFilter('search', e.target.value)}/></label>
        <input type="date" className="input" value={filters.dateFrom} onChange={e => setFilter('dateFrom', e.target.value)} />
        <input type="date" className="input" value={filters.dateTo} onChange={e => setFilter('dateTo', e.target.value)} />
        <select className="input" value={filters.status} onChange={e=>setFilter('status', e.target.value)}><option value="">All statuses</option><option>SUCCESS</option><option>FAILED</option></select>
        <select className="input" value={filters.severity} onChange={e=>setFilter('severity', e.target.value)}><option value="">All severities</option><option>INFO</option><option>WARNING</option><option>CRITICAL</option></select>
        {/* Add more dropdowns for other filters like user, module, etc. */}
      </div>
    </div>
    <div className="card overflow-hidden p-0">{loading?<div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-brand"/></div>:<div className="overflow-x-auto"><table className="w-full min-w-[1500px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Date and time','User','Role','Action','Module','Description','Record','IP address','Status','Severity','Actions'].map(x=><th key={x} className="px-4 py-3">{x}</th>)}</tr></thead><tbody className="divide-y">{paged.map(x=><tr key={x._id} className="hover:bg-slate-50/70"><td className="whitespace-nowrap px-4 py-3"><b>{new Date(x.createdAt).toLocaleDateString()}</b><p className="text-xs text-slate-500">{new Date(x.createdAt).toLocaleTimeString()}</p></td><td className="px-4 py-3"><b>{x.user?.name||'Unknown user'}</b><p className="text-xs text-slate-500">{x.user?.email||x.userId||'—'}</p></td><td className="px-4 py-3 whitespace-nowrap">{(x.role||'—').replaceAll('_',' ')}</td><td className="px-4 py-3"><Badge value={x.action}/></td><td className="px-4 py-3 capitalize">{x.module}</td><td className="max-w-xs px-4 py-3 text-slate-600"><p className="line-clamp-2">{x.description}</p></td><td className="px-4 py-3 font-mono text-xs">{x.record||'—'}</td><td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{x.ip||'—'}</td><td className="px-4 py-3"><Badge value={x.status}/></td><td className="px-4 py-3"><Badge value={x.severity}/></td><td className="px-4 py-3"><button onClick={()=>setSelected(x)} className="icon-btn" title="View complete details"><Eye size={18}/></button></td></tr>)}{!filtered.length&&<tr><td colSpan={11} className="p-12 text-center text-slate-500">No audit activity matches the selected filters.</td></tr>}</tbody></table></div>}</div>
    {!loading&&filtered.length>0&&<div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3"><p className="text-sm text-slate-500">Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize,filtered.length)} of {filtered.length} logs</p><div className="flex items-center gap-2"><button className="small-button" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={16}/>Previous</button><span className="px-2 text-sm font-semibold">Page {page} of {totalPages}</span><button className="small-button" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next<ChevronRight size={16}/></button></div></div>}
    {selected&&<Details item={selected} close={()=>setSelected(null)}/>} </div>
}
function Badge({value}:{value:string}){const style=value==='SUCCESS'||value==='INFO'?'bg-emerald-50 text-emerald-700':value==='FAILED'||value==='CRITICAL'?'bg-red-50 text-red-700':value==='WARNING'||value==='DELETE'?'bg-amber-50 text-amber-700':'bg-indigo-50 text-indigo-700';return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>{value}</span>}
function Details({item,close}:{item:Audit;close:()=>void}){return <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/60"><aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><ShieldAlert className="mb-3 text-brand"/><h3 className="text-xl font-bold">Audit details</h3><p className="font-mono text-xs text-slate-500">{item._id}</p></div><button onClick={close}><X/></button></div><div className="grid gap-3 sm:grid-cols-2">{[['Date and time',new Date(item.createdAt).toLocaleString()],['User',item.user?.name||item.userId||'Unknown'],['Role',(item.role||'—').replaceAll('_',' ')],['Action',item.action],['Module',item.module],['Record',item.record],['IP address',item.ip],['Status',`${item.status} (${item.statusCode})`],['Severity',item.severity],['Duration',`${item.durationMs||0} ms`],['Method',item.method],['Path',item.path],['Device',item.userAgent||'—'],['Request ID',item.requestId||'—'],['Correlation ID',item.correlationId||'—']].map(([k,v])=><div key={k} className="rounded-xl border p-3"><p className="text-xs font-semibold text-slate-400">{k}</p><p className="mt-1 break-words text-sm font-medium">{v||'—'}</p></div>)}</div><h4 className="mt-6 font-bold">Description</h4><p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm">{item.description}</p><h4 className="mt-6 font-bold">Request data</h4><pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify({params:item.params,query:item.query,body:item.body},null,2)}</pre></aside></div>}
