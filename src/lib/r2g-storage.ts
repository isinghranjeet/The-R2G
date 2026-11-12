export interface LeadItem {
  id: string;
  name: string;
  mobile: string;
  course: string;
  batch: string;
  status: "Pending" | "Confirmed" | "Completed";
  date: string;
  certId?: string;
}

export interface CertRecord {
  certId: string;
  name: string;
  mobile: string;
  course: string;
  year: string;
}

const LEADS_KEY = "r2g_demo_leads_v1";
const CERTS_KEY = "r2g_demo_certs_v1";

export const defaultLeads: LeadItem[] = [
  { id: "LD-101", name: "Rahul Sharma", mobile: "9876543210", course: "SolidWorks Masterclass", batch: "Weekend Professional", status: "Pending", date: "13 Nov 2026" },
  { id: "LD-102", name: "Sneha Gupta", mobile: "9811223344", course: "AutoCAD 2D & 3D", batch: "Weekday Morning", status: "Confirmed", date: "12 Nov 2026" },
  { id: "LD-103", name: "Aman Verma", mobile: "9958112233", course: "Siemens NX & CAM", batch: "Weekend Professional", status: "Completed", date: "10 Nov 2026", certId: "R2G-2026-CAD-7721" },
];

export const defaultCerts: CertRecord[] = [
  { certId: "R2G-2026-CAD-8941", name: "Ranjeet Kumar", mobile: "9876500001", course: "Industrial CAD/CAM & 3D Prototyping", year: "March 2026" },
  { certId: "R2G-2026-CAD-7721", name: "Aman Verma", mobile: "9958112233", course: "Siemens NX & CAM", year: "November 2026" },
  { certId: "R2G-2025-1048", name: "Aarav Mehta", mobile: "9811112222", course: "SolidWorks Masterclass", year: "2025" },
  { certId: "R2G-2025-2091", name: "Priya Sharma", mobile: "9822223333", course: "AutoCAD 2D & 3D", year: "2025" },
];

export function getStoredLeads(): LeadItem[] {
  if (typeof window === "undefined") return defaultLeads;
  const raw = localStorage.getItem(LEADS_KEY);
  return raw ? JSON.parse(raw) : defaultLeads;
}

export function saveStoredLeads(leads: LeadItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function getStoredCerts(): CertRecord[] {
  if (typeof window === "undefined") return defaultCerts;
  const raw = localStorage.getItem(CERTS_KEY);
  return raw ? JSON.parse(raw) : defaultCerts;
}

export function saveStoredCerts(certs: CertRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CERTS_KEY, JSON.stringify(certs));
}