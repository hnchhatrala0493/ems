import { Clock3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type AttendanceBreak={start:string;end?:string;durationMinutes?:number};
type Attendance={_id:string;date?:string;checkIn?:{time:string};checkOut?:{time:string};breaks?:AttendanceBreak[];breakDurationMinutes?:number;totalWorkingMinutes?:number};
const cacheKey='employeehub-active-attendance';
const token=()=>localStorage.getItem('token')||sessionStorage.getItem('token')||'';
const readCache=()=>{try{return JSON.parse(sessionStorage.getItem(cacheKey)||'null')as Attendance|null}catch{return null}};
function elapsed(record:Attendance|null,now:number){if(!record?.checkIn?.time)return 0;if(record.checkOut?.time)return Math.max(0,(record.totalWorkingMinutes||0)*60);const started=new Date(record.checkIn.time).getTime();const completed=(record.breakDurationMinutes||0)*60;const active=record.breaks?.at(-1);const activeBreak=active?.start&&!active.end?Math.max(0,Math.floor((now-new Date(active.start).getTime())/1000)):0;return Math.max(0,Math.floor((now-started)/1000)-completed-activeBreak)}
const display=(seconds:number)=>[Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(value=>String(value).padStart(2,'0')).join(':');

export function LiveAttendanceTimer(){
  const[record,setRecord]=useState<Attendance|null>(readCache);const[now,setNow]=useState(Date.now());
  useEffect(()=>{
    const clock=window.setInterval(()=>setNow(Date.now()),1000);
    const sync=(event:Event)=>{const next=(event as CustomEvent<Attendance>).detail;if(next){setRecord(next);sessionStorage.setItem(cacheKey,JSON.stringify(next))}};
    window.addEventListener('employeehub:attendance',sync);
    const headers={authorization:`Bearer ${token()}`};
    const load=async()=>{try{const todayResponse=await fetch('/api/v1/attendance/today',{headers});let next:Attendance|null=todayResponse.ok?(await todayResponse.json()).data:null;if(!next){const month=new Date().toISOString().slice(0,7);const listResponse=await fetch(`/api/v1/attendance?month=${month}`,{headers});if(listResponse.ok){const rows=((await listResponse.json()).data||[])as Attendance[],cached=readCache();next=rows.find(item=>item._id===cached?._id)||rows.filter(item=>item.checkIn?.time&&!item.checkOut?.time).sort((a,b)=>new Date(b.checkIn!.time).getTime()-new Date(a.checkIn!.time).getTime())[0]||null}}if(next){setRecord(next);sessionStorage.setItem(cacheKey,JSON.stringify(next))}}catch{/* Keep the last known timer while temporarily offline. */}};
    void load();const refresh=window.setInterval(load,5000);
    return()=>{clearInterval(clock);clearInterval(refresh);window.removeEventListener('employeehub:attendance',sync)};
  },[]);
  const seconds=useMemo(()=>elapsed(record,now),[record,now]);
  if(!record?.checkIn?.time)return null;
  return <div title={record.checkOut?'Today’s completed working time':'Live working time'} className="hidden min-w-[118px] items-center gap-2 rounded-[10px] border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-400 sm:flex"><Clock3 size={17}/><div><p className="text-[9px] font-bold uppercase tracking-wider opacity-75">{record.checkOut?'Worked':'Working'}</p><time className="font-mono text-sm font-bold tabular-nums">{display(seconds)}</time></div></div>;
}
