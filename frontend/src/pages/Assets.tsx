import { useEffect, useMemo, useState } from 'react';
import { Boxes, BriefcaseBusiness, CheckCircle2, ClipboardList, Loader2, Plus, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import type { Employee } from '../types';
import { MasterSelect } from '../components/MasterSelect';

type Asset = {
  _id: string;
  assetName: string;
  assetCode: string;
  assetType: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  warrantyExpiry?: string;
  condition?: string;
  location?: string;
  status: string;
  notes?: string;
  assignedEmployee?: { _id: string; firstName: string; lastName: string; employeeId?: string } | null;
  history?: Array<{ action: string; employeeName?: string; fromStatus?: string; toStatus?: string; note?: string; createdAt?: string }>;
};

const assetTypes = ['LAPTOP', 'DESKTOP', 'MOBILE', 'SIM_CARD', 'MONITOR', 'KEYBOARD', 'MOUSE', 'ID_CARD', 'ACCESS_CARD', 'VEHICLE', 'SOFTWARE_LICENSE', 'OTHER'];
const assetStatuses = ['AVAILABLE', 'ASSIGNED', 'UNDER_MAINTENANCE', 'DAMAGED', 'LOST', 'RETIRED'];
const authHeaders = () => ({ authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}` });

export function Assets() {
  const [items, setItems] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [modal, setModal] = useState<'create' | 'assign' | 'history' | ''>('');
  const [selected, setSelected] = useState<Asset | null>(null);
  const [form, setForm] = useState({ assetName: '', assetCode: '', assetType: 'LAPTOP', serialNumber: '', brand: '', model: '', purchaseDate: '', purchaseCost: '', warrantyExpiry: '', condition: 'NEW', location: '', status: 'AVAILABLE', notes: '' });
  const [assignEmployee, setAssignEmployee] = useState('');
  const [assignNote, setAssignNote] = useState('');

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    const [assetsRes, employeesRes] = await Promise.all([
      fetch(`/api/v1/assets?${params.toString()}`, { headers: authHeaders() }),
      fetch('/api/v1/employees?limit=100', { headers: authHeaders() })
    ]);
    const assetsData = await assetsRes.json();
    const employeesData = await employeesRes.json();
    setItems(assetsData.data?.items || []);
    setEmployees(employeesData.data?.items || []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [search, status, type]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/v1/assets', { method: 'POST', headers: { ...authHeaders(), 'content-type': 'application/json' }, body: JSON.stringify(form) });
    setModal('');
    setForm({ assetName: '', assetCode: '', assetType: 'LAPTOP', serialNumber: '', brand: '', model: '', purchaseDate: '', purchaseCost: '', warrantyExpiry: '', condition: 'NEW', location: '', status: 'AVAILABLE', notes: '' });
    await load();
  };

  const assign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch(`/api/v1/assets/${selected._id}/assign`, { method: 'POST', headers: { ...authHeaders(), 'content-type': 'application/json' }, body: JSON.stringify({ employeeId: assignEmployee, note: assignNote }) });
    setModal('');
    setAssignEmployee('');
    setAssignNote('');
    await load();
  };

  const returnAsset = async (id: string) => {
    if (!window.confirm('Return this asset?')) return;
    await fetch(`/api/v1/assets/${id}/return`, { method: 'POST', headers: { ...authHeaders(), 'content-type': 'application/json' }, body: JSON.stringify({}) });
    await load();
  };

  const summary = useMemo(() => ({
    total: items.length,
    assigned: items.filter((item) => item.status === 'ASSIGNED').length,
    available: items.filter((item) => item.status === 'AVAILABLE').length,
    maintenance: items.filter((item) => item.status === 'UNDER_MAINTENANCE').length
  }), [items]);

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">Asset management</h2>
        <p className="text-slate-500">Track equipment, assignments, and return history across the organization.</p>
      </div>
      <button onClick={() => setModal('create')} className="button"><Plus size={16}/>Add asset</button>
    </div>

    <div className="grid gap-3 md:grid-cols-4">
      <Summary label="Total assets" value={summary.total} icon={Boxes}/>
      <Summary label="Assigned" value={summary.assigned} icon={BriefcaseBusiness}/>
      <Summary label="Available" value={summary.available} icon={CheckCircle2}/>
      <Summary label="Maintenance" value={summary.maintenance} icon={ShieldCheck}/>
    </div>

    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
          <Search size={16}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search asset" className="outline-none" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {assetStatuses.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="">All types</option>
          {assetTypes.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
        </select>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin"/></div> : <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-3 pr-3">Asset</th>
              <th className="py-3 pr-3">Code</th>
              <th className="py-3 pr-3">Type</th>
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Assigned to</th>
              <th className="py-3 pr-3">Location</th>
              <th className="py-3 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((asset) => <tr key={asset._id} className="border-b last:border-0">
              <td className="py-3 pr-3"><div className="font-semibold">{asset.assetName}</div><div className="text-xs text-slate-500">{asset.serialNumber || 'No serial number'}</div></td>
              <td className="py-3 pr-3">{asset.assetCode}</td>
              <td className="py-3 pr-3">{asset.assetType.replaceAll('_', ' ')}</td>
              <td className="py-3 pr-3"><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${asset.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : asset.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{asset.status.replaceAll('_', ' ')}</span></td>
              <td className="py-3 pr-3">{asset.assignedEmployee ? `${asset.assignedEmployee.firstName} ${asset.assignedEmployee.lastName}` : 'Unassigned'}</td>
              <td className="py-3 pr-3">{asset.location || '—'}</td>
              <td className="py-3 pr-3">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setSelected(asset); setModal('assign'); }} className="rounded-lg border px-2 py-1 text-xs">Assign</button>
                  <button onClick={() => void returnAsset(asset._id)} className="rounded-lg border px-2 py-1 text-xs">Return</button>
                  <button onClick={() => { setSelected(asset); setModal('history'); }} className="rounded-lg border px-2 py-1 text-xs">History</button>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>}
    </div>

    {modal === 'create' && <Modal title="Add asset" close={() => setModal('')}>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
        <Field label="Asset name" value={form.assetName} change={(v) => setForm({ ...form, assetName: v })} />
        <Field label="Asset code" value={form.assetCode} change={(v) => setForm({ ...form, assetCode: v })} />
        <Select label="Type" value={form.assetType} options={assetTypes} change={(v) => setForm({ ...form, assetType: v })} />
        <Field label="Serial number" value={form.serialNumber} change={(v) => setForm({ ...form, serialNumber: v })} />
        <Field label="Brand" value={form.brand} change={(v) => setForm({ ...form, brand: v })} />
        <Field label="Model" value={form.model} change={(v) => setForm({ ...form, model: v })} />
        <Field label="Purchase date" type="date" value={form.purchaseDate} change={(v) => setForm({ ...form, purchaseDate: v })} />
        <Field label="Purchase cost" type="number" value={form.purchaseCost} change={(v) => setForm({ ...form, purchaseCost: v })} />
        <Field label="Warranty expiry" type="date" value={form.warrantyExpiry} change={(v) => setForm({ ...form, warrantyExpiry: v })} />
        <Field label="Condition" value={form.condition} change={(v) => setForm({ ...form, condition: v })} />
        <MasterSelect label="Location" type="LOCATION" value={form.location} change={(v) => setForm({ ...form, location: v })} />
        <Select label="Status" value={form.status} options={assetStatuses} change={(v) => setForm({ ...form, status: v })} />
        <label className="text-sm font-semibold md:col-span-2">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input mt-1 min-h-[90px]" /></label>
        <button className="button md:col-span-2">Save asset</button>
      </form>
    </Modal>}

    {modal === 'assign' && selected && <Modal title={`Assign ${selected.assetName}`} close={() => setModal('')}>
      <form onSubmit={assign} className="space-y-4">
        <label className="text-sm font-semibold">Assign to<select value={assignEmployee} onChange={(e) => setAssignEmployee(e.target.value)} className="input mt-1"><option value="">Select employee</option>{employees.map((employee) => <option key={employee._id} value={employee._id}>{`${employee.firstName} ${employee.lastName}`}</option>)}</select></label>
        <label className="text-sm font-semibold">Note<textarea value={assignNote} onChange={(e) => setAssignNote(e.target.value)} className="input mt-1 min-h-[90px]" /></label>
        <button className="button w-full">Assign asset</button>
      </form>
    </Modal>}

    {modal === 'history' && selected && <Modal title={`${selected.assetName} history`} close={() => setModal('')}>
      <div className="space-y-3">
        {(selected.history || []).length === 0 ? <p className="text-sm text-slate-500">No assignment history yet.</p> : (selected.history || []).map((entry, index) => <div key={index} className="rounded-xl border p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold">{entry.action.replaceAll('_', ' ')}</p>
            <p className="text-xs text-slate-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}</p>
          </div>
          <p className="mt-1 text-sm text-slate-600">{entry.employeeName || '—'}</p>
          <p className="text-sm text-slate-500">{entry.fromStatus && entry.toStatus ? `${entry.fromStatus} → ${entry.toStatus}` : ''}</p>
          {entry.note && <p className="mt-1 text-sm text-slate-500">{entry.note}</p>}
        </div>)}
      </div>
    </Modal>}
  </div>;
}

function Summary({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
    <Icon className="float-right"/>
    <p className="text-xs text-white/80">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>;
}

function Modal({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4">
    <div className="my-6 w-full max-w-3xl rounded-2xl bg-white p-6">
      <div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-bold">{title}</h3><button onClick={close}><X/></button></div>
      {children}
    </div>
  </div>;
}

function Field({ label, value, change, type = 'text' }: { label: string; value: string | number; change: (v: string) => void; type?: string }) {
  return <label className="text-sm font-semibold">{label}<input type={type} value={value} onChange={(e) => change(e.target.value)} className="input mt-1" /></label>;
}

function Select({ label, value, options, change }: { label: string; value: string; options: string[]; change: (v: string) => void }) {
  return <label className="text-sm font-semibold">{label}<select value={value} onChange={(e) => change(e.target.value)} className="input mt-1">{options.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}</select></label>;
}
