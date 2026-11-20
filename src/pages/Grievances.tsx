import { FormEvent, useState } from 'react';
import { addRecord, isPhone, TrackRecord } from '../lib/store';
import { Field, inputCls, PageHead, Success } from '../components/ui';

const CATS = ['Garbage Collection', 'Potholes / Road Damage', 'Water Supply', 'Broken Streetlight', 'Drainage / Sewage', 'Other'];

export default function Grievances() {
  const [v, setV] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState<TrackRecord | null>(null);
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!v.category) er.category = 'Select a category.';
    if ((v.name ?? '').trim().length < 2) er.name = 'Enter your name.';
    if (!isPhone(v.phone ?? '')) er.phone = 'Enter a valid 10-digit mobile number.';
    if ((v.location ?? '').trim().length < 5) er.location = 'Enter the location / landmark.';
    if ((v.desc ?? '').trim().length < 15) er.desc = 'Describe the problem (at least 15 characters).';
    if (file && !/^image\//.test(file.type)) er.file = 'Only image files are allowed.';
    else if (file && file.size > 2 * 1024 * 1024) er.file = 'Image must be under 2 MB.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const details: Record<string, string> = {
      Reporter: v.name.trim(), Contact: v.phone.trim(), Category: v.category, Location: v.location.trim(), Description: v.desc.trim(),
    };
    if (file) details['Image (demo)'] = file.name;
    setDone(addRecord('complaint', v.category, details));
  }

  if (done)
    return (
      <div className="space-y-4">
        <PageHead title="Public Grievances" desc="Report civic problems and track their status." />
        <Success title="Complaint registered" id={done.id} idLabel="Complaint ID" trackPath={`/track?id=${done.id}`}>Initial status: Pending</Success>
        <button className="btn-outline" onClick={() => { setDone(null); setV({}); setFile(null); }}>Report another problem</button>
      </div>
    );

  return (
    <div className="space-y-4">
      <PageHead title="Public Grievances" desc="Report garbage, potholes, water supply, streetlight and other civic problems. Check status on the Track page." />
      <form onSubmit={submit} noValidate className="card grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errs.category}>
          <select className={inputCls} value={v.category ?? ''} onChange={(e) => set('category', e.target.value)}>
            <option value="">— Select —</option>{CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Your name" error={errs.name}><input className={inputCls} value={v.name ?? ''} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Mobile number" error={errs.phone}><input className={inputCls} inputMode="numeric" maxLength={10} value={v.phone ?? ''} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} /></Field>
        <Field label="Location / landmark" error={errs.location}><input className={inputCls} value={v.location ?? ''} onChange={(e) => set('location', e.target.value)} /></Field>
        <div className="sm:col-span-2"><Field label="Description" error={errs.desc}><textarea rows={4} className={inputCls} value={v.desc ?? ''} onChange={(e) => set('desc', e.target.value)} /></Field></div>
        <div className="sm:col-span-2">
          <Field label="Photo (optional, demo upload)" error={errs.file}>
            <input className={inputCls} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Field>
          <p className="mt-1 text-xs text-slate-500">Demo upload: only the file name is saved.</p>
        </div>
        <div className="sm:col-span-2"><button className="btn" type="submit">Submit complaint</button></div>
      </form>
    </div>
  );
}
