import { useState } from "react";
import { C } from "./tokens";
import { Clock, AlertTriangle, X, Package, Plane, MapPin, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ═══════════════ AIRLINE & AIRCRAFT DATA ═══════════════ */
const AIRLINE_INFO: Record<string, { name: string; fullName: string; aircraft: string; reg: string; type: string; img: string; logo: string; color: string }> = {
  GA: {
    name: "Garuda Indonesia", fullName: "PT Garuda Indonesia (Persero) Tbk",
    aircraft: "Airbus A330-300", reg: "PK-GIG", type: "Wide-body",
    img: "https://images.unsplash.com/photo-1775056976112-c7597e555468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHYXJ1ZGElMjBJbmRvbmVzaWElMjBCb2VpbmclMjA3NzclMjBhaXJwbGFuZSUyMGJsdWUlMjBsaXZlcnl8ZW58MXx8fHwxNzc2MDAwMTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    logo: "https://www.gstatic.com/flights/airline_logos/70px/GA.png",
    color: "#0A4DA2",
  },
  QF: {
    name: "Qantas", fullName: "Qantas Airways Limited",
    aircraft: "Airbus A380-800", reg: "VH-OQA", type: "Wide-body",
    img: "https://images.unsplash.com/photo-1775449067175-7bca27f9934f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRYW50YXMlMjBBaXJidXMlMjBBMzgwJTIwcmVkJTIwa2FuZ2Fyb28lMjBhaXJwbGFuZXxlbnwxfHx8fDE3NzU5OTg2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    logo: "https://www.gstatic.com/flights/airline_logos/70px/QF.png",
    color: "#E0112B",
  },
  QG: {
    name: "Citilink", fullName: "PT Citilink Indonesia",
    aircraft: "Airbus A320neo", reg: "PK-GQK", type: "Narrow-body",
    img: "https://images.unsplash.com/photo-1666239553251-6a22ecf60417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaXRpbGluayUyMEFpcmJ1cyUyMEEzMjAlMjBncmVlbiUyMGFpcnBsYW5lfGVufDF8fHx8MTc3NTk5ODAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    logo: "https://www.gstatic.com/flights/airline_logos/70px/QG.png",
    color: "#00A650",
  },
  ID: {
    name: "Batik Air", fullName: "PT Batik Air Indonesia",
    aircraft: "Airbus A320-200", reg: "PK-LUH", type: "Narrow-body",
    img: "https://images.unsplash.com/photo-1752901441555-e83cbbad97a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXRpayUyMEFpciUyMEJvZWluZyUyMGFpcnBsYW5lJTIwbGl2ZXJ5fGVufDF8fHx8MTc3NTk5ODAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    logo: "https://www.gstatic.com/flights/airline_logos/70px/ID.png",
    color: "#8B0000",
  },
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1649486927127-8c16f6d175ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYWlycGxhbmUlMjB3aGl0ZSUyMGJsdWUlMjBza3l8ZW58MXx8fHwxNzc1OTk4MDM3fDA&ixlib=rb-4.1.0&q=80&w=1080";

function getAirline(code: string) {
  const prefix = code.split("-")[0];
  return AIRLINE_INFO[prefix] || {
    name: prefix, fullName: `Airline ${prefix}`, aircraft: "Boeing 737-800", reg: "PK-XXX", type: "Narrow-body",
    img: FALLBACK_IMG, logo: `https://www.gstatic.com/flights/airline_logos/70px/${prefix}.png`, color: C.primary,
  };
}

/* ═══════════════ MOCK DATA ═══════════════ */
interface Flight {
  code: string; origin: string; dest: string; departure: string;
  cutoff: string; status: string; shipments: number; priority: string;
  cutoffMins: number;
}

const CITY_NAMES: Record<string, string> = {
  CGK: "Jakarta (Soekarno-Hatta)", DPS: "Bali (Ngurah Rai)", SUB: "Surabaya (Juanda)",
  KNO: "Medan (Kualanamu)", UPG: "Makassar (Sultan Hasanuddin)", PLM: "Palembang (Sultan Mahmud Badaruddin II)",
  BPN: "Balikpapan (Sultan Aji Muhammad Sulaiman)", SOC: "Solo (Adi Soemarmo)",
  BDJ: "Banjarmasin (Syamsudin Noor)", PDG: "Padang (Minangkabau)", MDC: "Manado (Sam Ratulangi)",
  PNK: "Pontianak (Supadio)", BDO: "Bandung (Husein Sastranegara)", PKU: "Pekanbaru (Sultan Syarif Kasim II)",
  JOG: "Yogyakarta (Adisucipto)", BTH: "Batam (Hang Nadim)", AMQ: "Ambon (Pattimura)",
  TKG: "Lampung (Radin Inten II)", SRG: "Semarang (Ahmad Yani)",
};

const FLIGHTS: Flight[] = [
  { code: "GA-714",  origin: "CGK", dest: "DPS", departure: "15:30", cutoff: "14:30", status: "On-Time",  shipments: 7,  priority: "High",   cutoffMins: 23  },
  { code: "QF-182",  origin: "CGK", dest: "SUB", departure: "16:00", cutoff: "15:00", status: "Delayed",  shipments: 5,  priority: "Normal", cutoffMins: 53  },
  { code: "QG-931",  origin: "CGK", dest: "UPG", departure: "17:00", cutoff: "15:45", status: "On-Time",  shipments: 3,  priority: "Normal", cutoffMins: 78  },
  { code: "GA-180",  origin: "CGK", dest: "KNO", departure: "07:15", cutoff: "06:15", status: "Departed", shipments: 12, priority: "Normal", cutoffMins: -420 },
  { code: "ID-6570", origin: "CGK", dest: "PLM", departure: "08:30", cutoff: "07:30", status: "Departed", shipments: 8,  priority: "Normal", cutoffMins: -345 },
  { code: "GA-520",  origin: "CGK", dest: "BPN", departure: "06:00", cutoff: "05:00", status: "Departed", shipments: 4,  priority: "High",   cutoffMins: -480 },
  { code: "QF-234",  origin: "CGK", dest: "SOC", departure: "18:00", cutoff: "17:00", status: "On-Time",  shipments: 6,  priority: "Normal", cutoffMins: 153 },
  { code: "GA-540",  origin: "CGK", dest: "BDJ", departure: "09:45", cutoff: "08:45", status: "Departed", shipments: 2,  priority: "Normal", cutoffMins: -270 },
  { code: "ID-6180", origin: "CGK", dest: "PDG", departure: "10:30", cutoff: "09:30", status: "Departed", shipments: 10, priority: "Normal", cutoffMins: -225 },
  { code: "GA-650",  origin: "CGK", dest: "MDC", departure: "11:00", cutoff: "10:00", status: "Departed", shipments: 3,  priority: "High",   cutoffMins: -195 },
  { code: "QG-812",  origin: "CGK", dest: "PNK", departure: "19:30", cutoff: "18:30", status: "On-Time",  shipments: 4,  priority: "Normal", cutoffMins: 243 },
  { code: "GA-410",  origin: "CGK", dest: "BDO", departure: "20:00", cutoff: "19:00", status: "On-Time",  shipments: 9,  priority: "Normal", cutoffMins: 273 },
  { code: "QF-570",  origin: "CGK", dest: "PKU", departure: "14:00", cutoff: "13:00", status: "Delayed",  shipments: 5,  priority: "Normal", cutoffMins: -7  },
  { code: "GA-330",  origin: "CGK", dest: "JOG", departure: "12:45", cutoff: "11:45", status: "Departed", shipments: 11, priority: "Normal", cutoffMins: -82 },
  { code: "ID-7210", origin: "CGK", dest: "BTH", departure: "16:30", cutoff: "15:30", status: "On-Time",  shipments: 6,  priority: "Normal", cutoffMins: 83  },
  { code: "GA-860",  origin: "CGK", dest: "AMQ", departure: "13:00", cutoff: "12:00", status: "Departed", shipments: 2,  priority: "High",   cutoffMins: -67 },
  { code: "QG-445",  origin: "CGK", dest: "TKG", departure: "21:00", cutoff: "20:00", status: "On-Time",  shipments: 3,  priority: "Normal", cutoffMins: 333 },
  { code: "GA-210",  origin: "CGK", dest: "SRG", departure: "22:00", cutoff: "21:00", status: "On-Time",  shipments: 7,  priority: "Normal", cutoffMins: 393 },
];

/* ═══════════════ STYLE HELPERS ═══════════════ */
const FLIGHT_STATUS: Record<string, { bg: string; color: string }> = {
  "On-Time": { bg: C.successA08, color: C.success },
  Delayed:   { bg: C.dangerA08,  color: C.danger  },
  Departed:  { bg: C.accentA08,  color: C.accent  },
};

const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  High:   { bg: C.warningA08, color: C.warning },
  Normal: { bg: C.surface2,   color: C.text2 },
};

function Pill({ value, map }: { value: string; map: Record<string, { bg: string; color: string }> }) {
  const s = map[value] || { bg: C.surface2, color: C.text2 };
  return <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 9px", borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{value}</span>;
}

const TH: React.CSSProperties = {
  textAlign: "left", padding: "0 14px", fontSize: 11, fontWeight: 700,
  color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px",
  fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
};

const selectStyle: React.CSSProperties = {
  height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "0 10px",
  fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text2, background: C.surface, outline: "none", cursor: "pointer",
};

function formatCutoff(mins: number): string {
  if (mins < 0) return "Passed";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/* ═══════════════ FLIGHT DETAIL DRAWER ═══════════════ */
function FlightDetail({ flight, onClose }: { flight: Flight; onClose: () => void }) {
  const airline = getAirline(flight.code);

  const mockAwbs = Array.from({ length: flight.shipments }, (_, i) => ({
    awb: `126-${(10000000 + Math.floor(Math.random() * 89999999)).toString()}`,
    sender: ["PT Maju Jaya", "CV Logistik Nusantara", "PT Chem Indo", "PT Elektronik Global", "CV Agri Prima", "PT Farma Sehat", "PT Tekstil Mandiri"][i % 7],
    weight: `${Math.floor(50 + Math.random() * 500)} kg`,
    status: ["Staged", "Cleared", "Processing"][i % 3],
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
      <div style={{ position: "relative", width: 540, height: "100%", background: C.surface, borderLeft: `1px solid ${C.borderSoft}`, overflowY: "auto", boxShadow: "-8px 0 32px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 1, background: C.surface, borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 18, color: C.text }}>{flight.code}</span>
              <Pill value={flight.status} map={FLIGHT_STATUS} />
              <Pill value={flight.priority} map={PRIORITY_COLORS} />
            </div>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} color={C.text2} />
            </button>
          </div>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Aircraft Image */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.borderSoft}`, position: "relative" }}>
            <ImageWithFallback
              src={airline.name === "Garuda Indonesia"
                ? "https://images.unsplash.com/photo-1631899175230-e3ba29cc90ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHYXJ1ZGElMjBJbmRvbmVzaWElMjBwbGFuZSUyMGFpcmNyYWZ0JTIwbGFuZGluZyUyMHJ1bndheXxlbnwxfHx8fDE3NzYwMDA0MTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                : airline.img}
              alt={`${airline.name} Aircraft`}
              style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  <img src={airline.logo} alt={airline.name} style={{ width: 22, height: 22, objectFit: "contain" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>{airline.name}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{airline.aircraft} / Reg: {airline.reg}</div>
            </div>
          </div>

          {/* Route Info */}
          <div style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.borderSoft}`, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: "Manrope, sans-serif" }}>{flight.origin}</div>
                <div style={{ fontSize: 10, color: C.text2, marginTop: 2, lineHeight: "14px" }}>{CITY_NAMES[flight.origin] || flight.origin}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 12px" }}>
                <Plane size={16} color={C.accent} style={{ transform: "rotate(90deg)" }} />
                <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`, borderRadius: 1 }} />
                <div style={{ fontSize: 10, color: C.text2, fontWeight: 600 }}>Direct</div>
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.text, fontFamily: "Manrope, sans-serif" }}>{flight.dest}</div>
                <div style={{ fontSize: 10, color: C.text2, marginTop: 2, lineHeight: "14px" }}>{CITY_NAMES[flight.dest] || flight.dest}</div>
              </div>
            </div>
          </div>

          {/* Time Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Departure", value: flight.departure, icon: Plane },
              { label: "Cutoff Cargo", value: flight.cutoff, icon: Clock },
              { label: "Countdown", value: flight.cutoffMins <= 0 && flight.status !== "Departed" ? "PASSED" : flight.status === "Departed" ? "Departed" : `T-${formatCutoff(flight.cutoffMins)}`, icon: AlertTriangle },
            ].map(t => {
              const TIcon = t.icon;
              return (
                <div key={t.label} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                    <TIcon size={12} color={C.text2} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.label}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{t.value}</div>
                </div>
              );
            })}
          </div>

          {/* Airline Detail */}
          <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.borderSoft}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Informasi Pesawat</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "Maskapai", v: airline.fullName },
                { l: "Tipe Pesawat", v: airline.aircraft },
                { l: "Registrasi", v: airline.reg },
                { l: "Kategori", v: airline.type },
              ].map(f => (
                <div key={f.l}>
                  <div style={{ fontSize: 10, color: C.text2, marginBottom: 2 }}>{f.l}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AWB List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Daftar Shipment</span>
              <span style={{ height: 16, padding: "0 6px", borderRadius: 999, background: C.surface2, fontSize: 10, fontWeight: 700, color: C.text2, display: "inline-flex", alignItems: "center" }}>{flight.shipments}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {mockAwbs.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: C.bg, border: `1px solid ${C.borderSoft}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{a.awb}</span>
                    <span style={{ fontSize: 11, color: C.text }}>{a.sender}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: C.text2 }}>{a.weight}</span>
                    <span style={{
                      height: 18, padding: "0 7px", borderRadius: 999, fontSize: 9, fontWeight: 600,
                      display: "inline-flex", alignItems: "center",
                      background: a.status === "Staged" ? C.successA08 : a.status === "Cleared" ? C.accentA08 : C.warningA08,
                      color: a.status === "Staged" ? C.success : a.status === "Cleared" ? C.accent : C.warning,
                    }}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export function FlightBoard() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const sorted = [...FLIGHTS].sort((a, b) => a.cutoffMins - b.cutoffMins);
  const filtered = sorted.filter(f => statusFilter === "All" || f.status === statusFilter);

  const summary = {
    total: FLIGHTS.length,
    onTime: FLIGHTS.filter(f => f.status === "On-Time").length,
    delayed: FLIGHTS.filter(f => f.status === "Delayed").length,
    departed: FLIGHTS.filter(f => f.status === "Departed").length,
  };

  const nearCutoff = FLIGHTS.filter(f => f.cutoffMins > 0 && f.cutoffMins <= 90 && f.status !== "Departed");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 24, color: C.text, margin: 0 }}>Flight Board</h1>
          <p style={{ fontSize: 12, color: C.text2, margin: 0, marginTop: 2 }}>Status penerbangan harian dan countdown cutoff cargo</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "On-Time", count: summary.onTime, color: C.success },
            { label: "Delayed", count: summary.delayed, color: C.danger },
            { label: "Departed", count: summary.departed, color: C.accent },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: s.color }} />
              <span style={{ fontSize: 12, color: C.text2 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Near Cutoff Cards */}
      {nearCutoff.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(nearCutoff.length, 4)}, 1fr)`, gap: 10 }}>
          {nearCutoff.map(f => {
            const isUrgent = f.cutoffMins <= 30;
            const airline = getAirline(f.code);
            return (
              <div key={f.code} onClick={() => setSelectedFlight(f)} style={{
                background: C.surface, borderRadius: 12, border: `1px solid ${isUrgent ? C.danger : C.borderSoft}`,
                overflow: "hidden", cursor: "pointer",
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Mini aircraft banner */}
                <div style={{ height: 48, position: "relative", overflow: "hidden" }}>
                  <ImageWithFallback src={airline.img} alt={airline.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
                  <div style={{ position: "absolute", top: 6, left: 8, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      <img src={airline.logo} alt={airline.name} style={{ width: 16, height: 16, objectFit: "contain" }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#FFF" }}>{airline.name}</span>
                  </div>
                </div>
                <div style={{ padding: "10px 14px", borderLeft: `4px solid ${airline.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{f.code}</span>
                    <Pill value={f.status} map={FLIGHT_STATUS} />
                  </div>
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>{f.origin} → {f.dest}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} color={isUrgent ? C.danger : C.warning} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: isUrgent ? C.danger : C.warning, fontFamily: "monospace" }}>
                        T-{formatCutoff(f.cutoffMins)}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: C.text2 }}>{f.shipments} AWB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="All">Status: Semua</option>
          <option value="On-Time">On-Time</option>
          <option value="Delayed">Delayed</option>
          <option value="Departed">Departed</option>
        </select>
        <input type="date" style={selectStyle} defaultValue="2026-04-12" />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: C.text2 }}>Diurutkan berdasarkan waktu cutoff terdekat</span>
      </div>

      {/* Table */}
      <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: C.text }}>Jadwal Penerbangan</span>
            <span style={{ height: 20, padding: "0 8px", borderRadius: 999, background: C.surface2, fontSize: 11, fontWeight: 600, color: C.text2, display: "inline-flex", alignItems: "center" }}>{filtered.length} flight</span>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr style={{ height: 38, background: C.surface2 }}>
              {["", "Flight", "Maskapai", "Rute", "Departure", "Cutoff", "Countdown", "Status", "AWB"].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => {
              const isNearCutoff = f.cutoffMins > 0 && f.cutoffMins <= 60;
              const isPassed = f.cutoffMins <= 0 && f.status !== "Departed";
              const airline = getAirline(f.code);
              return (
                <tr key={f.code} style={{
                  height: 56, borderTop: `1px solid ${C.borderSoft}`,
                  background: isPassed ? C.dangerA03 : isNearCutoff ? C.warningA02 : "transparent",
                  transition: "background 0.1s", cursor: "pointer",
                }}
                  onClick={() => setSelectedFlight(f)}
                  onMouseEnter={e => { if (!isPassed && !isNearCutoff) e.currentTarget.style.background = C.surface2; }}
                  onMouseLeave={e => { if (!isPassed && !isNearCutoff) e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Aircraft mini thumbnail */}
                  <td style={{ padding: "0 0 0 0", width: 48, borderLeft: `4px solid ${airline.color}` }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.borderSoft}`, flexShrink: 0, marginLeft: 10 }}>
                      <ImageWithFallback src={airline.img} alt={airline.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </td>
                  <td style={{ padding: "0 14px", fontSize: 14, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{f.code}</td>
                  <td style={{ padding: "0 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: "#fff", border: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        <img src={airline.logo} alt={airline.name} style={{ width: 18, height: 18, objectFit: "contain" }} />
                      </div>
                      <span style={{ fontSize: 11, color: C.text, whiteSpace: "nowrap" }}>{airline.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "0 14px", fontSize: 13, color: C.text, whiteSpace: "nowrap" }}>{f.origin} → {f.dest}</td>
                  <td style={{ padding: "0 14px", fontSize: 13, fontFamily: "monospace", color: C.text }}>{f.departure}</td>
                  <td style={{ padding: "0 14px", fontSize: 13, fontFamily: "monospace", color: C.text }}>{f.cutoff}</td>
                  <td style={{ padding: "0 14px" }}>
                    {f.status === "Departed" ? (
                      <span style={{ fontSize: 12, color: C.text2 }}>-</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {isNearCutoff && <AlertTriangle size={12} color={C.danger} />}
                        <span style={{
                          fontSize: 13, fontWeight: 700, fontFamily: "monospace",
                          color: f.cutoffMins <= 0 ? C.danger : f.cutoffMins <= 60 ? C.warning : C.text,
                        }}>
                          {f.cutoffMins <= 0 ? "PASSED" : `T-${formatCutoff(f.cutoffMins)}`}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "0 14px" }}><Pill value={f.status} map={FLIGHT_STATUS} /></td>
                  <td style={{ padding: "0 14px", fontSize: 13, color: C.text }}>{f.shipments}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Flight Detail Drawer */}
      {selectedFlight && <FlightDetail flight={selectedFlight} onClose={() => setSelectedFlight(null)} />}
    </div>
  );
}