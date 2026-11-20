import { FormEvent, useState } from 'react';
import { addRecord, isEmail, isPhone, TrackRecord } from '../lib/store';
import { Field, inputCls, PageHead, Success } from '../components/ui';

const TYPES: Record<string, { label: string; name: string; type?: string; opts?: string[] }[]> = {
  'Income Certificate': [
    { label: 'Occupation', name: 'occupation' }, { label: 'Annual income (₹)', name: 'income', type: 'number' },
  ],
  'Caste Certificate': [
    { label: "Father's name", name: 'father' }, { label: 'Category', name: 'category', opts: ['SC', 'ST', 'OBC'] }, { label: 'Caste / community', name: 'caste' },
  ],
  'Domicile Certificate': [
    { label: 'Years of residence in state', name: 'years', type: 'number' },
  ],
  'Birth Certificate': [
    { label: "Child's name", name: 'child' }, { label: 'Date of birth', name: 'dob', type: 'date' }, { label: 'Place of birth', name: 'pob' },
    { label: "Father's name", name: 'father' }, { label: "Mother's name", name: 'mother' },
  ],
};
const MAX = 2 * 1024 * 1024;

export default function Certificates() {
  const [type, setType] = useState('');
  const [v, setV] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState<TrackRecord | null>(null);
  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));
  const extra = TYPES[type] ?? [];

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!type) er.type = 'Select a certificate type.';
    if ((v.name ?? '').trim().length < 2) er.name = 'Enter your full name.';
    if (!isPhone(v.phone ?? '')) er.phone = 'Enter a valid 10-digit mobile number.';
    if (v.email && !isEmail(v.email)) er.email = 'Enter a valid email or leave blank.';
    if ((v.address ?? '').trim().length < 5) er.address = 'Enter your address.';
    extra.forEach((f) => { if (!(v[f.name] ?? '').trim()) er[f.name] = `${f.label} is required.`; });
    if (type === 'Birth Certificate' && v.dob && new Date(v.dob) > new Date()) er.dob = 'Date cannot be in the future.';
    if (!file) er.file = 'Attach a supporting document (demo upload).';
    else if (file.size > MAX) er.file = 'File must be under 2 MB.';
    else if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) er.file = 'Only PDF, JPG or PNG allowed.';
    setErrs(er);
    if (Object.keys(er).length) return;
    const details: Record<string, string> = { Applicant: v.name.trim(), Contact: v.phone.trim(), Address: v.address.trim() };
    if (v.email) details.Email = v.email.trim();
    extra.forEach((f) => (details[f.label] = v[f.name].trim()));
    details['Document (demo)'] = file!.name;
    setDone(addRecord('application', type, details));
  }
  function reset() { setDone(null); setV({}); setFile(null); setType(''); setErrs({}); }

  if (done)
    return (
      <div className="space-y-4">
        <PageHead title="Certificate Application" desc="Apply for income, caste, domicile and birth certificates." />
        <Success title={`${done.title} application submitted`} id={done.id} idLabel="Application ID" trackPath={`/track?id=${done.id}`} />
        <button className="btn-outline" onClick={reset}>Submit another application</button>
      </div>
    );

  return (
    <div className="space-y-4">
      <PageHead title="Certificate Application" desc="Apply for income, caste, domicile and birth certificates." />
      <form onSubmit={submit} noValidate className="card grid gap-4 sm:grid-cols-2">
        <Field label="Certificate type" error={errs.type}>
          <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">— Select —</option>
            {Object.keys(TYPES).map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Full name" error={errs.name}><input className={inputCls} value={v.name ?? ''} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Mobile number" error={errs.phone}><input className={inputCls} inputMode="numeric" maxLength={10} value={v.phone ?? ''} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} /></Field>
        <Field label="Email (optional)" error={errs.email}><input className={inputCls} type="email" value={v.email ?? ''} onChange={(e) => set('email', e.target.value)} /></Field>
        <div className="sm:col-span-2"><Field label="Address" error={errs.address}><input className={inputCls} value={v.address ?? ''} onChange={(e) => set('address', e.target.value)} /></Field></div>
        {extra.map((f) => (
          <Field key={f.name} label={f.label} error={errs[f.name]}>
            {f.opts ? (
              <select className={inputCls} value={v[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">— Select —</option>{f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input className={inputCls} type={f.type ?? 'text'} min={f.type === 'number' ? 0 : undefined} value={v[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
            )}
          </Field>
        ))}
        <div className="sm:col-span-2">
          <Field label="Supporting document — DEMO upload (PDF/JPG/PNG, max 2 MB)" error={errs.file}>
            <input className={inputCls} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Field>
          <p className="mt-1 text-xs text-slate-500">Demo upload: only the file name is saved; the file itself is not sent anywhere.</p>
        </div>
        <div className="sm:col-span-2"><button className="btn" type="submit">Submit application</button></div>
      </form>
    </div>
  );
}
