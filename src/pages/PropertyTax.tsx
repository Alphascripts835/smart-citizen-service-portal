import { FormEvent, useState } from 'react';
import { addPayment, calcTax, getPayments, fmt, inr, Payment, TAX_CONFIG } from '../lib/store';
import { Field, inputCls, PageHead } from '../components/ui';

export default function PropertyTax() {
  const [v, setV] = useState({ owner: '', pid: '', type: '', zone: '', area: '', occ: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [calc, setCalc] = useState<[string, number][] | null>(null);
  const [method, setMethod] = useState('UPI (simulated)');
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [history, setHistory] = useState<Payment[]>(getPayments());

  function run(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (v.owner.trim().length < 2) er.owner = 'Enter the owner name.';
    if (v.pid.trim().length < 3) er.pid = 'Enter a property reference (any demo value).';
    if (!v.type) er.type = 'Select property type.';
    if (!v.zone) er.zone = 'Select location zone.';
    if (!(Number(v.area) > 0) || Number(v.area) > 1000000) er.area = 'Enter a valid area (1 – 1,000,000 sq ft).';
    setErrs(er); setReceipt(null);
    setCalc(Object.keys(er).length ? null : calcTax(v.type, Number(v.area), v.zone, v.occ));
  }
  function pay() {
    if (!calc) return;
    const p = addPayment({ propertyId: v.pid.trim(), owner: v.owner.trim(), amount: calc[calc.length - 1][1], method, breakdown: calc });
    setReceipt(p); setHistory(getPayments());
  }
  const showReceipt = (p: Payment) => { setReceipt(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="space-y-4">
      <PageHead title="Property Tax Calculator" desc="Estimate annual property tax with a simple demo formula and make a simulated payment." />
      {receipt && (
        <div className="card border-2 border-dashed border-navy-600" id="receipt">
          <div className="badge bg-saffron-400/20 text-saffron-500">DEMO RECEIPT — NO REAL PAYMENT MADE</div>
          <h2 className="mt-2 text-lg font-bold text-navy-800">Simulated Payment Receipt</h2>
          <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            <div>Receipt no: <b className="font-mono">{receipt.receiptNo}</b></div><div>Date: {fmt(receipt.paidAt)}</div>
            <div>Owner: {receipt.owner}</div><div>Property ref: {receipt.propertyId}</div>
            <div>Method: {receipt.method}</div><div>Amount (simulated): <b>{inr(receipt.amount)}</b></div>
          </dl>
          <p className="mt-2 text-xs text-slate-600">This is a classroom simulation. No money was transferred and no government record was created.</p>
          <div className="mt-3 flex gap-2"><button className="btn" onClick={() => window.print()}>Print receipt</button><button className="btn-outline" onClick={() => setReceipt(null)}>Close</button></div>
        </div>
      )}
      <form onSubmit={run} noValidate className="card grid gap-4 sm:grid-cols-2">
        <Field label="Owner name" error={errs.owner}><input className={inputCls} value={v.owner} onChange={(e) => setV({ ...v, owner: e.target.value })} /></Field>
        <Field label="Property reference (demo)" error={errs.pid}><input className={inputCls} value={v.pid} onChange={(e) => setV({ ...v, pid: e.target.value })} /></Field>
        <Field label="Property type" error={errs.type}>
          <select className={inputCls} value={v.type} onChange={(e) => setV({ ...v, type: e.target.value })}>
            <option value="">— Select —</option>{Object.keys(TAX_CONFIG.ratePerSqFt).map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Location zone" error={errs.zone}>
          <select className={inputCls} value={v.zone} onChange={(e) => setV({ ...v, zone: e.target.value })}>
            <option value="">— Select —</option>{Object.keys(TAX_CONFIG.zoneFactor).map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Built-up / plot area (sq ft)" error={errs.area}><input className={inputCls} type="number" min={1} value={v.area} onChange={(e) => setV({ ...v, area: e.target.value })} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={v.occ} onChange={(e) => setV({ ...v, occ: e.target.checked })} /> Owner-occupied (rebate applies to Residential only)</label>
        <div className="sm:col-span-2"><button className="btn" type="submit">Calculate tax</button></div>
      </form>

      {calc && (
        <div className="card">
          <h2 className="font-semibold text-navy-800">Estimated tax breakdown</h2>
          <table className="mt-2 w-full text-sm"><tbody>
            {calc.map(([l, a], i) => (
              <tr key={l} className={`border-b border-slate-100 ${i === calc.length - 1 ? 'font-bold text-navy-800' : ''}`}>
                <td className="py-1.5 pr-2">{l}</td><td className="py-1.5 text-right whitespace-nowrap">{a < 0 ? '−' + inr(-a) : inr(a)}</td>
              </tr>
            ))}
          </tbody></table>
          <p className="mt-2 text-xs text-slate-500">Estimate from a demo formula; not an official assessment.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <Field label="Simulated payment method">
              <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
                {['UPI (simulated)', 'Net Banking (simulated)', 'Card (simulated)'].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <button className="btn bg-saffron-500 hover:bg-saffron-400" onClick={pay}>Simulate payment of {inr(calc[calc.length - 1][1])}</button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-navy-800">Demo payment history (this browser)</h2>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {history.slice().reverse().map((p) => (
              <li key={p.receiptNo} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span><span className="font-mono">{p.receiptNo}</span> · {inr(p.amount)} · {fmt(p.paidAt)}</span>
                <button className="btn-outline" onClick={() => showReceipt(p)}>View receipt</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
