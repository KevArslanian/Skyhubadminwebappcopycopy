import { useState } from "react";
import { C } from "./tokens";
import { Search, Plus, X, FileText, Download, Check } from "lucide-react";
import { generatePdfReport } from "./pdf-report";

/* ═══════════════ TYPES & DATA ═══════════════ */
interface Shipment {
  awb: string; sender: string; origin: string; dest: string; flight: string;
  status: string; security: string; priority: string; pieces: number;
  weight: string; commodity: string; updated: string; consignee: string;
}

const SHIPMENTS: Shipment[] = [
  { awb: "126-84720193", sender: "PT Maju Jaya", origin: "CGK", dest: "KNO", flight: "GA-180", status: "Processing", security: "Cleared", priority: "Normal", pieces: 12, weight: "840 kg", commodity: "Elektronik", updated: "13:22", consignee: "CV Medan Sejahtera" },
  { awb: "126-93018472", sender: "CV Logistik Nusantara", origin: "CGK", dest: "DPS", flight: "GA-714", status: "Cleared", security: "Cleared", priority: "High", pieces: 6, weight: "320 kg", commodity: "Spare Part", updated: "12:45", consignee: "PT Bali Motor" },
  { awb: "126-10294738", sender: "PT Chem Indo", origin: "CGK", dest: "SUB", flight: "QF-182", status: "On Hold", security: "Pending", priority: "Critical", pieces: 4, weight: "180 kg", commodity: "Bahan Kimia (DG)", updated: "12:18", consignee: "PT Surabaya Chemical" },
  { awb: "126-57381920", sender: "PT Elektronik Global", origin: "CGK", dest: "UPG", flight: "QG-931", status: "Processing", security: "Cleared", priority: "Normal", pieces: 18, weight: "1,240 kg", commodity: "Elektronik", updated: "11:55", consignee: "CV Makassar Tech" },
  { awb: "126-20384756", sender: "CV Agri Prima", origin: "CGK", dest: "PLM", flight: "ID-6570", status: "Cleared", security: "Cleared", priority: "Normal", pieces: 8, weight: "520 kg", commodity: "Perishable", updated: "11:30", consignee: "PT Palembang Fresh" },
  { awb: "126-48291037", sender: "PT Farma Sehat", origin: "CGK", dest: "BPN", flight: "GA-520", status: "Cleared", security: "Cleared", priority: "High", pieces: 3, weight: "95 kg", commodity: "Farmasi", updated: "10:48", consignee: "RS Balikpapan" },
  { awb: "126-73920184", sender: "PT Tekstil Mandiri", origin: "CGK", dest: "SOC", flight: "QF-234", status: "Ready", security: "Cleared", priority: "Normal", pieces: 24, weight: "1,640 kg", commodity: "Tekstil", updated: "10:15", consignee: "CV Solo Garment" },
  { awb: "126-39201847", sender: "CV Indo Machinery", origin: "CGK", dest: "BDJ", flight: "GA-540", status: "In Transit", security: "Cleared", priority: "Normal", pieces: 2, weight: "2,100 kg", commodity: "Mesin Industri", updated: "09:42", consignee: "PT Banjarmasin Works" },
  { awb: "126-01928374", sender: "PT AquaFresh", origin: "CGK", dest: "PDG", flight: "ID-6180", status: "Delivered", security: "Cleared", priority: "Normal", pieces: 10, weight: "680 kg", commodity: "Perishable", updated: "08:30", consignee: "CV Padang Segar" },
  { awb: "126-65830291", sender: "PT Dokumen Express", origin: "CGK", dest: "MDC", flight: "GA-650", status: "In Transit", security: "Cleared", priority: "High", pieces: 1, weight: "12 kg", commodity: "Dokumen", updated: "08:05", consignee: "Kantor Manado" },
];

const STATUSES = ["All", "Processing", "Cleared", "On Hold", "Ready", "In Transit", "Delivered"] as const;

/* ═══════════════ STYLE HELPERS ═══════════════ */
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Processing: { bg: C.accentA08, color: C.accent },
  Cleared: { bg: C.successA08, color: C.success },
  "On Hold": { bg: C.dangerA08, color: C.danger },
  Ready: { bg: C.successA08, color: C.success },
  "In Transit": { bg: C.accentA08, color: C.accent },
  Delivered: { bg: C.successA06, color: C.success },
  Pending: { bg: C.warningA08, color: C.warning },
  Critical: { bg: C.dangerA08, color: C.danger },
  High: { bg: C.warningA08, color: C.warning },
  Normal: { bg: C.surface2, color: C.text2 },
};

function Pill({ value }: { value: string }) {
  const s = STATUS_COLORS[value] || { bg: C.surface2, color: C.text2 };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 9px", borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{value}</span>
  );
}

const TH: React.CSSProperties = {
  textAlign: "left", padding: "0 12px", fontSize: 11, fontWeight: 700,
  color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px",
  fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
};

const selectStyle: React.CSSProperties = {
  height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 10px",
  fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text2, background: C.surface, outline: "none", cursor: "pointer",
};

/* ═══════════════ DETAIL DRAWER ═══════════════ */
function DetailDrawer({ shipment, onClose, onUpdateStatus }: { shipment: Shipment; onClose: () => void; onUpdateStatus: (awb: string, newStatus: string) => void }) {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [docAttached, setDocAttached] = useState(false);

  const TIMELINE = [
    { label: "Booking confirmed", time: "Apr 11, 09:00", done: true },
    { label: "Diterima di warehouse", time: "Apr 11, 10:20", done: true },
    { label: "Security screening", time: "Apr 12, 08:15", done: true },
    { label: "Staged for loading", time: shipment.status === "On Hold" ? "Pending" : "Apr 12, 11:00", done: !["On Hold", "Processing"].includes(shipment.status) },
    { label: "Loaded / Departed", time: ["In Transit", "Delivered"].includes(shipment.status) ? "Apr 12, 12:30" : "Pending", done: ["In Transit", "Delivered"].includes(shipment.status) },
    { label: "Delivered", time: shipment.status === "Delivered" ? "Apr 12, 16:00" : "Pending", done: shipment.status === "Delivered" },
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
      <div style={{ position: "relative", width: 480, height: "100%", background: C.surface, borderLeft: `1px solid ${C.borderSoft}`, overflowY: "auto", boxShadow: "-8px 0 32px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${C.borderSoft}`, position: "sticky", top: 0, background: C.surface, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>Detail Shipment</span>
            <Pill value={shipment.status} />
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color={C.text2} />
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* AWB & Info */}
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: C.accent, marginBottom: 12 }}>{shipment.awb}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "Komoditas", v: shipment.commodity },
                { l: "Rute", v: `${shipment.origin} → ${shipment.dest}` },
                { l: "Koli", v: String(shipment.pieces) },
                { l: "Berat", v: shipment.weight },
                { l: "Pengirim", v: shipment.sender },
                { l: "Penerima", v: shipment.consignee },
                { l: "Flight", v: shipment.flight },
                { l: "Updated", v: shipment.updated },
              ].map(f => (
                <div key={f.l}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{f.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: C.borderSoft }} />

          {/* Status Badges */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Status</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
                <div style={{ fontSize: 11, color: C.text2 }}>Shipment</div>
                <div style={{ marginTop: 3 }}><Pill value={shipment.status} /></div>
              </div>
              <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
                <div style={{ fontSize: 11, color: C.text2 }}>Security</div>
                <div style={{ marginTop: 3 }}><Pill value={shipment.security} /></div>
              </div>
              <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
                <div style={{ fontSize: 11, color: C.text2 }}>Prioritas</div>
                <div style={{ marginTop: 3 }}><Pill value={shipment.priority} /></div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: C.borderSoft }} />

          {/* Timeline */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Tracking Timeline</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {TIMELINE.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, minHeight: 40 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: step.done ? C.success : C.borderSoft, border: step.done ? "none" : `2px solid ${C.borderSoft}`, flexShrink: 0, marginTop: 4 }} />
                    {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: step.done ? C.successA25 : C.borderSoft }} />}
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: step.done ? C.text : C.text2 }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: C.text2, marginTop: 1 }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: C.borderSoft }} />

          {/* Log Perubahan */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Log Perubahan</div>
            {[
              { time: "13:22", user: "Rina Sari", action: "Status diupdate ke " + shipment.status },
              { time: "10:20", user: "Budi Santoso", action: "Shipment diterima di warehouse" },
              { time: "09:00", user: "System", action: "Booking confirmed" },
            ].map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: C.text2, flexShrink: 0 }}>{log.time}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.text, flexShrink: 0 }}>{log.user}</span>
                <span style={{ fontSize: 11, color: C.text2 }}>{log.action}</span>
              </div>
            ))}
          </div>

          {/* Catatan Operator */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Catatan Operator</div>
            <textarea
              placeholder="Tambahkan catatan..."
              value={note}
              onChange={e => { setNote(e.target.value); setNoteSaved(false); }}
              style={{ width: "100%", height: 60, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "8px 12px", fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text, resize: "none", outline: "none", boxSizing: "border-box" }}
            />
            {noteSaved && <div style={{ fontSize: 11, color: C.success, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Check size={12} /> Catatan tersimpan</div>}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => {
              const nextStatus: Record<string, string> = { "Processing": "Cleared", "On Hold": "Processing", "Cleared": "Ready", "Ready": "In Transit", "In Transit": "Delivered" };
              const ns = nextStatus[shipment.status] || "Cleared";
              onUpdateStatus(shipment.awb, ns);
              setStatusUpdated(true);
              setTimeout(() => setStatusUpdated(false), 2000);
            }} style={{ height: 36, flex: 1, borderRadius: 10, border: "none", background: statusUpdated ? C.success : `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
              {statusUpdated ? "✓ Status Diupdate" : "Update Status"}
            </button>
            <button onClick={() => { setDocAttached(true); setTimeout(() => setDocAttached(false), 2000); }} style={{ height: 36, flex: 1, borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: docAttached ? C.successA08 : C.surface, color: docAttached ? C.success : C.text, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              {docAttached ? "✓ Dokumen Dilampirkan" : "Lampirkan Dokumen"}
            </button>
          </div>
          {note && (
            <button onClick={() => { setNoteSaved(true); }} style={{ height: 32, borderRadius: 8, border: `1px solid ${C.borderSoft}`, background: C.surface2, color: C.text, fontSize: 11, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              Simpan Catatan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export function ShipmentLedger() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [flightFilter, setFlightFilter] = useState("All");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [sortKey, setSortKey] = useState<"updated" | "priority">("updated");
  const [shipments, setShipments] = useState(SHIPMENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flights = ["All", ...Array.from(new Set(shipments.map(s => s.flight)))];

  const filtered = shipments.filter(s => {
    if (statusFilter !== "All" && s.status !== statusFilter) return false;
    if (flightFilter !== "All" && s.flight !== flightFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.awb.includes(q) || s.sender.toLowerCase().includes(q) || s.commodity.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortKey === "priority") {
      const order: Record<string, number> = { Critical: 0, High: 1, Normal: 2 };
      return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
    }
    return 0;
  });

  function handleExportCSV() {
    const now = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
    const csvRows = [
      `"EKSPEDISI PETIR - CARGO OPS CONTROL"`,
      `"Bandara Internasional Soekarno-Hatta (CGK), Tangerang, Banten"`,
      `"Laporan Shipment Ledger"`,
      `"Tanggal Cetak: ${now}"`,
      `"Operator: Rina Sari (Supervisor)"`,
      `"Filter Status: ${statusFilter} | Filter Flight: ${flightFilter} | Total Data: ${filtered.length}"`,
      `""`,
      `"AWB","Pengirim","Penerima","Asal","Tujuan","Flight","Status","Security","Prioritas","Koli","Berat","Komoditas","Updated"`,
      ...filtered.map(s =>
        `"${s.awb}","${s.sender}","${s.consignee}","${s.origin}","${s.dest}","${s.flight}","${s.status}","${s.security}","${s.priority}","${s.pieces}","${s.weight}","${s.commodity}","${s.updated}"`
      ),
      `""`,
      `"--- Ringkasan ---"`,
      `"Total Shipment: ${filtered.length}"`,
      `"Processing: ${filtered.filter(s => s.status === 'Processing').length}"`,
      `"Cleared: ${filtered.filter(s => s.status === 'Cleared').length}"`,
      `"On Hold: ${filtered.filter(s => s.status === 'On Hold').length}"`,
      `"Ready: ${filtered.filter(s => s.status === 'Ready').length}"`,
      `"In Transit: ${filtered.filter(s => s.status === 'In Transit').length}"`,
      `"Delivered: ${filtered.filter(s => s.status === 'Delivered').length}"`,
      `""`,
      `"Dokumen ini digenerate otomatis oleh sistem Ekspedisi Petir v1.0.0"`,
      `"(c) ${new Date().getFullYear()} PT Ekspedisi Petir - Cargo Operations Control Desk"`,
    ];
    const csv = csvRows.join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `shipment-ledger-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV berhasil diekspor");
  }

  function handleExportPDF() {
    generatePdfReport({
      title: "Laporan Shipment Ledger",
      subtitle: "Data seluruh pengiriman kargo aktif dan riwayat per hari ini",
      reportBadge: "SHIPMENT LEDGER",
      operator: "Rina Sari (Supervisor)",
      filtersApplied: `Status: ${statusFilter} | Flight: ${flightFilter} | Total: ${filtered.length} entri`,
      stats: [
        { label: "Total Shipment", value: filtered.length, bg: "#EEF2FF", fg: "#003D9B" },
        { label: "Processing",     value: filtered.filter(s => s.status === "Processing").length, bg: "#E8F0FE", fg: "#0059CF" },
        { label: "Cleared",        value: filtered.filter(s => s.status === "Cleared").length,    bg: "#E6F5EC", fg: "#1F9D55" },
        { label: "On Hold",        value: filtered.filter(s => s.status === "On Hold").length,    bg: "#FDECEA", fg: "#C62828" },
        { label: "Ready",          value: filtered.filter(s => s.status === "Ready").length,      bg: "#E6F5EC", fg: "#1F9D55" },
        { label: "In Transit",     value: filtered.filter(s => s.status === "In Transit").length, bg: "#E8F0FE", fg: "#0059CF" },
        { label: "Delivered",      value: filtered.filter(s => s.status === "Delivered").length,  bg: "#E6F5EC", fg: "#1F9D55" },
      ],
      columns: [
        { header: "AWB",         key: "awb",       width: "11%", align: "left"   },
        { header: "Pengirim",    key: "sender",     width: "12%", align: "left"   },
        { header: "Penerima",    key: "consignee",  width: "12%", align: "left"   },
        { header: "Rute",        key: "route",      width: "7%",  align: "center" },
        { header: "Flight",      key: "flight",     width: "7%",  align: "center" },
        { header: "Status",      key: "status",     width: "9%",  align: "center" },
        { header: "Security",    key: "security",   width: "9%",  align: "center" },
        { header: "Prioritas",   key: "priority",   width: "8%",  align: "center" },
        { header: "Koli",        key: "pieces",     width: "5%",  align: "center" },
        { header: "Berat",       key: "weight",     width: "7%",  align: "right"  },
        { header: "Komoditas",   key: "commodity",  width: "10%", align: "left"   },
        { header: "Update",      key: "updated",    width: "6%",  align: "center" },
      ],
      rows: filtered.map(s => ({
        awb: s.awb, sender: s.sender, consignee: s.consignee,
        route: `${s.origin}-${s.dest}`, flight: s.flight,
        status: s.status, security: s.security, priority: s.priority,
        pieces: s.pieces, weight: s.weight, commodity: s.commodity, updated: s.updated,
      })),
      filename: `shipment-ledger-${new Date().toISOString().slice(0, 10)}`,
    });
    showToast("PDF report dibuka di tab baru");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleUpdateStatus(awb: string, newStatus: string) {
    setShipments(prev => prev.map(s => s.awb === awb ? { ...s, status: newStatus, updated: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }) } : s));
    setSelected(prev => prev && prev.awb === awb ? { ...prev, status: newStatus } : prev);
    showToast(`AWB ${awb} diupdate ke ${newStatus}`);
  }

  function handleCreateShipment(data: Partial<Shipment>) {
    const newAwb = `126-${Math.floor(10000000 + Math.random() * 89999999)}`;
    const newShipment: Shipment = {
      awb: newAwb,
      sender: data.sender || "PT Baru",
      origin: data.origin || "CGK",
      dest: data.dest || "DPS",
      flight: data.flight || "GA-100",
      status: "Processing",
      security: "Pending",
      priority: data.priority || "Normal",
      pieces: data.pieces || 1,
      weight: data.weight || "10 kg",
      commodity: data.commodity || "Umum",
      updated: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }),
      consignee: data.consignee || "Penerima Baru",
    };
    setShipments(prev => [newShipment, ...prev]);
    setShowCreate(false);
    showToast(`Shipment ${newAwb} berhasil dibuat`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 32, zIndex: 200, padding: "10px 18px", borderRadius: 10, background: C.success, color: "#FFF", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 24, color: C.text, margin: 0 }}>Shipment Ledger</h1>
          <p style={{ fontSize: 12, color: C.text2, margin: 0, marginTop: 2 }}>Kelola dan pantau seluruh data pengiriman kargo</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handleExportCSV} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export CSV
          </button>
          <button onClick={handleExportPDF} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={14} /> Export PDF
          </button>
          <button onClick={() => setShowCreate(true)} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Buat Shipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ position: "relative", width: 240 }}>
          <Search size={14} color={C.text2} style={{ position: "absolute", left: 10, top: 11 }} />
          <input
            placeholder="Cari AWB, pengirim..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 10px 0 32px", fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text, background: C.surface, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "Status: Semua" : s}</option>)}
        </select>
        <select value={flightFilter} onChange={e => setFlightFilter(e.target.value)} style={selectStyle}>
          {flights.map(f => <option key={f} value={f}>{f === "All" ? "Flight: Semua" : f}</option>)}
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value as any)} style={selectStyle}>
          <option value="updated">Urutkan: Terbaru</option>
          <option value="priority">Urutkan: Prioritas</option>
        </select>
        <input type="date" style={selectStyle} />
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: C.text }}>Daftar Shipment</span>
            <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: C.surface2, fontSize: 11, fontWeight: 600, color: C.text2, display: "inline-flex", alignItems: "center" }}>{filtered.length}</span>
          </div>
          <span style={{ fontSize: 11, color: C.text2 }}>Klik baris untuk detail</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr style={{ height: 36, background: C.surface2 }}>
              {["AWB", "Pengirim", "Asal", "Tujuan", "Flight", "Status", "Security", "Prioritas", "Updated"].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.awb} onClick={() => setSelected(s)} style={{ height: "var(--ep-row-h)" as unknown as number, borderTop: `1px solid ${C.borderSoft}`, cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 600, color: C.accent, fontFamily: "monospace" }}>{s.awb}</td>
                <td style={{ padding: "0 12px", fontSize: 12, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{s.sender}</td>
                <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "monospace" }}>{s.origin}</td>
                <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "monospace" }}>{s.dest}</td>
                <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 600, color: C.text, fontFamily: "monospace" }}>{s.flight}</td>
                <td style={{ padding: "0 12px" }}><Pill value={s.status} /></td>
                <td style={{ padding: "0 12px" }}><Pill value={s.security} /></td>
                <td style={{ padding: "0 12px" }}><Pill value={s.priority} /></td>
                <td style={{ padding: "0 12px", fontSize: 12, color: C.text2, fontFamily: "monospace" }}>{s.updated}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: C.text2, fontSize: 13 }}>Tidak ada shipment yang cocok dengan filter.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontSize: 11, color: C.text2 }}>Menampilkan {filtered.length} dari {shipments.length} shipment</span>
          <span style={{ fontSize: 11, color: C.text2 }}>Halaman 1 dari 1</span>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && <DetailDrawer shipment={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}

      {/* Create Shipment Modal */}
      {showCreate && <CreateShipmentModal onClose={() => setShowCreate(false)} onCreate={handleCreateShipment} />}
    </div>
  );
}

/* ═══════════════ CREATE MODAL ═══════════════ */
function CreateShipmentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: Partial<Shipment>) => void }) {
  const [sender, setSender] = useState("");
  const [dest, setDest] = useState("DPS");
  const [flight, setFlight] = useState("");
  const [commodity, setCommodity] = useState("");
  const [weight, setWeight] = useState("");
  const [pieces, setPieces] = useState("1");
  const [consignee, setConsignee] = useState("");
  const [priority, setPriority] = useState("Normal");

  const inputS: React.CSSProperties = {
    height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 12px",
    fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text, background: C.surface,
    outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "relative", width: 520, background: C.surface, borderRadius: 14, border: `1px solid ${C.borderSoft}`, boxShadow: "0 16px 48px rgba(0,0,0,0.12)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>Buat Shipment Baru</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color={C.text2} />
          </button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Pengirim</label>
              <input style={inputS} value={sender} onChange={e => setSender(e.target.value)} placeholder="Nama perusahaan pengirim" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Penerima</label>
              <input style={inputS} value={consignee} onChange={e => setConsignee(e.target.value)} placeholder="Nama penerima" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Tujuan</label>
              <select style={{ ...inputS, cursor: "pointer" }} value={dest} onChange={e => setDest(e.target.value)}>
                {["DPS", "SUB", "KNO", "UPG", "PLM", "BPN", "SOC", "BDJ", "PDG", "MDC"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Flight</label>
              <input style={inputS} value={flight} onChange={e => setFlight(e.target.value)} placeholder="GA-XXX" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Prioritas</label>
              <select style={{ ...inputS, cursor: "pointer" }} value={priority} onChange={e => setPriority(e.target.value)}>
                {["Normal", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Komoditas</label>
              <input style={inputS} value={commodity} onChange={e => setCommodity(e.target.value)} placeholder="Jenis barang" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Berat</label>
              <input style={inputS} value={weight} onChange={e => setWeight(e.target.value)} placeholder="contoh: 500 kg" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4, display: "block" }}>Koli</label>
              <input style={inputS} type="number" value={pieces} onChange={e => setPieces(e.target.value)} min="1" />
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.borderSoft}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Batal</button>
          <button onClick={() => onCreate({ sender: sender || "PT Baru", dest, flight: flight || "GA-100", commodity: commodity || "Umum", weight: weight || "100 kg", pieces: parseInt(pieces) || 1, consignee: consignee || "Penerima", priority, origin: "CGK" })}
            style={{ height: 36, padding: "0 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Buat Shipment
          </button>
        </div>
      </div>
    </div>
  );
}