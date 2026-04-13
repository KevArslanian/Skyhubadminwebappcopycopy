import { useState } from "react";
import { useNavigate } from "react-router";
import { C, SHELL } from "./tokens";
import { Package, AlertTriangle, Clock, Plane, ArrowRight, Search, FileText, Activity } from "lucide-react";

/* ═══════════════ SHIFT-BASED MOCK DATA ═══════════════ */
const SHIFTS = ["Pagi", "Siang", "Malam"] as const;
type Shift = typeof SHIFTS[number];

const KPI_DATA: Record<Shift, { label: string; value: string; sub: string; icon: React.ElementType; color: string }[]> = {
  Pagi: [
    { label: "Shipment Masuk", value: "284", sub: "+12 vs kemarin", icon: Package, color: C.accent },
    { label: "Urgent", value: "9", sub: "Perlu segera", icon: AlertTriangle, color: C.danger },
    { label: "Delayed", value: "14", sub: "Melebihi SLA", icon: Clock, color: C.warning },
    { label: "Flight Aktif", value: "18", sub: "6 on-time, 3 delayed", icon: Plane, color: C.primary },
  ],
  Siang: [
    { label: "Shipment Masuk", value: "412", sub: "+28 vs kemarin", icon: Package, color: C.accent },
    { label: "Urgent", value: "5", sub: "Perlu segera", icon: AlertTriangle, color: C.danger },
    { label: "Delayed", value: "8", sub: "Melebihi SLA", icon: Clock, color: C.warning },
    { label: "Flight Aktif", value: "24", sub: "14 on-time, 2 delayed", icon: Plane, color: C.primary },
  ],
  Malam: [
    { label: "Shipment Masuk", value: "156", sub: "-4 vs kemarin", icon: Package, color: C.accent },
    { label: "Urgent", value: "2", sub: "Perlu segera", icon: AlertTriangle, color: C.danger },
    { label: "Delayed", value: "3", sub: "Melebihi SLA", icon: Clock, color: C.warning },
    { label: "Flight Aktif", value: "8", sub: "5 on-time, 1 delayed", icon: Plane, color: C.primary },
  ],
};

const CUTOFF_DATA: Record<Shift, { flight: string; route: string; cutoff: string; dept: string; remaining: string; awb: number; sev: "danger" | "warning" }[]> = {
  Pagi: [
    { flight: "GA-714", route: "CGK-DPS", cutoff: "14:30", dept: "15:30", remaining: "23m", awb: 4, sev: "danger" },
    { flight: "QF-182", route: "CGK-SUB", cutoff: "15:00", dept: "16:00", remaining: "53m", awb: 7, sev: "warning" },
    { flight: "QG-931", route: "CGK-UPG", cutoff: "15:45", dept: "17:00", remaining: "1h18m", awb: 3, sev: "warning" },
  ],
  Siang: [
    { flight: "QF-234", route: "CGK-SOC", cutoff: "17:00", dept: "18:00", remaining: "12m", awb: 6, sev: "danger" },
    { flight: "ID-7210", route: "CGK-BTH", cutoff: "15:30", dept: "16:30", remaining: "45m", awb: 5, sev: "warning" },
    { flight: "QG-812", route: "CGK-PNK", cutoff: "18:30", dept: "19:30", remaining: "2h05m", awb: 4, sev: "warning" },
  ],
  Malam: [
    { flight: "GA-410", route: "CGK-BDO", cutoff: "19:00", dept: "20:00", remaining: "18m", awb: 9, sev: "danger" },
    { flight: "QG-445", route: "CGK-TKG", cutoff: "20:00", dept: "21:00", remaining: "1h10m", awb: 3, sev: "warning" },
    { flight: "GA-210", route: "CGK-SRG", cutoff: "21:00", dept: "22:00", remaining: "2h15m", awb: 7, sev: "warning" },
  ],
};

const SHIPMENTS_DATA: Record<Shift, { awb: string; sender: string; route: string; flight: string; status: string; time: string }[]> = {
  Pagi: [
    { awb: "126-84720193", sender: "PT Maju Jaya", route: "CGK-KNO", flight: "GA-180", status: "Processing", time: "06:22" },
    { awb: "126-93018472", sender: "CV Logistik Nusantara", route: "CGK-DPS", flight: "GA-714", status: "Cleared", time: "06:45" },
    { awb: "126-10294738", sender: "PT Chem Indo", route: "CGK-SUB", flight: "QF-182", status: "On Hold", time: "07:18" },
    { awb: "126-57381920", sender: "PT Elektronik Global", route: "CGK-UPG", flight: "QG-931", status: "Processing", time: "07:55" },
    { awb: "126-20384756", sender: "CV Agri Prima", route: "CGK-PLM", flight: "ID-6570", status: "Cleared", time: "08:30" },
  ],
  Siang: [
    { awb: "126-33019284", sender: "PT Surya Mandiri", route: "CGK-SOC", flight: "QF-234", status: "Processing", time: "12:10" },
    { awb: "126-44028173", sender: "CV Prima Logistik", route: "CGK-BTH", flight: "ID-7210", status: "Cleared", time: "12:35" },
    { awb: "126-55037062", sender: "PT Indah Cargo", route: "CGK-PNK", flight: "QG-812", status: "Processing", time: "13:02" },
    { awb: "126-66045951", sender: "PT Global Freight", route: "CGK-BPN", flight: "GA-520", status: "On Hold", time: "13:28" },
    { awb: "126-77054840", sender: "CV Nusantara Express", route: "CGK-PDG", flight: "ID-6180", status: "Cleared", time: "13:50" },
  ],
  Malam: [
    { awb: "126-88063729", sender: "PT Mitra Kargo", route: "CGK-BDO", flight: "GA-410", status: "Processing", time: "18:15" },
    { awb: "126-99072618", sender: "CV Bintang Logistics", route: "CGK-TKG", flight: "QG-445", status: "Cleared", time: "18:40" },
    { awb: "126-11081507", sender: "PT Mega Trans", route: "CGK-SRG", flight: "GA-210", status: "Processing", time: "19:05" },
    { awb: "126-22090496", sender: "PT Rapid Cargo", route: "CGK-JOG", flight: "GA-330", status: "On Hold", time: "19:32" },
    { awb: "126-33099385", sender: "CV Cepat Kargo", route: "CGK-AMQ", flight: "GA-860", status: "Cleared", time: "20:10" },
  ],
};

const ACTION_DATA: Record<Shift, { awb: string; issue: string; route: string; priority: string; elapsed: string }[]> = {
  Pagi: [
    { awb: "126-84720193", issue: "Dokumen tidak lengkap", route: "CGK-KNO", priority: "Critical", elapsed: "2h14m" },
    { awb: "126-93018472", issue: "Berat melebihi deklarasi", route: "CGK-DPS", priority: "High", elapsed: "48m" },
    { awb: "126-10294738", issue: "DG declaration unsigned", route: "CGK-SUB", priority: "High", elapsed: "1h05m" },
  ],
  Siang: [
    { awb: "126-66045951", issue: "Label rusak, perlu cetak ulang", route: "CGK-BPN", priority: "High", elapsed: "35m" },
    { awb: "126-33019284", issue: "Packing tidak sesuai standar IATA", route: "CGK-SOC", priority: "Critical", elapsed: "1h22m" },
    { awb: "126-55037062", issue: "Kuota flight penuh, perlu rebooking", route: "CGK-PNK", priority: "Medium", elapsed: "20m" },
  ],
  Malam: [
    { awb: "126-22090496", issue: "Customs clearance tertunda", route: "CGK-JOG", priority: "Critical", elapsed: "3h10m" },
    { awb: "126-88063729", issue: "Suhu cold chain di luar batas", route: "CGK-BDO", priority: "High", elapsed: "15m" },
  ],
};

const ACTIVITY_DATA: Record<Shift, { time: string; text: string; sev: "success" | "danger" | "info" | "warning" }[]> = {
  Pagi: [
    { time: "08:02", text: "AWB 126-93018472 cleared, siap loading GA-714", sev: "success" },
    { time: "07:48", text: "Cutoff GA-714: 23 menit, 2 AWB belum staged", sev: "danger" },
    { time: "07:35", text: "Manifest approved QF-182, 7 shipment", sev: "success" },
    { time: "06:22", text: "AWB baru: 126-84720193 dari PT Maju Jaya", sev: "info" },
  ],
  Siang: [
    { time: "13:50", text: "AWB 126-44028173 cleared untuk flight ID-7210", sev: "success" },
    { time: "13:28", text: "Exception: AWB 126-66045951 label rusak", sev: "warning" },
    { time: "13:02", text: "3 shipment baru masuk dari PT Indah Cargo", sev: "info" },
    { time: "12:35", text: "Manifest QF-234 di-approve, 6 shipment loaded", sev: "success" },
  ],
  Malam: [
    { time: "20:10", text: "AWB 126-33099385 cleared, loading GA-860", sev: "success" },
    { time: "19:32", text: "Customs hold: AWB 126-22090496 rute CGK-JOG", sev: "danger" },
    { time: "19:05", text: "Shift malam dimulai, 8 flight tersisa", sev: "info" },
    { time: "18:40", text: "AWB 126-99072618 cleared QG-445", sev: "success" },
  ],
};

/* ═══════════════ HELPERS ═══════════════ */
const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  Cleared: { bg: C.successA08, color: C.success },
  Processing: { bg: C.accentA08, color: C.accent },
  "On Hold": { bg: C.dangerA08, color: C.danger },
};

const PRIORITY_PILL: Record<string, { bg: string; color: string }> = {
  Critical: { bg: C.dangerA08, color: C.danger },
  High: { bg: C.warningA08, color: C.warning },
  Medium: { bg: C.accentA08, color: C.accent },
};

const SEV_COLOR: Record<string, string> = {
  danger: C.danger, warning: C.warning, success: C.success, info: C.accent,
};

function Pill({ value, map }: { value: string; map: Record<string, { bg: string; color: string }> }) {
  const s = map[value] || { bg: C.surface2, color: C.text2 };
  return <span style={{ display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px", borderRadius: 999, background: s.bg, color: s.color, fontSize: 10, fontWeight: 600, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{value}</span>;
}

const TH: React.CSSProperties = {
  textAlign: "left", padding: "0 10px", fontSize: 10, fontWeight: 700,
  color: C.text2, textTransform: "uppercase", letterSpacing: "0.4px",
  fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
};

function SecTitle({ children, count, badge }: { children: React.ReactNode; count?: number; badge?: "danger" | "neutral" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 12, color: C.text }}>{children}</span>
      {count !== undefined && (
        <span style={{
          height: 16, padding: "0 5px", borderRadius: 999, fontSize: 10, fontWeight: 700,
          display: "inline-flex", alignItems: "center", fontFamily: "Inter, sans-serif",
          background: badge === "danger" ? C.dangerA08 : C.surface2,
          color: badge === "danger" ? C.danger : C.text2,
        }}>{count}</span>
      )}
    </div>
  );
}

/* ═══════════════ DASHBOARD ═══════════════ */

export function Dashboard() {
  const [shift, setShift] = useState<Shift>(() => {
    const h = new Date().getHours();
    if (h >= 6 && h < 14) return "Pagi";
    if (h >= 14 && h < 22) return "Siang";
    return "Malam";
  });
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const kpi = KPI_DATA[shift];
  const cutoffs = CUTOFF_DATA[shift];
  const shipments = SHIPMENTS_DATA[shift];
  const actions = ACTION_DATA[shift];
  const activity = ACTIVITY_DATA[shift];

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: `calc(100vh - ${SHELL.headerH}px - 40px)`,
      gap: 8, overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* ROW 1: Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20, color: C.text, margin: 0 }}>Dashboard</h1>
          <span style={{ fontSize: 11, color: C.text2 }}>Cutoff Control Desk, {today}</span>
        </div>
        <div style={{ display: "flex", gap: 2, background: C.surface, borderRadius: 8, border: `1px solid ${C.borderSoft}`, padding: 2 }}>
          {SHIFTS.map(s => (
            <button key={s} onClick={() => setShift(s)} style={{
              height: 26, padding: "0 12px", borderRadius: 6, border: "none", cursor: "pointer",
              background: shift === s ? C.primary : "transparent",
              color: shift === s ? "#FFF" : C.text2,
              fontSize: 11, fontWeight: shift === s ? 600 : 400,
              fontFamily: "Inter, sans-serif", transition: "all 0.12s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ROW 2: KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, flexShrink: 0 }}>
        {kpi.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{
              background: C.surface, borderRadius: 10, border: `1px solid ${C.borderSoft}`,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            }}
              onClick={() => {
                if (k.label === "Flight Aktif") navigate("/flight-board");
                else if (k.label === "Urgent" || k.label === "Delayed") navigate("/shipment-ledger");
                else navigate("/shipment-ledger");
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.borderSoft)}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${k.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={k.color} strokeWidth={1.8} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 20, color: C.text, lineHeight: "22px" }}>{k.value}</div>
                <div style={{ fontSize: 10, color: C.text2, lineHeight: "14px" }}>{k.label}</div>
                <div style={{ fontSize: 9, color: k.color, fontWeight: 500, lineHeight: "12px" }}>{k.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROW 3: Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 8, flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflow: "hidden" }}>

          {/* Cutoff Alert */}
          <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.borderSoft}`, overflow: "hidden", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: `1px solid ${C.borderSoft}` }}>
              <SecTitle count={cutoffs.length} badge="danger">Cutoff Alert</SecTitle>
              <button onClick={() => navigate("/flight-board")} style={{ fontSize: 10, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                Flight Board <ArrowRight size={10} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              {cutoffs.map((a, i) => (
                <div key={a.flight} onClick={() => navigate("/flight-board")} style={{
                  padding: "8px 12px", cursor: "pointer",
                  borderRight: i < 2 ? `1px solid ${C.borderSoft}` : "none",
                  borderLeft: `3px solid ${SEV_COLOR[a.sev]}`,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{a.flight}</span>
                      <span style={{ fontSize: 10, color: C.text2 }}>{a.route}</span>
                    </div>
                    <span style={{ fontSize: 10, color: C.text2 }}>{a.awb} AWB</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: SEV_COLOR[a.sev], fontFamily: "monospace" }}>T-{a.remaining}</span>
                    <div style={{ fontSize: 10, color: C.text2 }}>
                      Cut {a.cutoff} / Dep {a.dept}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Terbaru */}
          <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.borderSoft}`, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: `1px solid ${C.borderSoft}`, flexShrink: 0 }}>
              <SecTitle count={shipments.length} badge="neutral">Shipment Terbaru</SecTitle>
              <button onClick={() => navigate("/shipment-ledger")} style={{ fontSize: 10, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                Buka Ledger <ArrowRight size={10} />
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr style={{ height: 28, background: C.surface2 }}>
                  {["AWB", "Pengirim", "Rute", "Flight", "Status", "Waktu"].map(h => <th key={h} style={TH}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {shipments.map(s => (
                  <tr key={s.awb} style={{ height: 34, borderTop: `1px solid ${C.borderSoft}`, cursor: "pointer" }}
                    onClick={() => navigate("/awb-tracking")}
                    onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0 10px", fontSize: 11, fontWeight: 600, color: C.accent, fontFamily: "monospace" }}>{s.awb}</td>
                    <td style={{ padding: "0 10px", fontSize: 11, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{s.sender}</td>
                    <td style={{ padding: "0 10px", fontSize: 11, color: C.text, fontFamily: "monospace" }}>{s.route}</td>
                    <td style={{ padding: "0 10px", fontSize: 11, fontWeight: 600, color: C.text, fontFamily: "monospace" }}>{s.flight}</td>
                    <td style={{ padding: "0 10px" }}><Pill value={s.status} map={STATUS_PILL} /></td>
                    <td style={{ padding: "0 10px", fontSize: 11, color: C.text2, fontFamily: "monospace" }}>{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, overflow: "hidden" }}>

          {/* Perlu Tindakan */}
          <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.borderSoft}`, overflow: "hidden", flexShrink: 0 }}>
            <div style={{ padding: "7px 12px", borderBottom: `1px solid ${C.borderSoft}` }}>
              <SecTitle count={actions.length} badge="danger">Perlu Tindakan</SecTitle>
            </div>
            {actions.map((item, i) => (
              <div key={item.awb} onClick={() => navigate("/shipment-ledger")} style={{
                display: "flex", gap: 8, padding: "7px 12px", cursor: "pointer",
                borderTop: i > 0 ? `1px solid ${C.borderSoft}` : "none",
                alignItems: "flex-start",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width: 5, height: 5, borderRadius: 3, background: PRIORITY_PILL[item.priority]?.color || C.text2, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{item.awb}</span>
                    <Pill value={item.priority} map={PRIORITY_PILL} />
                    <span style={{ fontSize: 9, color: C.text2, marginLeft: "auto", flexShrink: 0 }}>{item.elapsed}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.text, fontWeight: 500, lineHeight: "15px", marginTop: 1 }}>{item.issue}</div>
                  <div style={{ fontSize: 10, color: C.text2, lineHeight: "13px" }}>{item.route}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Aktivitas Terbaru */}
          <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.borderSoft}`, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "7px 12px", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <SecTitle>Aktivitas Terbaru</SecTitle>
              <span style={{ height: 14, padding: "0 5px", borderRadius: 3, background: C.successA08, fontSize: 9, fontWeight: 700, color: C.success, display: "inline-flex", alignItems: "center" }}>LIVE</span>
            </div>
            <div style={{ flex: 1 }}>
              {activity.map((u, i) => (
                <div key={i} onClick={() => navigate("/activity-log")} style={{
                  display: "flex", gap: 8, padding: "6px 12px", cursor: "pointer",
                  borderTop: i > 0 ? `1px solid ${C.borderSoft}` : "none",
                  alignItems: "flex-start",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: C.text2, flexShrink: 0, paddingTop: 1 }}>{u.time}</span>
                  <div style={{ width: 5, height: 5, borderRadius: 3, background: SEV_COLOR[u.sev], flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 10, color: C.text, flex: 1, lineHeight: "14px" }}>{u.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aksi Cepat */}
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {[
              { label: "Cari AWB", icon: Search, to: "/awb-tracking" },
              { label: "Ledger", icon: FileText, to: "/shipment-ledger" },
              { label: "Flights", icon: Plane, to: "/flight-board" },
              { label: "Log", icon: Activity, to: "/activity-log" },
            ].map(a => {
              const AIcon = a.icon;
              return (
                <button key={a.label} onClick={() => navigate(a.to)} style={{
                  flex: 1, height: 30, borderRadius: 8,
                  border: `1px solid ${C.borderSoft}`, background: C.surface,
                  color: C.text2, fontSize: 10, fontWeight: 500,
                  fontFamily: "Inter, sans-serif", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text2; }}
                >
                  <AIcon size={12} /> {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}