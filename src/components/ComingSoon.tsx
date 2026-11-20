import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../data/navigation';

export default function ComingSoon({ path }: { path: string }) {
  const item = NAV_ITEMS.find((n) => n.path === path);
  return (
    <div className="card max-w-xl">
      <span className="badge bg-saffron-400/20 text-saffron-500">Phase {item?.phase} · pending</span>
      <h1 className="mt-3 text-2xl font-bold text-navy-800">{item?.label ?? 'Page'}</h1>
      <p className="mt-2 text-slate-600">{item?.desc}</p>
      <p className="mt-4 text-sm text-slate-500">This module is scheduled for a later development phase.</p>
      <Link to="/dashboard" className="btn mt-4">Back to dashboard</Link>
    </div>
  );
}
