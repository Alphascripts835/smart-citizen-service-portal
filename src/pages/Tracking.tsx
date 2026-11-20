import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { advanceRecord, Appointment, findAppointment, findRecord, fmt, STATUSES, TrackRecord } from '../lib/store';
import { Field, inputCls, PageHead } from '../components/ui';

export default function Tracking() {
  const [params] = useSearchParams();
  const [id, setId] = useState(params.get('id') ?? '');
  const [rec, setRec] = useState<TrackRecord | null>(null);
  const [apt, setApt] = useState<Appointment | null>(null);
  const [err, setErr] = useState('');

  function lookup(q: string) {
    const s = q.trim();
    setRec(null); setApt(null); setErr('');
    if (!s) return setErr('Please enter an Application ID, Complaint ID or Appointment token.');
    const r = findRecord(s); if (r) return setRec(r);
    const a = findAppointment(s); if (a) return setApt(a);
    setErr(`No record found for "${s}". Check the ID (e.g. APP-20260101-12345, GRV-…, or a token) and try again.`);
  }
  useEffect(() => { if (params.get('id')) lookup(params.get('id')!); /* eslint-disable-next-line */ }, []);
  const submit = (e: FormEvent) => { e.preventDefault(); lookup(id); };
  const advance = () => rec && setRec({ ...advanceRecord(rec.id)! });

  const steps = rec ? STATUSES[rec.kind] : [];
  const cur = rec ? steps.indexOf(rec.status) : -1;

  return (
    <div className="space-y-4">
      <PageHead title="Track Application / Complaint" desc="Enter your Application ID (APP-…), Complaint ID (GRV-…) or appointment token." />
      <form onSubmit={submit} className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1"><Field label="ID or token"><input className={inputCls} value={id} onChange={(e) => setId(e.target.value)} placeholder="APP-20260101-12345" /></Field></div>
        <button className="btn" type="submit">Track</button>
      </form>
      {err && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}

      {rec && (
        <div className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><div className="text-xs uppercase text-slate-500">{rec.kind}</div><h2 className="text-lg font-bold text-navy-800">{rec.title}</h2><div className="font-mono text-sm">{rec.id}</div></div>
            <span className={`badge ${cur === steps.length - 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-saffron-400/20 text-saffron-500'}`}>{rec.status}</span>
          </div>
          <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
            {steps.map((s, i) => {
              const h = rec.history.find((x) => x.status === s);
              return (
                <li key={s} className="relative">
                  <span className={`absolute -left-[25px] top-0.5 h-4 w-4 rounded-full border-2 ${i <= cur ? 'border-emerald-600 bg-emerald-500' : 'border-slate-300 bg-white'}`} />
                  <div className={`text-sm font-semibold ${i <= cur ? 'text-navy-800' : 'text-slate-400'}`}>{s}</div>
                  <div className="text-xs text-slate-500">{h ? fmt(h.at) : 'Awaiting'}</div>
                </li>
              );
            })}
          </ol>
          <dl className="grid gap-1 text-sm sm:grid-cols-2">
            <div>Submitted: <b>{fmt(rec.createdAt)}</b></div>
            {Object.entries(rec.details).map(([k, v]) => <div key={k}>{k}: <b className="break-words">{v}</b></div>)}
          </dl>
          {cur < steps.length - 1 && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              No real officer reviews this prototype. For demonstration, simulate a staff update:
              <button className="btn-outline ml-2 mt-1" onClick={advance}>Demo: move to “{steps[cur + 1]}”</button>
            </div>
          )}
        </div>
      )}

      {apt && (
        <div className="card space-y-1 text-sm">
          <div className="text-xs uppercase text-slate-500">Appointment</div>
          <h2 className="font-mono text-lg font-bold text-navy-800">{apt.token}</h2>
          <div>Department: <b>{apt.department}</b></div><div>Date & time: <b>{apt.date} · {apt.slot}</b></div>
          <div>Booked by: <b>{apt.name}</b> · Purpose: {apt.purpose}</div><div>Booked on: {fmt(apt.createdAt)}</div>
          <span className="badge bg-emerald-100 text-emerald-700">Confirmed (demo)</span>
        </div>
      )}
    </div>
  );
}
