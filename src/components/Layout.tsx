import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <button className="btn-outline lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            ☰ Menu
          </button>
          <span className="hidden text-sm text-slate-500 lg:block">Operating Systems · CCSE0303A · Simulation-based portal</span>
          <Link to="/dashboard" className="btn">Dashboard</Link>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
          NIET Greater Noida · B.Tech III Sem · All OS behaviour shown is a software simulation.
        </footer>
      </div>
    </div>
  );
}
