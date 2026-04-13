import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { C } from "./tokens";
import { useAppSettings } from "./app-settings-context";
import { User, Users, Bell, Monitor, PanelLeft, Check, X } from "lucide-react";

/* ═══════════════ SHARED STYLES ═══════════════ */
const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: C.text2,
  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5, display: "block",
};

const inputStyle: React.CSSProperties = {
  height: 36, borderRadius: 10, border: `1px solid ${C.borderSoft}`,
  padding: "0 12px", fontSize: 13, fontFamily: "Inter, sans-serif",
  color: C.text, background: C.surface, outline: "none", width: "100%", boxSizing: "border-box",
};

const selectS: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

function cardStyle(): React.CSSProperties {
  return {
    background: C.surface, borderRadius: 12, border: `1px solid ${C.borderSoft}`,
    padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ flex: 1, minWidth: 0 }}><span style={labelStyle}>{label}</span>{children}</div>;
}

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: () => void; label: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{label}</div>
        <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{sub}</div>
      </div>
      <div onClick={onChange} style={{
        width: 38, height: 22, borderRadius: 999, cursor: "pointer", flexShrink: 0,
        background: checked ? C.accent : C.borderSoft, transition: "background 0.15s", position: "relative",
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 999, background: "#FFF",
          position: "absolute", top: 3, left: checked ? 19 : 3,
          transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.borderSoft}`, paddingBottom: 6 }}>
      <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, color: C.text }}>{title}</span>
      <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ═══════════════ TAB: PROFILE ═══════════════ */
function ProfileTab() {
  return (
    <div style={cardStyle()}>
      <SectionHead title="Profil Operator" sub="Informasi akun dan identitas operator aktif" />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: "#FFF", flexShrink: 0,
        }}>RS</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Rina Sari</div>
          <div style={{ fontSize: 12, color: C.text2 }}>r.sari@ekspedisipetir.id</div>
          <span style={{ display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px", borderRadius: 4, marginTop: 4, background: C.warningA08, color: C.warning, fontSize: 10, fontWeight: 700 }}>Supervisor</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Nama Lengkap"><input style={inputStyle} defaultValue="Rina Sari" /></Field>
        <Field label="Email"><input style={inputStyle} defaultValue="r.sari@ekspedisipetir.id" /></Field>
        <Field label="Stasiun"><select style={selectS} defaultValue="CGK">{["CGK", "SUB", "DPS", "UPG", "KNO"].map(s => <option key={s}>{s}</option>)}</select></Field>
      </div>
    </div>
  );
}

/* ═══════════════ TAB: USER & ROLE ═══════════════ */
const TEAM_INIT = [
  { name: "Rina Sari",      email: "r.sari@ekspedisipetir.id",    role: "Supervisor",     station: "CGK", status: "Active" },
  { name: "Budi Santoso",   email: "b.santoso@ekspedisipetir.id", role: "Operator",       station: "CGK", status: "Active" },
  { name: "Dewi Lestari",   email: "d.lestari@ekspedisipetir.id", role: "Admin",          station: "CGK", status: "Active" },
  { name: "Ahmad Fauzi",    email: "a.fauzi@ekspedisipetir.id",   role: "Operator",       station: "SUB", status: "Active" },
  { name: "Siti Nurhaliza",  email: "s.nurhaliza@ekspedisipetir.id", role: "Operator",    station: "DPS", status: "Invited" },
];

const ROLES = [
  { role: "Admin",      desc: "Akses penuh, manajemen user, semua settings" },
  { role: "Operator",   desc: "CRUD shipment, tracking AWB, handling cargo" },
  { role: "Supervisor", desc: "Monitoring, approval manifest, eskalasi" },
];

function UserRoleTab() {
  const [team, setTeam] = useState(TEAM_INIT);
  const [showInvite, setShowInvite] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleInvite(name: string, email: string, role: string, station: string) {
    setTeam(prev => [...prev, { name, email, role, station, status: "Invited" }]);
    setShowInvite(false);
    showToastMsg(`Undangan dikirim ke ${email}`);
  }

  function handleSaveEdit(email: string) {
    setTeam(prev => prev.map(u => u.email === email ? { ...u, role: editRole } : u));
    setEditingEmail(null);
    showToastMsg("Role berhasil diupdate");
  }

  return (
    <>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 32, zIndex: 200, padding: "10px 18px", borderRadius: 10, background: C.success, color: "#FFF", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> {toast}
        </div>
      )}
      <div style={cardStyle()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionHead title="Anggota Tim" sub="Operator aktif dan penempatan stasiun" />
          <button onClick={() => setShowInvite(true)} style={{ height: 32, padding: "0 14px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Undang User</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter, sans-serif" }}>
          <thead><tr style={{ height: 34, background: C.surface2 }}>
            {["Nama", "Email", "Role", "Stasiun", "Status", ""].map((h, i) => <th key={h || i} style={{ textAlign: "left", padding: "0 12px", fontSize: 11, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {team.map(u => (
              <tr key={u.email} style={{ height: "var(--ep-row-h-md)", borderTop: `1px solid ${C.borderSoft}` }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 999, background: C.primaryA08, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.primary }}>{u.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "0 12px", fontSize: 12, color: C.text2 }}>{u.email}</td>
                <td style={{ padding: "0 12px" }}>
                  {editingEmail === u.email ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ height: 26, borderRadius: 6, border: `1px solid ${C.borderSoft}`, fontSize: 11, padding: "0 6px", background: C.surface, color: C.text }}>
                      {["Admin", "Operator", "Supervisor"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontSize: 12, color: C.text }}>{u.role}</span>
                  )}
                </td>
                <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{u.station}</td>
                <td style={{ padding: "0 12px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", height: 20, padding: "0 9px", borderRadius: 999,
                    background: u.status === "Active" ? C.successA08 : C.warningA08,
                    color: u.status === "Active" ? C.success : C.warning,
                    fontSize: 11, fontWeight: 600,
                  }}>{u.status}</span>
                </td>
                <td style={{ padding: "0 12px", display: "flex", gap: 4, alignItems: "center", height: "var(--ep-row-h-md)" as unknown as number }}>
                  {editingEmail === u.email ? (
                    <>
                      <button onClick={() => handleSaveEdit(u.email)} style={{ height: 26, padding: "0 8px", borderRadius: 6, border: "none", background: C.success, color: "#FFF", fontSize: 11, cursor: "pointer" }}>Simpan</button>
                      <button onClick={() => setEditingEmail(null)} style={{ height: 26, padding: "0 8px", borderRadius: 6, border: `1px solid ${C.borderSoft}`, background: C.surface, fontSize: 11, color: C.text2, cursor: "pointer" }}>Batal</button>
                    </>
                  ) : (
                    <button onClick={() => { setEditingEmail(u.email); setEditRole(u.role); }} style={{ height: 26, padding: "0 10px", borderRadius: 6, border: `1px solid ${C.borderSoft}`, background: C.surface, fontSize: 11, color: C.text2, cursor: "pointer" }}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={cardStyle()}>
        <SectionHead title="Definisi Role" sub="Hak akses untuk setiap role" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {ROLES.map(r => (
            <div key={r.role} style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.bg }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.role}</div>
              <div style={{ fontSize: 11, color: C.text2, marginTop: 3, lineHeight: "16px" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </>
  );
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (name: string, email: string, role: string, station: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Operator");
  const [station, setStation] = useState("CGK");

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "relative", width: 440, background: C.surface, borderRadius: 14, border: `1px solid ${C.borderSoft}`, boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: C.text }}>Undang User Baru</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} color={C.text2} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={labelStyle}>Nama Lengkap</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Nama operator" /></div>
          <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@ekspedisipetir.id" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Role</label><select style={{ ...inputStyle, cursor: "pointer" }} value={role} onChange={e => setRole(e.target.value)}>{["Admin", "Operator", "Supervisor"].map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label style={labelStyle}>Stasiun</label><select style={{ ...inputStyle, cursor: "pointer" }} value={station} onChange={e => setStation(e.target.value)}>{["CGK", "SUB", "DPS", "UPG", "KNO", "BPN"].map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.borderSoft}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ height: 36, padding: "0 16px", borderRadius: 10, border: `1px solid ${C.borderSoft}`, background: C.surface, color: C.text, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Batal</button>
          <button onClick={() => onInvite(name || "User Baru", email || "new@ekspedisipetir.id", role, station)} style={{ height: 36, padding: "0 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`, color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Kirim Undangan</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ TAB: NOTIFICATIONS ═══════════════ */
function NotificationsTab() {
  const s = useAppSettings();
  return (
    <div style={cardStyle()}>
      <SectionHead title="Preferensi Notifikasi" sub="Atur pemberitahuan yang ingin diterima" />
      <Toggle checked={s.cutoffAlert} onChange={() => s.setCutoffAlert(!s.cutoffAlert)} label="Cutoff Alert" sub="Notifikasi saat flight mendekati cutoff cargo" />
      <Toggle checked={s.exceptionAlert} onChange={() => s.setExceptionAlert(!s.exceptionAlert)} label="Exception Alert" sub="Notifikasi saat ada exception baru (critical atau high)" />
      <Toggle checked={s.soundAlert} onChange={() => s.setSoundAlert(!s.soundAlert)} label="Suara Peringatan" sub="Putar tone untuk alert critical (perlu izin browser)" />
      <Toggle checked={s.emailDigest} onChange={() => s.setEmailDigest(!s.emailDigest)} label="Email Digest" sub="Kirim ringkasan aktivitas harian ke email" />
    </div>
  );
}

/* ═══════════════ TAB: DISPLAY ═══════════════ */
function DisplayTab() {
  const s = useAppSettings();

  return (
    <>
      <div style={cardStyle()}>
        <SectionHead title="Tema Tampilan" sub="Pilih mode tampilan yang nyaman untuk kerja lama" />
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { key: "light", label: "Light Corporate", desc: "Putih, abu, biru. Mode standar siang hari." },
            { key: "dark",  label: "Dark Blue",        desc: "Mode gelap navy. Untuk shift malam." },
          ].map(t => (
            <div key={t.key} onClick={() => s.setTheme(t.key as "light" | "dark")} style={{
              flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${s.theme === t.key ? C.primary : C.borderSoft}`,
              background: s.theme === t.key ? C.primaryA03 : C.bg,
              transition: "all 0.15s",
            }}>
              {/* Theme preview swatch */}
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {t.key === "light"
                  ? ["#FFFFFF", "#F0F2F7", "#003D9B"].map((c, i) => (
                      <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: c, border: "1px solid #E0E5F0" }} />
                    ))
                  : ["#0F1929", "#172034", "#4A8FE8"].map((c, i) => (
                      <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: c }} />
                    ))
                }
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.theme === t.key ? C.primary : C.text }}>{t.label}</div>
              <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={cardStyle()}>
        <SectionHead title="Pengaturan Tabel" sub="Densitas dan refresh data" />
        <Toggle checked={s.compact} onChange={() => s.setCompact(!s.compact)} label="Mode Compact" sub="Kurangi tinggi baris tabel untuk densitas lebih tinggi" />
        <Toggle checked={s.autoRefresh} onChange={() => s.setAutoRefresh(!s.autoRefresh)} label="Auto-Refresh" sub="Muat ulang data operasional secara otomatis" />
        {s.autoRefresh && (
          <div style={{ paddingTop: 4 }}>
            <Field label="Interval Refresh (detik)">
              <select style={{ ...selectS, maxWidth: 200 }} value={s.refreshInterval} onChange={e => s.setRefreshInterval(e.target.value)}>
                {["30", "60", "120", "300"].map(v => <option key={v} value={v}>{v}s{v === "60" ? " (disarankan)" : ""}</option>)}
              </select>
            </Field>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════ TAB: SIDEBAR PREFS ═══════════════ */
function SidebarPrefsTab() {
  const s = useAppSettings();
  return (
    <div style={cardStyle()}>
      <SectionHead title="Preferensi Sidebar" sub="Atur tampilan default sidebar" />
      <Toggle
        checked={s.sidebarDefaultCollapsed}
        onChange={() => s.setSidebarDefaultCollapsed(!s.sidebarDefaultCollapsed)}
        label="Default Sidebar Collapsed"
        sub="Sidebar akan selalu dimulai dalam keadaan collapsed saat aplikasi dibuka"
      />
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
type TabKey = "profile" | "users" | "notifications" | "display" | "sidebar";

const TABS: { key: TabKey; label: string; sub: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Profile",             sub: "Informasi akun operator",  icon: User },
  { key: "users",         label: "User & Role",         sub: "Tim, undangan, hak akses", icon: Users },
  { key: "notifications", label: "Notifications",       sub: "Alert, email, suara",      icon: Bell },
  { key: "display",       label: "Display Preferences", sub: "Tema, tabel, refresh",     icon: Monitor },
  { key: "sidebar",       label: "Sidebar Preferences", sub: "Collapsed default",        icon: PanelLeft },
];

export function Settings() {
  const location = useLocation();
  const [active, setActive] = useState<TabKey>(() => {
    const tab = (location.state as { tab?: string } | null)?.tab;
    return (TABS.find(t => t.key === tab) ? tab : "profile") as TabKey;
  });
  const [saveToast, setSaveToast] = useState(false);

  // Re-sync if navigated here again with a different tab state
  useEffect(() => {
    const tab = (location.state as { tab?: string } | null)?.tab;
    if (tab && TABS.find(t => t.key === tab)) {
      setActive(tab as TabKey);
    }
  }, [location.state]);

  function handleSave() {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  }

  return (
    <div style={{ display: "flex", gap: 24, paddingBottom: 48 }}>
      {saveToast && (
        <div style={{ position: "fixed", top: 80, right: 32, zIndex: 200, padding: "10px 18px", borderRadius: 10, background: C.success, color: "#FFF", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> Pengaturan berhasil disimpan
        </div>
      )}
      {/* Left nav */}
      <div style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 22, color: C.text, marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 12, color: C.text2, marginBottom: 14 }}>Konfigurasi operasional</div>
        {TABS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setActive(s.key)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: active === s.key ? C.primaryA03 : "transparent",
              borderLeft: `3px solid ${active === s.key ? C.primary : "transparent"}`,
              textAlign: "left" as const, transition: "all 0.1s", width: "100%",
            }}>
              <Icon size={16} color={active === s.key ? C.primary : C.text2} />
              <div>
                <span style={{ fontSize: 13, fontWeight: active === s.key ? 600 : 400, color: active === s.key ? C.primary : C.text, display: "block" }}>{s.label}</span>
                <span style={{ fontSize: 10, color: C.text2 }}>{s.sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 22, color: C.text, margin: 0 }}>
              {TABS.find(t => t.key === active)?.label}
            </h1>
            <p style={{ fontSize: 12, color: C.text2, margin: 0, marginTop: 2 }}>{TABS.find(t => t.key === active)?.sub}</p>
          </div>
          <button onClick={handleSave} style={{
            height: 34, padding: "0 16px", borderRadius: 10, border: "none",
            background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
            color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Simpan</button>
        </div>

        {active === "profile"       && <ProfileTab />}
        {active === "users"         && <UserRoleTab />}
        {active === "notifications" && <NotificationsTab />}
        {active === "display"       && <DisplayTab />}
        {active === "sidebar"       && <SidebarPrefsTab />}
      </div>
    </div>
  );
}
