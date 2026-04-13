import { useState } from "react";
import { C } from "./tokens";
import { Search, RotateCcw, Printer, Share2, AlertTriangle, Check, Copy } from "lucide-react";

/* ═══════════════ MOCK DATA ═══════════════ */
interface TrackingEvent {
  status: string; location: string; timestamp: string; detail: string; completed: boolean;
}

interface ShipmentResult {
  awb: string; origin: string; destination: string; commodity: string;
  pieces: number; weight: string; shipper: string; consignee: string;
  flight: string; currentStatus: string; bookedDate: string; estimatedArrival: string;
  events: TrackingEvent[];
}

const MOCK_DB: Record<string, ShipmentResult> = {
  "126-84720193": {
    awb: "126-84720193", origin: "CGK", destination: "KNO", commodity: "Elektronik — Consumer Goods",
    pieces: 12, weight: "840 kg", shipper: "PT Maju Jaya", consignee: "CV Medan Sejahtera",
    flight: "GA-180", currentStatus: "Departed", bookedDate: "2026-04-11", estimatedArrival: "2026-04-12 18:30 WIB",
    events: [
      { status: "Received", location: "CGK — Warehouse A", timestamp: "2026-04-11 08:22 WIB", detail: "Shipment diterima di warehouse, acceptance check passed", completed: true },
      { status: "Sortation", location: "CGK — Sort Facility", timestamp: "2026-04-11 14:10 WIB", detail: "Sorted dan assigned ke flight GA-180, ULD built", completed: true },
      { status: "Loaded to Aircraft", location: "CGK — Gate 14", timestamp: "2026-04-12 06:38 WIB", detail: "Loaded ke aircraft PK-GIA, position 32L", completed: true },
      { status: "Departed", location: "CGK — Runway 25L", timestamp: "2026-04-12 07:15 WIB", detail: "Flight GA-180 departed on schedule", completed: true },
      { status: "Arrived", location: "KNO — Terminal Kargo", timestamp: "2026-04-12 18:30 WIB", detail: "Estimasi kedatangan", completed: false },
    ],
  },
  "126-93018472": {
    awb: "126-93018472", origin: "CGK", destination: "DPS", commodity: "Spare Part Otomotif",
    pieces: 6, weight: "320 kg", shipper: "CV Logistik Nusantara", consignee: "PT Bali Motor",
    flight: "GA-714", currentStatus: "Sortation", bookedDate: "2026-04-11", estimatedArrival: "2026-04-12 16:00 WIB",
    events: [
      { status: "Received", location: "CGK — Warehouse B", timestamp: "2026-04-11 10:45 WIB", detail: "Shipment diterima, verifikasi berat OK", completed: true },
      { status: "Sortation", location: "CGK — Sort Facility", timestamp: "2026-04-12 06:20 WIB", detail: "Dalam proses sortasi, menunggu cutoff GA-714", completed: true },
      { status: "Loaded to Aircraft", location: "CGK", timestamp: "", detail: "Pending", completed: false },
      { status: "Departed", location: "CGK", timestamp: "", detail: "Pending", completed: false },
      { status: "Arrived", location: "DPS", timestamp: "", detail: "Pending", completed: false },
    ],
  },
  "126-10294738": {
    awb: "126-10294738", origin: "CGK", destination: "SUB", commodity: "Bahan Kimia — Dangerous Goods",
    pieces: 4, weight: "180 kg", shipper: "PT Chem Indo", consignee: "PT Surabaya Chemical",
    flight: "QF-182", currentStatus: "On Hold", bookedDate: "2026-04-10", estimatedArrival: "TBD",
    events: [
      { status: "Received", location: "CGK — DG Facility", timestamp: "2026-04-10 11:30 WIB", detail: "DG shipment diterima, deklarasi Class 3 verified", completed: true },
      { status: "Sortation", location: "CGK", timestamp: "", detail: "On Hold — DG declaration belum ditandatangani", completed: false },
      { status: "Loaded to Aircraft", location: "CGK", timestamp: "", detail: "Pending", completed: false },
      { status: "Departed", location: "CGK", timestamp: "", detail: "Pending", completed: false },
      { status: "Arrived", location: "SUB", timestamp: "", detail: "Pending", completed: false },
    ],
  },
  "126-48291037": {
    awb: "126-48291037", origin: "CGK", destination: "BPN", commodity: "Farmasi — Temperature Controlled",
    pieces: 3, weight: "95 kg", shipper: "PT Farma Sehat", consignee: "RS Balikpapan",
    flight: "GA-520", currentStatus: "Arrived", bookedDate: "2026-04-09", estimatedArrival: "2026-04-10 14:00 WIB",
    events: [
      { status: "Received", location: "CGK — Cold Chain WH", timestamp: "2026-04-09 08:00 WIB", detail: "Shipment diterima, verifikasi suhu +4.2°C OK", completed: true },
      { status: "Sortation", location: "CGK — Sort Facility", timestamp: "2026-04-09 12:30 WIB", detail: "Sorted ke cold ULD, assigned GA-520", completed: true },
      { status: "Loaded to Aircraft", location: "CGK — Gate 8", timestamp: "2026-04-10 05:20 WIB", detail: "Loaded ke aircraft, cold chain maintained", completed: true },
      { status: "Departed", location: "CGK — Runway 25R", timestamp: "2026-04-10 06:00 WIB", detail: "Flight GA-520 departed on schedule", completed: true },
      { status: "Arrived", location: "BPN — Kargo Terminal", timestamp: "2026-04-10 14:12 WIB", detail: "Tiba dan offloaded, cold chain inspection cleared", completed: true },
    ],
  },
};

const RECENT_SEARCHES = [
  { awb: "126-84720193", route: "CGK → KNO", status: "Departed", time: "2 mnt lalu" },
  { awb: "126-93018472", route: "CGK → DPS", status: "Sortation", time: "18 mnt lalu" },
  { awb: "126-48291037", route: "CGK → BPN", status: "Arrived", time: "1 jam lalu" },
  { awb: "126-10294738", route: "CGK → SUB", status: "On Hold", time: "2 jam lalu" },
];

/* ═══════════════ STYLE HELPERS ═══════════════ */
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Received: { bg: C.accentA08, color: C.accent },
  Sortation: { bg: C.warningA08, color: C.warning },
  "Loaded to Aircraft": { bg: C.accentA08, color: C.accent },
  Departed: { bg: C.primaryA08, color: C.primary },
  Arrived: { bg: C.successA08, color: C.success },
  "On Hold": { bg: C.dangerA08, color: C.danger },
};

function Pill({ value }: { value: string }) {
  const s = STATUS_STYLES[value] || { bg: C.surface2, color: C.text2 };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 10px", borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{value}</span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.borderSoft}`, padding: 20, ...style }}>{children}</div>;
}

/* ═══════════════ TIMELINE ═══════════════ */
function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {events.map((ev, i) => {
        const isLast = i === events.length - 1;
        return (
          <div key={ev.status} style={{ display: "flex", gap: 16, minHeight: isLast ? "auto" : 72 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
              <div style={{
                width: ev.completed ? 12 : 10, height: ev.completed ? 12 : 10, borderRadius: 999,
                background: ev.completed ? C.accent : C.surface,
                border: ev.completed ? `2px solid ${C.accent}` : `2px solid ${C.borderSoft}`,
                flexShrink: 0, marginTop: 4,
              }} />
              {!isLast && <div style={{ width: 2, flex: 1, minHeight: 16, background: ev.completed && events[i + 1]?.completed ? C.accent : C.borderSoft, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: ev.completed ? C.text : C.text2 }}>{ev.status}</span>
                {!ev.completed && <span style={{ display: "inline-flex", alignItems: "center", height: 18, padding: "0 8px", borderRadius: 4, background: C.surface2, fontSize: 10, fontWeight: 600, color: C.text2 }}>Pending</span>}
              </div>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 2 }}>{ev.location}</div>
              {ev.timestamp && <div style={{ fontSize: 12, color: C.accent, fontFamily: "monospace", fontWeight: 600, marginBottom: 2 }}>{ev.timestamp}</div>}
              <div style={{ fontSize: 12, color: ev.completed ? C.text : C.text2, lineHeight: "17px" }}>{ev.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════ NOT FOUND ═══════════════ */
function AWBNotFound({ awb, onRetry }: { awb: string; onRetry: () => void }) {
  return (
    <Card style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: C.warningA06, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AlertTriangle size={28} color={C.warning} />
      </div>
      <h2 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 20, color: C.text, margin: 0 }}>AWB Tidak Ditemukan</h2>
      <p style={{ fontSize: 14, color: C.text2, margin: 0, maxWidth: 400, lineHeight: "21px" }}>
        Nomor AWB <span style={{ fontFamily: "monospace", fontWeight: 600, color: C.text }}>{awb}</span> tidak ditemukan di sistem. Periksa kembali format AWB dan coba lagi.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onRetry} style={{ height: 38, padding: "0 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Coba Lagi</button>
        <button onClick={onRetry} style={{ height: 38, padding: "0 20px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Bersihkan</button>
      </div>
      <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 10, background: C.surface2, fontSize: 12, color: C.text2, lineHeight: "18px" }}>
        <span style={{ fontWeight: 600, color: C.text }}>Tips:</span> Format AWB: <span style={{ fontFamily: "monospace" }}>XXX-XXXXXXXX</span> (3-digit prefix + 8-digit serial). Contoh: <span style={{ fontFamily: "monospace", color: C.accent }}>126-84720193</span>
      </div>
    </Card>
  );
}

/* ═══════════════ RESULT ═══════════════ */
function TrackingResult({ result }: { result: ShipmentResult }) {
  const completedCount = result.events.filter(e => e.completed).length;
  const progressPct = Math.round((completedCount / result.events.length) * 100);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  function handleAction(label: string) {
    if (label === "Cetak Ringkasan") {
      const now = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AWB ${result.awb} - Tracking Summary</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:24px 32px;color:#181C1F;font-size:12px}
  .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #003D9B;padding-bottom:12px;margin-bottom:16px}
  .logo{display:flex;align-items:center;gap:10px}
  .logo-box{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#003D9B,#0052CC);display:flex;align-items:center;justify-content:center;color:#FFF;font-weight:700;font-size:16px}
  .company{font-size:16px;font-weight:700;color:#003D9B}
  .sub{font-size:9px;color:#5B6472;letter-spacing:0.5px}
  .meta{text-align:right;font-size:10px;color:#5B6472;line-height:16px}
  h2{font-size:14px;color:#003D9B;margin:16px 0 8px;border-bottom:1px solid #E0E5F0;padding-bottom:4px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:12px}
  .field label{font-size:9px;font-weight:700;color:#5B6472;text-transform:uppercase;letter-spacing:0.5px}
  .field .val{font-size:13px;font-weight:600;color:#181C1F;margin-top:2px}
  .route-box{display:flex;align-items:center;justify-content:center;gap:16px;padding:12px;background:#F0F2F7;border-radius:8px;margin-bottom:12px}
  .route-code{font-size:24px;font-weight:800;color:#181C1F}
  .arrow{font-size:18px;color:#0059CF}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  th{text-align:left;font-size:9px;font-weight:700;color:#5B6472;text-transform:uppercase;padding:6px 8px;border-bottom:2px solid #003D9B;letter-spacing:0.5px}
  td{padding:6px 8px;border-bottom:1px solid #E0E5F0;font-size:11px}
  .done{color:#1F9D55;font-weight:600}
  .pending{color:#5B6472}
  .pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600}
  .pill-ok{background:#1F9D5520;color:#1F9D55}
  .pill-warn{background:#C97A0020;color:#C97A00}
  .pill-info{background:#0059CF20;color:#0059CF}
  .footer{margin-top:20px;padding-top:10px;border-top:2px solid #003D9B;font-size:9px;color:#5B6472;display:flex;justify-content:space-between}
  @media print{body{padding:12px 16px}}
</style></head><body>
<div class="header">
  <div class="logo"><div class="logo-box">&#9889;</div><div><div class="company">EKSPEDISI PETIR</div><div class="sub">CARGO OPERATIONS CONTROL DESK</div></div></div>
  <div class="meta">Bandara Internasional Soekarno-Hatta (CGK)<br>Tangerang, Banten, Indonesia<br>Dicetak: ${now}<br>Operator: Rina Sari (Supervisor)</div>
</div>
<h2>TRACKING SUMMARY - AWB ${result.awb}</h2>
<div class="route-box"><span class="route-code">${result.origin}</span><span class="arrow">&#10132;</span><span class="route-code">${result.destination}</span></div>
<div class="grid">
  <div class="field"><label>AWB Number</label><div class="val">${result.awb}</div></div>
  <div class="field"><label>Flight</label><div class="val">${result.flight}</div></div>
  <div class="field"><label>Koli / Berat</label><div class="val">${result.pieces} koli / ${result.weight}</div></div>
  <div class="field"><label>Status</label><div class="val"><span class="pill pill-info">${result.currentStatus}</span></div></div>
  <div class="field"><label>Pengirim</label><div class="val">${result.shipper}</div></div>
  <div class="field"><label>Penerima</label><div class="val">${result.consignee}</div></div>
  <div class="field"><label>Komoditas</label><div class="val">${result.commodity}</div></div>
  <div class="field"><label>Est. Tiba</label><div class="val">${result.estimatedArrival}</div></div>
</div>
<h2>TRACKING TIMELINE</h2>
<table><thead><tr><th>Status</th><th>Lokasi</th><th>Waktu</th><th>Detail</th><th>Progres</th></tr></thead><tbody>
${result.events.map(e => `<tr><td><strong>${e.status}</strong></td><td>${e.location}</td><td>${e.timestamp || "-"}</td><td>${e.detail}</td><td>${e.completed ? '<span class="pill pill-ok">Done</span>' : '<span class="pill pill-warn">Pending</span>'}</td></tr>`).join("")}
</tbody></table>
<div class="footer"><div>Dokumen ini digenerate otomatis oleh sistem Ekspedisi Petir v1.0.0<br>(c) ${new Date().getFullYear()} PT Ekspedisi Petir</div><div style="text-align:right">Ref: TRK-${result.awb}<br>Halaman 1 dari 1</div></div>
</body></html>`;
      const w = window.open("", "_blank", "width=800,height=700");
      if (w) { w.document.write(html); w.document.close(); w.document.title = `AWB ${result.awb} - Tracking Summary`; setTimeout(() => w.print(), 300); }
      setActionFeedback("Ringkasan dikirim ke printer");
    } else if (label === "Bagikan Link Tracking") {
      const url = `${window.location.origin}/awb-tracking?awb=${result.awb}`;
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setActionFeedback("Link tracking disalin ke clipboard");
    } else if (label === "Laporkan Masalah") {
      setActionFeedback("Laporan masalah terkirim ke supervisor");
    }
    setTimeout(() => setActionFeedback(null), 2500);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div style={{ position: "fixed", top: 80, right: 32, zIndex: 200, padding: "10px 18px", borderRadius: 10, background: C.success, color: "#FFF", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> {actionFeedback}
        </div>
      )}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 18, color: C.text }}>AWB {result.awb}</span>
            <Pill value={result.currentStatus} />
          </div>
          <span style={{ fontSize: 12, color: C.text2 }}>Booked: {result.bookedDate}</span>
        </div>
        <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Rute", value: `${result.origin} → ${result.destination}` },
            { label: "Flight", value: result.flight },
            { label: "Koli / Berat", value: `${result.pieces} koli / ${result.weight}` },
            { label: "Est. Tiba", value: result.estimatedArrival },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: 11, color: C.text2, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{f.value}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: C.text2 }}>Progress Tracking</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>{progressPct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.surface2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`, transition: "width 0.3s" }} />
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>Tracking Timeline</span>
          </div>
          <TrackingTimeline events={result.events} />
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>Detail Shipment</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Komoditas", value: result.commodity },
                { label: "Pengirim", value: result.shipper },
                { label: "Penerima", value: result.consignee },
                { label: "Koli", value: String(result.pieces) },
                { label: "Berat Kotor", value: result.weight },
                { label: "Flight", value: result.flight },
                { label: "Asal", value: result.origin },
                { label: "Tujuan", value: result.destination },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontSize: 12, color: C.text2, fontWeight: 500, flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 500, textAlign: "right" }}>{f.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: C.text }}>Aksi Cepat</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Cetak Ringkasan", icon: Printer },
                { label: "Bagikan Link Tracking", icon: Share2 },
                { label: "Laporkan Masalah", icon: AlertTriangle },
              ].map(a => {
                const AIcon = a.icon;
                return (
                  <button key={a.label} onClick={() => handleAction(a.label)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.borderSoft}`, background: C.bg, cursor: "pointer", width: "100%", textAlign: "left" }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.bg)}
                  >
                    <AIcon size={14} color={C.text2} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
type ViewState = "idle" | "loading" | "found" | "notfound";

export function AWBTracking() {
  const [awbInput, setAwbInput] = useState("");
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [result, setResult] = useState<ShipmentResult | null>(null);
  const [searchedAwb, setSearchedAwb] = useState("");
  const [validationError, setValidationError] = useState("");

  function validateAWB(value: string): boolean {
    return /^\d{3}-\d{8}$/.test(value);
  }

  function handleSearch() {
    const trimmed = awbInput.trim();
    if (!trimmed) return;
    setValidationError("");
    if (!validateAWB(trimmed)) {
      setValidationError("Format AWB tidak valid. Gunakan format: XXX-XXXXXXXX (contoh: 126-84720193)");
      return;
    }
    setSearchedAwb(trimmed);
    setViewState("loading");
    setTimeout(() => {
      const found = MOCK_DB[trimmed];
      if (found) { setResult(found); setViewState("found"); }
      else { setResult(null); setViewState("notfound"); }
    }, 500);
  }

  function handleRetry() {
    setAwbInput(""); setViewState("idle"); setResult(null); setSearchedAwb(""); setValidationError("");
  }

  function handleQuickSearch(awb: string) {
    setAwbInput(awb); setSearchedAwb(awb); setValidationError("");
    setViewState("loading");
    setTimeout(() => {
      const found = MOCK_DB[awb];
      if (found) { setResult(found); setViewState("found"); }
      else { setResult(null); setViewState("notfound"); }
    }, 500);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingBottom: 32 }}>
      <div>
        <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 24, color: C.text, margin: 0 }}>AWB Tracking</h1>
        <p style={{ fontSize: 12, color: C.text2, margin: 0, marginTop: 2 }}>Lacak status dan milestone pengiriman berdasarkan nomor AWB</p>
      </div>

      {/* Search */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, maxWidth: 460 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Nomor Air Waybill</label>
            <input
              value={awbInput}
              onChange={e => setAwbInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Masukkan nomor AWB (contoh: 126-84720193)"
              style={{ width: "100%", height: 40, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 14px", fontSize: 14, fontFamily: "Inter, sans-serif", color: C.text, background: C.surface, outline: "none", boxSizing: "border-box" }}
            />
            {validationError && <div style={{ fontSize: 12, color: C.danger, marginTop: 4 }}>{validationError}</div>}
          </div>
          <button onClick={handleSearch} disabled={!awbInput.trim()} style={{
            height: 40, padding: "0 24px", borderRadius: 10, border: "none",
            background: awbInput.trim() ? `linear-gradient(135deg, ${C.primary}, ${C.primary2})` : C.surface2,
            color: awbInput.trim() ? "#FFF" : C.text2,
            fontSize: 13, fontWeight: 600, cursor: awbInput.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Search size={14} /> Lacak
          </button>
          {viewState !== "idle" && (
            <button onClick={handleRetry} style={{ height: 40, padding: "0 16px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text2, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <RotateCcw size={14} /> Bersihkan
            </button>
          )}
        </div>
      </Card>

      {/* Loading */}
      {viewState === "loading" && (
        <Card style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, border: `3px solid ${C.surface2}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 13, color: C.text2 }}>Mencari AWB {searchedAwb}...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </Card>
      )}

      {viewState === "notfound" && <AWBNotFound awb={searchedAwb} onRetry={handleRetry} />}
      {viewState === "found" && result && <TrackingResult result={result} />}

      {/* Idle */}
      {viewState === "idle" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
          <Card>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>Pencarian Terakhir</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr style={{ height: 38, background: C.surface2 }}>
                  {["AWB", "Rute", "Status", "Waktu", ""].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0 14px", fontSize: 11, fontWeight: 700, color: C.text2, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_SEARCHES.map(s => (
                  <tr key={s.awb} style={{ height: "var(--ep-row-h)" as unknown as number, borderTop: `1px solid ${C.borderSoft}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0 14px", fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: "monospace" }}>{s.awb}</td>
                    <td style={{ padding: "0 14px", fontSize: 13, color: C.text }}>{s.route}</td>
                    <td style={{ padding: "0 14px" }}><Pill value={s.status} /></td>
                    <td style={{ padding: "0 14px", fontSize: 12, color: C.text2 }}>{s.time}</td>
                    <td style={{ padding: "0 14px" }}>
                      <button onClick={() => handleQuickSearch(s.awb)} style={{ height: 26, padding: "0 10px", borderRadius: 6, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Lacak</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>Referensi Cepat</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px 12px", borderRadius: 10, background: C.bg, border: `1px solid ${C.borderSoft}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>Format AWB</div>
                <div style={{ fontSize: 12, color: C.text2, lineHeight: "18px" }}>
                  3-digit airline prefix + 8-digit serial<br />
                  Contoh: <span style={{ fontFamily: "monospace", fontWeight: 600, color: C.accent }}>126-84720193</span>
                </div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 10, background: C.bg, border: `1px solid ${C.borderSoft}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Status Legend</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {["Received", "Sortation", "Loaded to Aircraft", "Departed", "Arrived"].map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Pill value={s} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}