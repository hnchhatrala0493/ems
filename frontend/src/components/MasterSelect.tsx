import { useEffect, useState } from 'react';
export type MasterType='DEPARTMENT'|'DESIGNATION'|'TEAM'|'JOB_LEVEL'|'JOB_GRADE'|'BRANCH'|'LOCATION';
type Master={_id:string;type:MasterType;name:string;status:string;department?:string};
const auth=()=>({authorization:`Bearer ${localStorage.getItem('token')||sessionStorage.getItem('token')||''}`});
let cache:Master[]|null=null;
export function useOrganizationMasters(){const[items,setItems]=useState<Master[]>(cache||[]);useEffect(()=>{if(cache)return;fetch('/api/v1/masters',{headers:auth()}).then(r=>r.json()).then(r=>{cache=(r.data||[]).filter((x:Master)=>x.status==='ACTIVE');setItems(cache||[])})},[]);return items}
export function MasterSelect({label,type,value,change,required=false,items}:{label:string;type:MasterType;value:string;change:(value:string)=>void;required?:boolean;items?:Master[]}){const masters=useOrganizationMasters();const options=(items||masters).filter(x=>x.type===type);return <label className="text-sm font-semibold">{label}{required&&<span className="text-red-500"> *</span>}<select required={required} className="input mt-1 font-normal" value={value} onChange={e=>change(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(x=><option key={x._id} value={x.name}>{x.name}</option>)}</select></label>}
