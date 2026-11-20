import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_NOTE } from '../lib/store';

export const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600';

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
export const DemoBanner = () => (
  <div className="rounded-lg border border-saffron-400 bg-saffron-400/10 px-3 py-2 text-xs text-slate-700">{DEMO_NOTE}</div>
);
export function PageHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
      <p className="text-sm text-slate-600">{desc}</p>
      <DemoBanner />
    </div>
  );
}
export function Success({ title, id, idLabel, children, trackPath }: { title: string; id: string; idLabel: string; children?: ReactNode; trackPath?: string }) {
  return (
    <div className="card border-emerald-300 bg-emerald-50" role="status">
      <h2 className="text-lg font-semibold text-emerald-800">✔ {title}</h2>
      <p className="mt-2 text-sm">{idLabel}: <span className="select-all font-mono text-base font-bold text-navy-800">{id}</span></p>
      <p className="text-xs text-slate-600">Save this — you need it to track your request.</p>
      <div className="mt-2 text-sm">{children}</div>
      {trackPath && <Link to={trackPath} className="btn mt-3">Track now</Link>}
    </div>
  );
}
