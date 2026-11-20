import { FormEvent, useState } from 'react';
import { Appointment, bookAppointment, DEPARTMENTS, getAppointments, isPhone, SLOTS, upcomingDates } from '../lib/store';
import { Field, inputCls, PageHead, Success } from '../components/ui';

export default function Appointments() {
  const dates = upcomingDates();
  const [dept, setDept] = useState('');
  const [date, setDate] = useState(dates[0]);
  const [slot, setSlot] = useState('');
  const [v, setV] = useState({ name: '', phone: '', purpose: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Appointment | null>(null);
  const [, refresh] = useState(0);

  const taken = new Set(getAppointments().filter((a) => a.department === dept && a.date === date).map((a) => a.slot));

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!dept) er.dept = 'Select a department.';
    if (!slot) er.slot = 'Select an available slot.';
    if (v.name.trim().length < 2) er.name = 'Enter your name.';
    if (!isPhone(v.phone)) er.phone = 'Enter a valid 10-digit mobile number.';
    if (v.purpose.trim().length < 3) er.purpose = 'Enter the purpose of visit.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const r = bookAppointment({ department: dept, date, slot, name: v.name.trim(), phone: v.phone, purpose: v.purpose.trim() });
    if (typeof r === 'string') { setErrs({ slot: r }); setSlot(''); refresh((n) => n + 1); } else setDone(r);
  }

  if (done)
    return (
      <div className="space-y-4">
        <PageHead title="Book Appointment" desc="Reserve a demo slot at a government department." />
        <Success title="Appointment booked" id={done.token} idLabel="Token number" trackPath={`/track?id=${done.token}`}>
          <div>{done.department} · {done.date} · {done.slot}</div><div>Name: {done.name}</div>
        </Success>
        <button className="btn-outline" onClick={() => { setDone(null); setSlot(''); setV({ name: '', phone: '', purpose: '' }); }}>Book another</button>
      </div>
    );

  return (
    <div className="space-y-4">
      <PageHead title="Book Appointment" desc="Choose a department, date and an available slot. Occupied slots are disabled." />
      <form onSubmit={submit} noValidate className="card grid gap-4 sm:grid-cols-2">
        <Field label="Department" error={errs.dept}>
          <select className={inputCls} value={dept} onChange={(e) => { setDept(e.target.value); setSlot(''); }}>
            <option value="">— Select —</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <select className={inputCls} value={date} onChange={(e) => { setDate(e.target.value); setSlot(''); }}>
            {dates.map((d) => <option key={d} value={d}>{new Date(d + 'T00:00').toDateString()}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <div className="mb-1 text-sm font-medium text-slate-700">Available slots</div>
          {!dept ? <p className="text-sm text-slate-500">Select a department to see slots.</p> : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SLOTS.map((s) => (
                <button type="button" key={s} disabled={taken.has(s)} onClick={() => setSlot(s)}
                  className={`rounded-lg border px-2 py-2 text-sm ${taken.has(s) ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through' : slot === s ? 'border-navy-700 bg-navy-700 text-white' : 'border-slate-300 hover:bg-navy-50'}`}>
                  {s}{taken.has(s) && ' (booked)'}
                </button>
              ))}
            </div>
          )}
          {errs.slot && <span role="alert" className="mt-1 block text-xs text-red-600">{errs.slot}</span>}
        </div>
        <Field label="Your name" error={errs.name}><input className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field>
        <Field label="Mobile number" error={errs.phone}><input className={inputCls} inputMode="numeric" maxLength={10} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value.replace(/\D/g, '') })} /></Field>
        <div className="sm:col-span-2"><Field label="Purpose of visit" error={errs.purpose}><input className={inputCls} value={v.purpose} onChange={(e) => setV({ ...v, purpose: e.target.value })} /></Field></div>
        <div className="sm:col-span-2"><button className="btn" type="submit">Confirm booking</button></div>
      </form>
    </div>
  );
}
