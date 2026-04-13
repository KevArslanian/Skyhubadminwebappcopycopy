/* ═══════════════════════════════════════════════════════
   EKSPEDISI PETIR — PDF Report Generator
   Uses browser-native HTML + window.print() → Save as PDF
   ═══════════════════════════════════════════════════════ */

export interface ReportColumn {
  header: string;
  key: string;
  width?: string;
  align?: "left" | "center" | "right";
  /** Optional colour fn: returns CSS color string for the cell value */
  color?: (value: string) => string | undefined;
  /** Optional badge fn: returns label to display instead of raw value */
  badge?: (value: string) => { text: string; bg: string; color: string } | undefined;
}

export interface ReportStat {
  label: string;
  value: string | number;
  bg: string;   /* CSS background color */
  fg: string;   /* CSS text color */
}

export interface PdfReportConfig {
  /** e.g. "Laporan Shipment Ledger" */
  title: string;
  /** e.g. "Data pengiriman kargo per 12 April 2026" */
  subtitle: string;
  /** Top-right badge e.g. "SHIPMENT LEDGER" */
  reportBadge: string;
  operator: string;
  filtersApplied: string;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
  stats?: ReportStat[];
  filename?: string;
}

/* ── Colour helpers ── */
const PRIMARY   = "#003D9B";
const PRIMARY2  = "#0052CC";
const SURFACE2  = "#F2F4F8";
const BORDER    = "#DDE3EF";
const TEXT      = "#1A2036";
const TEXT2     = "#5B6472";
const SUCCESS   = "#1F9D55";
const WARNING   = "#C97A00";
const DANGER    = "#C62828";
const ACCENT    = "#0059CF";

/** Returns known status colors for common cargo statuses */
function statusBadge(val: string): { text: string; bg: string; color: string } | undefined {
  const map: Record<string, { bg: string; color: string }> = {
    Cleared:            { bg: "#E6F5EC", color: SUCCESS },
    Ready:              { bg: "#E6F5EC", color: SUCCESS },
    Arrived:            { bg: "#E6F5EC", color: SUCCESS },
    Success:            { bg: "#E6F5EC", color: SUCCESS },
    Delivered:          { bg: "#E6F5EC", color: SUCCESS },
    Processing:         { bg: "#E8F0FE", color: ACCENT },
    Info:               { bg: "#E8F0FE", color: ACCENT },
    Received:           { bg: "#E8F0FE", color: ACCENT },
    Departed:           { bg: "#E8F0FE", color: ACCENT },
    "Loaded to Aircraft": { bg: "#E8F0FE", color: ACCENT },
    "On Hold":          { bg: "#FEF3E6", color: WARNING },
    Pending:            { bg: "#FEF3E6", color: WARNING },
    Warning:            { bg: "#FEF3E6", color: WARNING },
    Sortation:          { bg: "#FEF3E6", color: WARNING },
    Invited:            { bg: "#FEF3E6", color: WARNING },
    "In Transit":       { bg: "#E8F0FE", color: ACCENT },
    Critical:           { bg: "#FDECEA", color: DANGER },
    Error:              { bg: "#FDECEA", color: DANGER },
    Delayed:            { bg: "#FDECEA", color: DANGER },
    High:               { bg: "#FEF3E6", color: WARNING },
    Normal:             { bg: "#F2F4F8", color: TEXT2 },
    Active:             { bg: "#E6F5EC", color: SUCCESS },
    "On-Time":          { bg: "#E6F5EC", color: SUCCESS },
    Screened:           { bg: "#E6F5EC", color: SUCCESS },
    Cleared_Sec:        { bg: "#E6F5EC", color: SUCCESS },
  };
  const s = map[val];
  return s ? { text: val, ...s } : undefined;
}

function buildHtml(cfg: PdfReportConfig): string {
  const now = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  /* ── Stats row ── */
  const statsHtml = cfg.stats && cfg.stats.length
    ? `<div class="stats-grid">
        ${cfg.stats.map(s => `
          <div class="stat-card" style="background:${s.bg}; border-left: 3px solid ${s.fg};">
            <div class="stat-value" style="color:${s.fg}">${s.value}</div>
            <div class="stat-label">${s.label}</div>
          </div>`).join("")}
      </div>`
    : "";

  /* ── Table head ── */
  const thead = `<thead><tr>${cfg.columns.map(c =>
    `<th style="width:${c.width || "auto"};text-align:${c.align || "left"}">${c.header}</th>`
  ).join("")}</tr></thead>`;

  /* ── Table body ── */
  const tbody = `<tbody>${cfg.rows.map((row, ri) => {
    const cells = cfg.columns.map(c => {
      const raw = String(row[c.key] ?? "");
      const badge = statusBadge(raw);
      const cellVal = badge
        ? `<span class="badge" style="background:${badge.bg};color:${badge.color}">${badge.text}</span>`
        : `<span style="color:${c.color ? (c.color(raw) || TEXT) : TEXT}">${raw}</span>`;
      return `<td style="text-align:${c.align || "left"}">${cellVal}</td>`;
    }).join("");
    return `<tr class="${ri % 2 === 0 ? "row-even" : "row-odd"}">${cells}</tr>`;
  }).join("")}</tbody>`;

  /* ── Summary footer inside table ── */
  const totalRow = `<tfoot><tr><td colspan="${cfg.columns.length}" class="total-row">
    Jumlah total data: <strong>${cfg.rows.length}</strong> baris ditampilkan
  </td></tr></tfoot>`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${cfg.title} — Ekspedisi Petir</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 9.5pt;
      color: ${TEXT};
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Cover header ── */
    .report-header {
      background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY2} 100%);
      padding: 22px 28px 18px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .logo-box {
      width: 44px; height: 44px; border-radius: 10px;
      background: rgba(255,255,255,0.18);
      border: 1.5px solid rgba(255,255,255,0.35);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0;
    }
    .header-titles .org-name {
      font-family: 'Manrope', Arial, sans-serif;
      font-size: 18pt; font-weight: 800;
      color: #fff; letter-spacing: -0.4px; line-height: 1.1;
    }
    .header-titles .org-sub {
      font-size: 8pt; color: rgba(255,255,255,0.72);
      margin-top: 2px; letter-spacing: 0.3px;
    }
    .header-right { text-align: right; }
    .report-badge {
      display: inline-block;
      background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
      color: #fff; font-size: 7pt; font-weight: 700; letter-spacing: 0.8px;
      padding: 3px 9px; border-radius: 4px; text-transform: uppercase; margin-bottom: 6px;
    }
    .header-right .airport-name {
      font-size: 8pt; color: rgba(255,255,255,0.85); line-height: 1.4;
    }
    .header-right .airport-code {
      font-family: 'Manrope', Arial, sans-serif;
      font-size: 12pt; font-weight: 700; color: #fff;
    }

    /* ── Meta band ── */
    .meta-band {
      background: ${SURFACE2}; border-bottom: 1px solid ${BORDER};
      padding: 10px 28px;
      display: flex; justify-content: space-between; align-items: flex-start;
      gap: 20px;
    }
    .meta-item { }
    .meta-label { font-size: 7pt; font-weight: 700; color: ${TEXT2}; text-transform: uppercase; letter-spacing: 0.4px; }
    .meta-value { font-size: 8.5pt; font-weight: 500; color: ${TEXT}; margin-top: 1px; }

    /* ── Report title section ── */
    .title-section {
      padding: 16px 28px 12px;
      border-bottom: 2px solid ${PRIMARY};
    }
    .report-title {
      font-family: 'Manrope', Arial, sans-serif;
      font-size: 16pt; font-weight: 800; color: ${PRIMARY};
      letter-spacing: -0.3px; line-height: 1.15;
    }
    .report-subtitle { font-size: 8.5pt; color: ${TEXT2}; margin-top: 3px; }
    .report-date { font-size: 7.5pt; color: ${TEXT2}; margin-top: 2px; }

    /* ── Stats grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      gap: 10px;
      padding: 14px 28px;
      border-bottom: 1px solid ${BORDER};
    }
    .stat-card {
      padding: 10px 14px; border-radius: 8px;
    }
    .stat-value {
      font-family: 'Manrope', Arial, sans-serif;
      font-size: 20pt; font-weight: 800; line-height: 1;
    }
    .stat-label { font-size: 7.5pt; color: ${TEXT2}; margin-top: 3px; }

    /* ── Filters info ── */
    .filters-bar {
      padding: 7px 28px;
      border-bottom: 1px solid ${BORDER};
      font-size: 7.5pt; color: ${TEXT2};
    }
    .filters-bar strong { color: ${TEXT}; }

    /* ── Table ── */
    .table-wrap { padding: 0 28px 20px; }
    .table-header-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 0 6px;
    }
    .table-header-row .table-title {
      font-family: 'Manrope', Arial, sans-serif;
      font-size: 10pt; font-weight: 700; color: ${TEXT};
    }
    .table-header-row .table-count {
      font-size: 7.5pt; color: ${TEXT2};
    }

    table {
      width: 100%; border-collapse: collapse;
      font-size: 8pt;
    }
    thead tr {
      background: ${PRIMARY};
    }
    thead th {
      padding: 7px 10px; color: #fff;
      font-size: 7pt; font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; white-space: nowrap;
    }
    .row-even td { background: #fff; }
    .row-odd td { background: #F7F9FC; }
    td {
      padding: 6px 10px; border-bottom: 1px solid ${BORDER};
      font-size: 8pt; line-height: 1.35; vertical-align: middle;
    }
    .badge {
      display: inline-block; padding: 1px 8px; border-radius: 999px;
      font-size: 7pt; font-weight: 600; white-space: nowrap;
    }
    .total-row {
      background: ${SURFACE2}; color: ${TEXT2};
      font-size: 8pt; padding: 7px 10px; text-align: right;
      border-top: 2px solid ${BORDER};
    }

    /* ── Footer ── */
    .report-footer {
      background: ${PRIMARY}; padding: 10px 28px;
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 4px;
    }
    .footer-left { font-size: 7pt; color: rgba(255,255,255,0.7); }
    .footer-left strong { color: #fff; }
    .footer-right { font-size: 7pt; color: rgba(255,255,255,0.6); }

    /* ── Page break rules ── */
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
    tr { page-break-inside: avoid; }
    .report-header, .meta-band, .title-section { page-break-inside: avoid; }

    /* ── Print settings ── */
    @page {
      size: A4 landscape;
      margin: 0;
    }
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }

    /* ── Screen-only action bar ── */
    .action-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 999;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 20px; gap: 12px;
    }
    .action-bar .hint { font-size: 12px; color: rgba(255,255,255,0.7); }
    .action-bar .hint strong { color: #fff; }
    .btn-print {
      height: 36px; padding: 0 20px; border-radius: 8px; border: none;
      background: linear-gradient(135deg, ${PRIMARY}, ${PRIMARY2});
      color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
      font-family: 'Inter', sans-serif;
    }
    .btn-close {
      height: 36px; padding: 0 16px; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.25);
      background: transparent; color: rgba(255,255,255,0.8);
      font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif;
    }
    .content-wrap { padding-top: 56px; }
    @media print { .action-bar { display: none; } .content-wrap { padding-top: 0; } }
  </style>
</head>
<body>

  <!-- Action bar (screen only) -->
  <div class="action-bar no-print">
    <span class="hint"><strong>${cfg.title}</strong> &mdash; Pratinjau Laporan</span>
    <div style="display:flex;gap:8px">
      <button class="btn-close" onclick="window.close()">Tutup</button>
      <button class="btn-print" onclick="window.print()">⬇ Unduh / Cetak PDF</button>
    </div>
  </div>

  <div class="content-wrap">
    <!-- ── Header ── -->
    <div class="report-header">
      <div class="header-left">
        <div class="logo-box">⚡</div>
        <div class="header-titles">
          <div class="org-name">Ekspedisi Petir</div>
          <div class="org-sub">Cargo Operations Control Desk &bull; PT Ekspedisi Petir</div>
        </div>
      </div>
      <div class="header-right">
        <div class="report-badge">${cfg.reportBadge}</div>
        <div class="airport-code">CGK</div>
        <div class="airport-name">Bandara Internasional Soekarno-Hatta<br>Tangerang, Banten, Indonesia</div>
      </div>
    </div>

    <!-- ── Meta band ── -->
    <div class="meta-band">
      <div class="meta-item">
        <div class="meta-label">Tanggal Cetak</div>
        <div class="meta-value">${now}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Operator</div>
        <div class="meta-value">${cfg.operator}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Total Data</div>
        <div class="meta-value">${cfg.rows.length} entri</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Sistem</div>
        <div class="meta-value">Ekspedisi Petir v1.0.0</div>
      </div>
    </div>

    <!-- ── Title section ── -->
    <div class="title-section">
      <div class="report-title">${cfg.title}</div>
      <div class="report-subtitle">${cfg.subtitle}</div>
      <div class="report-date">Periode laporan: ${today}</div>
    </div>

    <!-- ── Stats ── -->
    ${statsHtml}

    <!-- ── Filters ── -->
    <div class="filters-bar">
      <strong>Filter Aktif:</strong> ${cfg.filtersApplied}
    </div>

    <!-- ── Table ── -->
    <div class="table-wrap">
      <div class="table-header-row">
        <div class="table-title">Data Detail</div>
        <div class="table-count">${cfg.rows.length} baris</div>
      </div>
      <table>
        ${thead}
        ${tbody}
        ${totalRow}
      </table>
    </div>

    <!-- ── Footer ── -->
    <div class="report-footer">
      <div class="footer-left">
        <strong>Ekspedisi Petir</strong> &bull; Cargo Ops Control Desk &bull;
        Bandara Internasional Soekarno-Hatta (CGK)
      </div>
      <div class="footer-right">
        Dokumen digenerate otomatis &bull;
        &copy; ${new Date().getFullYear()} PT Ekspedisi Petir. Hak cipta dilindungi.
      </div>
    </div>
  </div>

</body>
</html>`;
}

/**
 * Opens a new tab with a polished print-ready HTML report.
 * The user clicks "Unduh / Cetak PDF" to save as PDF.
 */
export function generatePdfReport(cfg: PdfReportConfig): void {
  const html = buildHtml(cfg);
  const win = window.open("", "_blank");
  if (!win) {
    alert("Pop-up diblokir browser. Izinkan pop-up dari halaman ini untuk ekspor PDF.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
