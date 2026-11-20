// localStorage-backed persistence (prototype; no backend). All data stays in this browser.
export const DEMO_NOTE = 'Demo prototype: not connected to any government department. Data is stored only in this browser.';

export type Kind = 'application' | 'complaint';
export const STATUSES: Record<Kind, string[]> = {
  application: ['Submitted', 'Under Verification', 'Approved'],
  complaint: ['Pending', 'In Progress', 'Resolved'],
};
export interface HistoryItem { status: string; at: string }
export interface TrackRecord {
  id: string; kind: Kind; title: string; status: string; createdAt: string;
  history: HistoryItem[]; details: Record<string, string>;
}
export interface Appointment {
  token: string; department: string; date: string; slot: string; name: string; phone: string; purpose: string; createdAt: string;
}
export interface Payment {
  receiptNo: string; propertyId: string; owner: string; amount: number; method: string; paidAt: string; breakdown: [string, number][];
}

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; } catch { return []; }
}
function write<T>(key: string, v: T[]) { localStorage.setItem(key, JSON.stringify(v)); }

const K = { rec: 'scsp.records', apt: 'scsp.appointments', pay: 'scsp.payments' };

export function newId(prefix: string, existing: string[]): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let id: string;
  do { id = `${prefix}-${d}-${Math.floor(10000 + Math.random() * 90000)}`; } while (existing.includes(id));
  return id;
}

export const getRecords = () => read<TrackRecord>(K.rec);
export function addRecord(kind: Kind, title: string, details: Record<string, string>): TrackRecord {
  const all = getRecords();
  const now = new Date().toISOString();
  const first = STATUSES[kind][0];
  const rec: TrackRecord = {
    id: newId(kind === 'application' ? 'APP' : 'GRV', all.map((r) => r.id)),
    kind, title, status: first, createdAt: now, history: [{ status: first, at: now }], details,
  };
  write(K.rec, [...all, rec]);
  return rec;
}
export function findRecord(id: string) { return getRecords().find((r) => r.id === id.trim().toUpperCase()); }
/** Demo-only: simulates a staff member moving the record to its next stage. */
export function advanceRecord(id: string): TrackRecord | undefined {
  const all = getRecords();
  const r = all.find((x) => x.id === id);
  if (!r) return;
  const list = STATUSES[r.kind];
  const i = list.indexOf(r.status);
  if (i < list.length - 1) {
    r.status = list[i + 1];
    r.history.push({ status: r.status, at: new Date().toISOString() });
    write(K.rec, all);
  }
  return r;
}

export const getAppointments = () => read<Appointment>(K.apt);
export function bookAppointment(a: Omit<Appointment, 'token' | 'createdAt'>): Appointment | string {
  const all = getAppointments();
  if (all.some((x) => x.department === a.department && x.date === a.date && x.slot === a.slot))
    return 'This slot has just been booked by someone else. Please choose another slot.';
  const code = a.department.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase();
  const n = all.filter((x) => x.department === a.department && x.date === a.date).length + 1;
  const token = `${code}-${a.date.replace(/-/g, '').slice(2)}-${String(n).padStart(3, '0')}`;
  const apt = { ...a, token, createdAt: new Date().toISOString() };
  write(K.apt, [...all, apt]);
  return apt;
}
export const findAppointment = (t: string) => getAppointments().find((x) => x.token === t.trim().toUpperCase());

export const getPayments = () => read<Payment>(K.pay);
export function addPayment(p: Omit<Payment, 'receiptNo' | 'paidAt'>): Payment {
  const all = getPayments();
  const rec = { ...p, receiptNo: newId('DEMO-RCPT', all.map((x) => x.receiptNo)), paidAt: new Date().toISOString() };
  write(K.pay, [...all, rec]);
  return rec;
}

// ---- validation helpers ----
export const isPhone = (s: string) => /^[6-9]\d{9}$/.test(s.trim());
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const fmt = (iso: string) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

// ---- configurable demo property-tax formula ----
export const TAX_CONFIG = {
  ratePerSqFt: { Residential: 4, Commercial: 12, Industrial: 9, 'Vacant Land': 1.5 } as Record<string, number>, // ₹/sq ft/yr
  zoneFactor: { 'Zone A (City Centre)': 1.5, 'Zone B (Urban)': 1.2, 'Zone C (Suburban)': 1.0, 'Zone D (Rural)': 0.7 } as Record<string, number>,
  sanitationCessPct: 5, waterCessPct: 8, ownerOccupiedRebatePct: 10,
};
export function calcTax(type: string, area: number, zone: string, ownerOccupied: boolean): [string, number][] {
  const base = area * TAX_CONFIG.ratePerSqFt[type] * TAX_CONFIG.zoneFactor[zone];
  const rebate = ownerOccupied && type === 'Residential' ? (base * TAX_CONFIG.ownerOccupiedRebatePct) / 100 : 0;
  const net = base - rebate;
  const san = (net * TAX_CONFIG.sanitationCessPct) / 100;
  const wat = (net * TAX_CONFIG.waterCessPct) / 100;
  const r = (n: number) => Math.round(n * 100) / 100;
  return [
    [`Base tax (${area} sq ft × ₹${TAX_CONFIG.ratePerSqFt[type]} × zone ${TAX_CONFIG.zoneFactor[zone]})`, r(base)],
    [`Owner-occupied rebate (${TAX_CONFIG.ownerOccupiedRebatePct}%)`, -r(rebate)],
    [`Sanitation cess (${TAX_CONFIG.sanitationCessPct}%)`, r(san)],
    [`Water cess (${TAX_CONFIG.waterCessPct}%)`, r(wat)],
    ['Total estimated annual tax', r(net + san + wat)],
  ];
}

// ---- appointment demo data ----
export const DEPARTMENTS = ['Revenue Department', 'Municipal Corporation', 'Water & Sanitation Board', 'Electricity Board', 'Regional Transport Office'];
export const SLOTS = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];
export function upcomingDates(n = 7): string[] {
  const out: string[] = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return out;
}
