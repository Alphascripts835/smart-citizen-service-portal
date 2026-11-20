import { Link } from 'react-router-dom';
import { GROUPS, NAV_ITEMS } from '../data/navigation';

export default function Dashboard() {
  const mods = NAV_ITEMS.filter((n) => n.path !== '/dashboard');
  const done = mods.filter((n) => n.status === 'done').length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Integrated OS Dashboard</h1>
        <p className="text-sm text-slate-600">Entry point to every module. Live monitoring widgets arrive in Phase 7.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><div className="text-3xl font-bold text-navy-700">{mods.length}</div><div className="text-sm text-slate-500">Modules planned</div></div>
        <div className="card"><div className="text-3xl font-bold text-navy-700">{done}</div><div className="text-sm text-slate-500">Modules live</div></div>
        <div className="card"><div className="text-3xl font-bold text-navy-700">8</div><div className="text-sm text-slate-500">Development phases</div></div>
      </div>
      {GROUPS.filter((g) => g !== 'Overview').map((g) => (
        <section key={g}>
          <h2 className="mb-2 text-lg font-semibold text-navy-800">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mods.filter((n) => n.group === g).map((n) => (
              <Link key={n.path} to={n.path} className="card transition hover:border-navy-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy-700">{n.label}</span>
                  <span className={`badge ${n.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {n.status === 'done' ? 'Live' : `Phase ${n.phase}`}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
