import { NavLink, Link } from 'react-router-dom';
import { GROUPS, NAV_ITEMS } from '../data/navigation';

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-navy-900 text-slate-200 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" onClick={onClose} className="block border-b border-white/10 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-saffron-400">NIET · OS PBL</div>
          <div className="text-base font-bold text-white">Smart Citizen Service Portal</div>
        </Link>
        <nav className="space-y-4 px-3 py-4">
          {GROUPS.map((g) => (
            <div key={g}>
              <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g}</div>
              {NAV_ITEMS.filter((n) => n.group === g).map((n) => (
                <NavLink
                  key={n.path}
                  to={n.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition ${
                      isActive ? 'bg-navy-700 text-white' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <span>{n.label}</span>
                  {n.status === 'pending' && <span className="text-[10px] text-slate-500">P{n.phase}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
