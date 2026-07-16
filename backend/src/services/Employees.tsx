import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { App, ChevronsUpDown, Download, Eye, Grid, List, Loader2, MoreVertical, Plus, Search, Trash2, Upload, UserCog, UserPlus, Users } from 'lucide-react';
import { IEmployee, EMPLOYEE_STATUSES, EMPLOYEE_TYPES } from '../../../backend/src/models/Employee';

type View = 'table' | 'card';
const auth = () => ({ authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}` });

export function Employees() {
  const [items, setItems] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('table');
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', department: '', designation: '', branch: '', employeeType: '', status: '', joiningDateFrom: '', joiningDateTo: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const setFilter = (key: keyof typeof filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pagination.page), limit: String(pagination.limit), ...filters });
    fetch(`/api/v1/employees?${params.toString()}`, { headers: auth() })
      .then(r => r.json())
      .then(r => {
        setItems(r.data.items || []);
        setPagination(r.data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters.search, filters.department, filters.designation, filters.branch, filters.employeeType, filters.status, filters.joiningDateFrom, filters.joiningDateTo, pagination.page]);

  const departments = useMemo(() => [...new Set(items.map(i => i.department).filter(Boolean))], [items]);
  const designations = useMemo(() => [...new Set(items.map(i => i.designation).filter(Boolean))], [items]);
  const branches = useMemo(() => [...new Set(items.map(i => i.branch).filter(Boolean))], [items]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-sm text-slate-500">Manage all employees in your organization.</p>
        </div>
        <div className="flex gap-2">
          <button className="button-outline"><Upload size={16} /> Import</button>
          <button className="button-outline"><Download size={16} /> Export</button>
          <Link to="/employees/create" className="button"><Plus size={17} /> Add Employee</Link>
        </div>
      </header>

      <div className="card mb-4 p-3">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="relative col-span-full"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input pl-10" placeholder="Search by name, email or employee ID" value={filters.search} onChange={e => setFilter('search', e.target.value)} /></label>
          <Select value={filters.department} set={v => setFilter('department', v)} label="All Departments" options={departments} />
          <Select value={filters.designation} set={v => setFilter('designation', v)} label="All Designations" options={designations} />
          <Select value={filters.employeeType} set={v => setFilter('employeeType', v)} label="All Employment Types" options={EMPLOYEE_TYPES as any} />
          <Select value={filters.status} set={v => setFilter('status', v)} label="All Statuses" options={EMPLOYEE_STATUSES as any} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <span className="text-sm font-semibold">{selected.length} selected</span>
              <button className="small-button">Activate</button>
              <button className="small-button">Deactivate</button>
              <button className="small-button">Update Department</button>
              <button className="small-button">Update Manager</button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="small-button"><ChevronsUpDown size={16} /> Columns</button>
          <button onClick={() => setView('table')} className={`icon-btn ${view === 'table' ? 'bg-slate-200' : ''}`}><List size={18} /></button>
          <button onClick={() => setView('card')} className={`icon-btn ${view === 'card' ? 'bg-slate-200' : ''}`}><Grid size={18} /></button>
        </div>
      </div>

      {loading ? <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-brand" /></div> :
        view === 'table' ? (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead><tr>{['', 'Employee', 'Employee ID', 'Work email', 'Department', 'Designation', 'Manager', 'Joining date', 'Employment type', 'Status', 'Actions'].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></thead>
                <tbody className="divide-y">
                  {items.map(e => (
                    <tr key={e._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(e._id!)} onChange={ev => setSelected(ev.target.checked ? [...selected, e._id!] : selected.filter(id => id !== e._id))} /></td>
                      <td className="px-4 py-3"><b>{e.firstName} {e.lastName}</b></td>
                      <td className="px-4 py-3 font-mono text-xs">{e.employeeId}</td>
                      <td className="px-4 py-3">{e.email}</td>
                      <td className="px-4 py-3">{e.department}</td>
                      <td className="px-4 py-3">{e.designation}</td>
                      <td className="px-4 py-3">{e.reportingManager || '—'}</td>
                      <td className="px-4 py-3">{new Date(e.joiningDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{e.employeeType}</td>
                      <td className="px-4 py-3"><Badge value={e.status} /></td>
                      <td className="px-4 py-3"><button className="icon-btn"><MoreVertical size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!items.length && <div className="p-12 text-center text-slate-500">No employees match the selected filters.</div>}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map(e => <div key={e._id} className="card p-4"><div className="flex items-center justify-between"><b>{e.firstName} {e.lastName}</b><Badge value={e.status} /></div><p className="text-xs text-slate-500">{e.designation}</p></div>)}
          </div>
        )}
      {/* Pagination component would go here */}
    </div>
  );
}

function Select({ value, set, label, options }: { value: string; set: (x: string) => void; label: string; options: readonly string[] }) {
  return <select className="input" value={value} onChange={e => set(e.target.value)}><option value="">{label}</option>{options.map(x => <option key={x} value={x}>{x.replaceAll('_', ' ')}</option>)}</select>;
}

function Badge({ value }: { value: string }) {
  let c = 'bg-slate-100 text-slate-600';
  if (value === 'ACTIVE') c = 'bg-emerald-50 text-emerald-700';
  if (['INACTIVE', 'TERMINATED', 'RESIGNED'].includes(value)) c = 'bg-red-50 text-red-700';
  if (['ON_PROBATION', 'ON_NOTICE'].includes(value)) c = 'bg-amber-50 text-amber-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${c}`}>{value.replaceAll('_', ' ')}</span>;
}