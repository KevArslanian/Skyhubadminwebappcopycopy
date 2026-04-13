import { useState } from "react";
import { C } from "./tokens";
import { Download, Search, FileText } from "lucide-react";
import { generatePdfReport } from "./pdf-report";

/* ═══════════════ MOCK DATA ═══════════════ */
const USERS = ["Rina Sari", "Budi Santoso", "Dewi Lestari", "System", "Ahmad Fauzi", "Siti Nurhaliza"];
const ACTIONS = [
  "Shipment created", "AWB updated", "Status changed", "Flight updated",
  "Export data", "Login", "Dokumen uploaded", "Manifest approved",
  "Handler assigned", "Exception flagged", "Note added", "Security cleared",
];
const TARGETS = [
  "AWB 126-84720193", "AWB 126-93018472", "AWB 126-10294738", "GA-714",
  "QF-182", "Report Harian", "AWB 126-48291037", "Manifest GA-180",
  "AWB 126-20384756", "AWB 126-57381920", "AWB 126-73920184", "AWB 126-39201847",
];
const DETAILS = [
  "Shipment baru dari PT Maju Jaya ke Medan", "Berat diupdate dari 820 kg ke 840 kg",
  "Status: Processing → Cleared", "Departure delay 30 menit karena cuaca",
  "Laporan harian diekspor sebagai CSV", "Login via SSO berhasil",
  "Commercial invoice dilampirkan", "Manifest approved untuk 7 shipment",
  "Handler di-assign ke Bay C-4", "Weight discrepancy dilaporkan",
  "Catatan operator ditambahkan", "Security screening passed",
];

type LogStatus = "Success" | "Info" | "Warning" | "Error";
const STATUSES: LogStatus[] = ["Success", "Info", "Warning", "Error"];

function genLogs(count: number) {
  const logs = [];
  const base = new Date(2026, 3, 12, 14, 32, 0);
  for (let i = 0; i < count; i++) {
    const mins = i * 7 + Math.floor(Math.random() * 5);
    const time = new Date(base.getTime() - mins * 60000);
    const statusWeights = [0.55, 0.25, 0.12, 0.08];
    const r = Math.random();
    let cumul = 0, statusIdx = 0;
    for (let s = 0; s < statusWeights.length; s++) {
      cumul += statusWeights[s];
      if (r < cumul) { statusIdx = s; break; }
    }
    logs.push({
      id: `LOG-${(9000 - i).toString().padStart(4, "0")}`,
      time: time.toLocaleString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
      user: USERS[i % USERS.length],
      action: ACTIONS[i % ACTIONS.length],
      target: TARGETS[i % TARGETS.length],
      details: DETAILS[i % DETAILS.length],
      status: STATUSES[statusIdx],
    });
  }
  return logs;
}

const ALL_LOGS = genLogs(30);

const STATUS_STYLE: Record<LogStatus, { bg: string; color: string }> = {
  Success: { bg: C.successA08, color: C.success },
  Info:    { bg: C.accentA08,  color: C.accent },
  Warning: { bg: C.warningA08, color: C.warning },
  Error:   { bg: C.dangerA08,  color: C.danger },
};

function StatusPill({ status }: { status: LogStatus }) {
  const s = STATUS_STYLE[status];
  return <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 9px", borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{status}</span>;
}

const selectStyle: React.CSSProperties = {
  height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 10px",
  fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text, background: C.surface, outline: "none", cursor: "pointer",
};

/* ═══════════════ MAIN ═══════════════ */
export function ActivityLog() {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("Semua User");
  const [actionFilter, setActionFilter] = useState("Semua Aksi");

  const filtered = ALL_LOGS.filter(l => {
    if (userFilter !== "Semua User" && l.user !== userFilter) return false;
    if (actionFilter !== "Semua Aksi" && l.action !== actionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = { Success: 0, Info: 0, Warning: 0, Error: 0 };
  filtered.forEach(l => counts[l.status]++);

  const uniqueUsers = ["Semua User", ...Array.from(new Set(ALL_LOGS.map(l => l.user)))];
  const uniqueActions = ["Semua Aksi", ...Array.from(new Set(ALL_LOGS.map(l => l.action)))];

  function handleExport() {
    const now = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
    const csvRows = [
      `"EKSPEDISI PETIR - CARGO OPS CONTROL"`,
      `"Bandara Internasional Soekarno-Hatta (CGK), Tangerang, Banten"`,
      `"Laporan Activity Log / Audit Trail"`,
      `"Tanggal Cetak: ${now}"`,
      `"Operator Cetak: Rina Sari (Supervisor)"`,
      `"Filter User: ${userFilter} | Filter Aksi: ${actionFilter} | Total Entri: ${filtered.length}"`,
      `""`,
      `"Waktu","User","Aksi","Target","Detail","Status"`,
      ...filtered.map(l =>
        `"${l.time}","${l.user}","${l.action}","${l.target}","${l.details}","${l.status}"`
      ),
      `""`,
      `"--- Ringkasan Status ---"`,
      `"Success: ${counts.Success} | Info: ${counts.Info} | Warning: ${counts.Warning} | Error: ${counts.Error}"`,
      `""`,
      `"Dokumen ini digenerate otomatis oleh sistem Ekspedisi Petir v1.0.0"`,
      `"(c) ${new Date().getFullYear()} PT Ekspedisi Petir - Cargo Operations Control Desk"`,
    ];
    const csv = csvRows.join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPDF() {
    generatePdfReport({
      title: "Laporan Activity Log / Audit Trail",
      subtitle: "Riwayat lengkap aktivitas operator dan sistem pada periode terpilih",
      reportBadge: "ACTIVITY LOG",
      operator: "Rina Sari (Supervisor)",
      filtersApplied: `User: ${userFilter} | Aksi: ${actionFilter} | Total: ${filtered.length} entri`,
      stats: [
        { label: "Success", value: counts.Success, bg: "#E6F5EC", fg: "#1F9D55" },
        { label: "Info",    value: counts.Info,    bg: "#E8F0FE", fg: "#0059CF" },
        { label: "Warning", value: counts.Warning, bg: "#FEF3E6", fg: "#C97A00" },
        { label: "Error",   value: counts.Error,   bg: "#FDECEA", fg: "#C62828" },
      ],
      columns: [
        { header: "Waktu",  key: "time",    width: "10%", align: "left"  },
        { header: "User",   key: "user",    width: "14%", align: "left"  },
        { header: "Aksi",   key: "action",  width: "14%", align: "left"  },
        { header: "Target", key: "target",  width: "14%", align: "left"  },
        { header: "Detail", key: "details", width: "38%", align: "left"  },
        { header: "Status", key: "status",  width: "10%", align: "center"},
      ],
      rows: filtered.map(l => ({
        time: l.time, user: l.user, action: l.action,
        target: l.target, details: l.details, status: l.status,
      })),
      filename: `activity-log-${new Date().toISOString().slice(0, 10)}`,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 24, color: C.text, margin: 0 }}>Activity Log</h1>
          <p style={{ fontSize: 12, color: C.text2, margin: 0, marginTop: 2 }}>Riwayat aktivitas sistem dan operator</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handleExport} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export CSV
          </button>
          <button onClick={handleExportPDF} style={{ height: 36, padding: "0 14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {([
          { label: "Success", count: counts.Success, status: "Success" as LogStatus },
          { label: "Info", count: counts.Info, status: "Info" as LogStatus },
          { label: "Warning", count: counts.Warning, status: "Warning" as LogStatus },
          { label: "Error", count: counts.Error, status: "Error" as LogStatus },
        ]).map(s => {
          const st = STATUS_STYLE[s.status];
          return (
            <div key={s.label} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>{s.label.charAt(0)}</span>
              </div>
              <div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 22, color: C.text, lineHeight: "26px" }}>{s.count}</div>
                <div style={{ fontSize: 11, color: C.text2, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <input type="date" defaultValue="2026-04-01" style={{ ...selectStyle, width: 130 }} />
        <input type="date" defaultValue="2026-04-12" style={{ ...selectStyle, width: 130 }} />
        <select value={userFilter} onChange={e => setUserFilter(e.target.value)} style={{ ...selectStyle, width: 140 }}>{uniqueUsers.map(u => <option key={u}>{u}</option>)}</select>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ ...selectStyle, width: 148 }}>{uniqueActions.map(a => <option key={a}>{a}</option>)}</select>
        <div style={{ flex: 1, minWidth: 160, height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
          <Search size={14} color={C.text2} />
          <input placeholder="Cari log..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: C.text }}>Audit Trail</span>
          <span style={{ fontSize: 11, color: C.text2 }}>Menampilkan {filtered.length} dari {ALL_LOGS.length} entri</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr style={{ height: 36, background: C.surface2 }}>
              {[
                { h: "Waktu", w: "12%" }, { h: "User", w: "12%" }, { h: "Aksi", w: "13%" },
                { h: "Target", w: "14%" }, { h: "Detail", w: "36%" }, { h: "Status", w: "10%" },
              ].map(col => (
                <th key={col.h} style={{ width: col.w, textAlign: "left", padding: "0 14px", fontSize: 11, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{col.h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ height: "var(--ep-row-h-md)" as unknown as number, borderTop: `1px solid ${C.borderSoft}`, transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0 14px", fontSize: 12, color: C.text2, whiteSpace: "nowrap" }}>{l.time}</td>
                <td style={{ padding: "0 14px", fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>{l.user}</td>
                <td style={{ padding: "0 14px", fontSize: 13, color: C.text, whiteSpace: "nowrap" }}>{l.action}</td>
                <td style={{ padding: "0 14px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.accent, fontFamily: "monospace", whiteSpace: "nowrap" }}>{l.target}</span>
                </td>
                <td style={{ padding: "0 14px", fontSize: 12, color: C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>{l.details}</td>
                <td style={{ padding: "0 14px" }}><StatusPill status={l.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: C.text2, fontSize: 13 }}>Tidak ada log yang cocok dengan filter.</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderTop: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontSize: 11, color: C.text2 }}>Halaman 1 dari 1</span>
          <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: C.accent, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>1</button>
        </div>
      </div>
    </div>
  );
}