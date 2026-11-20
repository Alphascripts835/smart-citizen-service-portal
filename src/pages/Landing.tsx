import { Link } from 'react-router-dom';

const PROBLEMS = [
  ['Slow login & payment at peak', 'CPU scheduling, MLFQ, thread pools'],
  ['Wrong tax balance on concurrent pay', 'Critical section, semaphores, monitors'],
  ['Hanging payment / receipt jobs', "Lock ordering, Banker's algorithm"],
  ['OCR crashes, slow file lookup', 'Paging, LRU, LOOK disk scheduling'],
  ['Idle servers off-peak', 'KVM virtualization, containers, CUDA tier'],
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="bg-navy-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-saffron-400">
            Operating Systems PBL · CCSE0303A · NIET Greater Noida
          </div>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Smart Citizen Service Portal</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            A municipal e-governance portal paired with interactive simulations of the operating-system concepts that
            keep it fast, correct and scalable. Aligned with SDG 4 and SDG 11.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn bg-saffron-500 hover:bg-saffron-400">Open dashboard</Link>
            <Link to="/os/scheduling" className="btn-outline border-white text-white hover:bg-white/10">
              Explore OS simulations
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold text-navy-800">Problems the portal solves with OS concepts</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {PROBLEMS.map(([p, s]) => (
            <div key={p} className="card">
              <div className="font-semibold text-navy-700">{p}</div>
              <div className="mt-1 text-sm text-slate-600">{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <h2 className="text-2xl font-bold text-navy-800">Team</h2>
        <p className="mt-2 text-sm text-slate-600">
          Anandi Nishad Raj · Arpita Shishodia · Agrima Agarwal · Ambika Sharma · Shashwat Singh — submitted to Ms. Oshin Mishra.
        </p>
      </section>
    </div>
  );
}
