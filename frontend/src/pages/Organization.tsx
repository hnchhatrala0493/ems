import { FormEvent, useState } from 'react';
import { Building2, Plus, Save, Trash2, Upload } from 'lucide-react';

type UnitType = 'Branches' | 'Offices' | 'Locations' | 'Departments' | 'Business units';
type Unit = { id: string; name: string; type: UnitType };
const unitTypes: UnitType[] = ['Branches', 'Offices', 'Locations', 'Departments', 'Business units'];
const defaults = { businessName: 'EmployeeHub', registrationNumber: '', taxNumber: '', industry: 'Technology', companySize: '201–500', address: '', email: '', phone: '', timezone: 'Asia/Kolkata', currency: 'INR', dateFormat: 'DD/MM/YYYY', workingDays: 'Monday–Friday', financialYear: 'April–March', payrollCycle: 'Monthly' };

export function Organization() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('organizationProfile') || 'null') || defaults);
  const [units, setUnits] = useState<Unit[]>(() => JSON.parse(localStorage.getItem('organizationUnits') || '[]'));
  const [active, setActive] = useState<UnitType>('Branches');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<string>(() => localStorage.getItem('organizationLogo') || '');
  const [message, setMessage] = useState('');
  const field = (key: keyof typeof defaults, label: string, type = 'text') => <label className="block text-sm font-semibold">{label}<input type={type} className="input mt-2 font-normal" value={profile[key]} onChange={e => setProfile({...profile, [key]: e.target.value})}/></label>;
  const select = (key: keyof typeof defaults, label: string, values: string[]) => <label className="block text-sm font-semibold">{label}<select className="input mt-2 font-normal" value={profile[key]} onChange={e => setProfile({...profile, [key]: e.target.value})}>{values.map(value => <option key={value}>{value}</option>)}</select></label>;
  const save = (e: FormEvent) => { e.preventDefault(); localStorage.setItem('organizationProfile', JSON.stringify(profile)); setMessage('Organization profile saved.'); };
  const addUnit = (e: FormEvent) => { e.preventDefault(); if (!name.trim()) return; const next = [...units, { id: crypto.randomUUID(), name: name.trim(), type: active }]; setUnits(next); localStorage.setItem('organizationUnits', JSON.stringify(next)); setName(''); };
  const removeUnit = (id: string) => { const next = units.filter(unit => unit.id !== id); setUnits(next); localStorage.setItem('organizationUnits', JSON.stringify(next)); };
  return <div className="mx-auto max-w-6xl">
    <div className="mb-6"><h2 className="text-2xl font-bold">Organization management</h2><p className="text-slate-500">Manage company identity, regional settings, and organizational structure.</p></div>
    <form onSubmit={save} className="card">
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b pb-6">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-brand">{logo ? <img src={logo} alt="Organization logo" className="h-full w-full object-cover"/> : <Building2 size={34}/>}</div>
        <div><h3 className="font-bold">Organization logo</h3><p className="mb-3 text-sm text-slate-500">PNG, JPG, or SVG up to 1 MB.</p><label className="button cursor-pointer"><Upload size={17}/>Upload logo<input className="hidden" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={e => { const file=e.target.files?.[0]; if (!file || file.size>1048576) return setMessage('Logo must be smaller than 1 MB.'); const reader=new FileReader(); reader.onload=()=>{const value=String(reader.result);setLogo(value);localStorage.setItem('organizationLogo',value)};reader.readAsDataURL(file); }}/></label></div>
      </div>
      <h3 className="mb-4 font-bold">Organization profile</h3>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{field('businessName','Business name')}{field('registrationNumber','Registration number')}{field('taxNumber','Tax number')}{field('industry','Industry')}{select('companySize','Company size',['1–10','11–50','51–200','201–500','501–1,000','1,001+'])}{field('address','Address')}{field('email','Contact email','email')}{field('phone','Contact phone','tel')}{select('timezone','Time zone',['Asia/Kolkata','UTC','America/New_York','Europe/London','Asia/Singapore'])}{select('currency','Currency',['INR','USD','EUR','GBP','SGD'])}{select('dateFormat','Date format',['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'])}{select('workingDays','Working days',['Monday–Friday','Monday–Saturday','Sunday–Thursday','Custom'])}{select('financialYear','Financial year',['April–March','January–December','July–June'])}{select('payrollCycle','Payroll cycle',['Monthly','Biweekly','Weekly'])}</div>
      <div className="mt-6 flex items-center gap-4"><button className="button"><Save size={17}/>Save profile</button>{message&&<p role="status" className="text-sm text-emerald-700">{message}</p>}</div>
    </form>
    <section className="card mt-6"><h3 className="font-bold">Organization structure</h3><p className="mb-5 text-sm text-slate-500">Create and manage multiple organizational entities.</p>
      <div className="mb-5 flex gap-2 overflow-x-auto border-b">{unitTypes.map(type=><button key={type} onClick={()=>setActive(type)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${active===type?'border-brand text-brand':'border-transparent text-slate-500'}`}>{type}<span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{units.filter(x=>x.type===type).length}</span></button>)}</div>
      <form onSubmit={addUnit} className="mb-4 flex gap-3"><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder={`New ${active.toLowerCase().replace(/s$/,'')} name`}/><button className="button shrink-0"><Plus size={17}/>Add</button></form>
      <div className="divide-y">{units.filter(unit=>unit.type===active).map(unit=><div key={unit.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3"><span className="rounded-lg bg-indigo-50 p-2 text-brand"><Building2 size={17}/></span><span className="font-medium">{unit.name}</span></div><button aria-label={`Delete ${unit.name}`} onClick={()=>removeUnit(unit.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={17}/></button></div>)}{!units.some(unit=>unit.type===active)&&<p className="py-10 text-center text-sm text-slate-500">No {active.toLowerCase()} added yet.</p>}</div>
    </section>
  </div>;
}
