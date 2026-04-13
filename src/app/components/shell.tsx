import { NavLink, Outlet, useNavigate } from "react-router";
import { C, SHELL } from "./tokens";
import { useState, createContext, useContext } from "react";
import { useAppSettings } from "./app-settings-context";
import {
  LayoutDashboard, BookOpen, Search, Plane, ScrollText,
  Settings, ChevronLeft, ChevronRight, Bell, LogOut, User, Zap,
} from "lucide-react";

const SidebarContext = createContext({ collapsed: false, toggle: () => {} });
export function useSidebar() { return useContext(SidebarContext); }

const NAV_ITEMS = [
  { label: "Dashboard",       to: "/dashboard",       icon: LayoutDashboard },
  { label: "Shipment Ledger", to: "/shipment-ledger", icon: BookOpen },
  { label: "AWB Tracking",    to: "/awb-tracking",    icon: Search },
  { label: "Flight Board",    to: "/flight-board",    icon: Plane },
  { label: "Activity Log",    to: "/activity-log",    icon: ScrollText },
  { label: "Settings",        to: "/settings",        icon: Settings },
];

type UserRole = "Admin" | "Operator" | "Supervisor";

const ROLE_STYLES: Record<UserRole, { bg: string; color: string }> = {
  Admin:      { bg: C.primaryA08,  color: C.primary },
  Operator:   { bg: C.accentA08,   color: C.accent },
  Supervisor: { bg: C.warningA08,  color: C.warning },
};

const SIDEBAR_EXPANDED = SHELL.sidebarW;
const SIDEBAR_COLLAPSED = 68;

export function Shell() {
  const { sidebarDefaultCollapsed } = useAppSettings();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(sidebarDefaultCollapsed);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifRead, setNotifRead] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const NOTIFICATIONS = [
    { text: "Cutoff GA-714 dalam 23 menit, 2 AWB belum staged", time: "3m lalu", sev: C.danger, route: "/flight-board" },
    { text: "AWB 126-93018472 cleared, siap loading", time: "12m lalu", sev: C.success, route: "/awb-tracking" },
    { text: "Exception: DG declaration unsigned AWB 126-10294738", time: "1h lalu", sev: C.warning, route: "/shipment-ledger" },
    { text: "Manifest QF-182 approved oleh Rina Sari", time: "2h lalu", sev: C.success, route: "/activity-log" },
  ];

  const unreadCount = NOTIFICATIONS.length - notifRead.size;

  const currentUser = { name: "Rina Sari", initials: "RS", role: "Supervisor" as UserRole };
  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed(c => !c) }}>
      <div style={{
        width: "100vw", height: "100vh", display: "flex",
        background: C.bg, overflow: "hidden", fontFamily: "Inter, sans-serif",
      }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: sidebarW, height: "100vh",
          background: C.surface, borderRight: `1px solid ${C.borderSoft}`,
          display: "flex", flexDirection: "column", flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden",
        }}>
          {/* Logo */}
          <div style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            height: 64, display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10, borderBottom: `1px solid ${C.borderSoft}`,
            transition: "padding 0.22s",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={18} color="#FFF" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: C.primary, letterSpacing: "-0.3px", lineHeight: "20px", whiteSpace: "nowrap" }}>Ekspedisi Petir</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: C.text2, lineHeight: "13px", letterSpacing: "0.2px" }}>Cargo Ops Control</span>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <div style={{ padding: collapsed ? "8px 0" : "8px 12px", display: "flex", justifyContent: collapsed ? "center" : "flex-end", transition: "padding 0.22s" }}>
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                width: 28, height: 28, borderRadius: 8,
                border: `1px solid ${C.borderSoft}`, background: C.surface,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: C.text2,
              }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Nav */}
          <nav style={{
            marginTop: 4, padding: collapsed ? "0 8px" : "0 12px",
            display: "flex", flexDirection: "column", gap: 2, flex: 1,
            transition: "padding 0.22s",
          }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: 10,
                    padding: collapsed ? "0" : "0 14px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    height: 40, borderRadius: 10, textDecoration: "none",
                    fontFamily: "Inter, sans-serif", fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? C.primary : C.text2,
                    background: isActive ? C.primaryA05 : "transparent",
                    borderLeft: isActive && !collapsed ? `3px solid ${C.primary}` : "3px solid transparent",
                    transition: "all 0.12s",
                    whiteSpace: "nowrap" as const, overflow: "hidden",
                  })}
                >
                  <Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{
            padding: collapsed ? "14px 8px 20px" : "14px 20px 20px",
            borderTop: `1px solid ${C.borderSoft}`,
            display: "flex", flexDirection: "column", gap: 8,
            alignItems: collapsed ? "center" : "flex-start",
            transition: "padding 0.22s",
          }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: "#FFF", flexShrink: 0,
                }}>{currentUser.initials}</div>
                <div style={{ minWidth: 0, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px", borderRadius: 4,
                    background: ROLE_STYLES[currentUser.role].bg, color: ROLE_STYLES[currentUser.role].color,
                    fontSize: 10, fontWeight: 700,
                  }}>{currentUser.role}</span>
                </div>
              </div>
            )}
            <div style={{ fontSize: 10, color: C.text2, whiteSpace: "nowrap" }}>
              {collapsed ? "v1.0" : "Ekspedisi Petir v1.0.0"}
            </div>
          </div>
        </aside>

        {/* ── Right area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>
          {/* Header */}
          <header style={{
            width: "100%", height: SHELL.headerH,
            background: C.surface, borderBottom: `1px solid ${C.borderSoft}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 28px", flexShrink: 0,
          }}>
            {/* Search */}
            <div style={{
              width: "min(380px, 40%)", height: 36,
              borderRadius: 999, background: C.surface2,
              display: "flex", alignItems: "center", padding: "0 14px", gap: 8,
            }}>
              <Search size={14} color={C.text2} />
              <input
                placeholder="Cari AWB, shipment, atau flight..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && searchVal.trim()) {
                    navigate("/awb-tracking");
                    setSearchVal("");
                  }
                }}
                style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 12, fontFamily: "Inter, sans-serif", color: C.text }}
              />
            </div>

            {/* Right: util + avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Bell */}
              <div style={{ position: "relative" }}>
                <div onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setAvatarOpen(false); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: C.surface2 }}>
                  <Bell size={16} color={C.text2} />
                  {unreadCount > 0 && (
                    <div style={{ position: "absolute", top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 999, background: C.danger, border: `2px solid ${C.surface}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#FFF", padding: "0 3px" }}>
                      {unreadCount}
                    </div>
                  )}
                </div>
                {notifOpen && (
                  <div onClick={(e) => e.stopPropagation()} style={{
                    position: "absolute", top: 44, right: 0, width: 360,
                    background: C.surface, borderRadius: 12,
                    border: `1px solid ${C.borderSoft}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    padding: 0, zIndex: 50, overflow: "hidden",
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>Notifikasi</span>
                        {unreadCount > 0 && <span style={{ height: 18, padding: "0 6px", borderRadius: 999, background: C.dangerA08, color: C.danger, fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center" }}>{unreadCount}</span>}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={() => setNotifRead(new Set(NOTIFICATIONS.map((_, i) => i)))} style={{ fontSize: 11, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    {NOTIFICATIONS.map((n, i) => {
                      const isRead = notifRead.has(i);
                      return (
                        <div key={i} onClick={() => {
                          setNotifRead(prev => new Set(prev).add(i));
                          setNotifOpen(false);
                          navigate(n.route);
                        }} style={{
                          padding: "10px 16px", borderBottom: `1px solid ${C.borderSoft}`,
                          cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start",
                          background: isRead ? "transparent" : C.primaryA02,
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                          onMouseLeave={e => (e.currentTarget.style.background = isRead ? "transparent" : C.primaryA02)}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: isRead ? C.borderSoft : n.sev, flexShrink: 0, marginTop: 4 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: C.text, lineHeight: "17px", fontWeight: isRead ? 400 : 500 }}>{n.text}</div>
                            <div style={{ fontSize: 10, color: C.text2, marginTop: 3 }}>{n.time}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div onClick={() => { setNotifOpen(false); navigate("/activity-log"); }} style={{ padding: "11px 16px", textAlign: "center", fontSize: 11, color: C.accent, fontWeight: 600, cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.surface2)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      Lihat Semua Aktivitas
                    </div>
                  </div>
                )}
              </div>

              {/* Name + role */}
              <div style={{ textAlign: "right", marginRight: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: "16px" }}>{currentUser.name}</div>
                <span style={{
                  display: "inline-flex", alignItems: "center", height: 16, padding: "0 6px", borderRadius: 4,
                  background: ROLE_STYLES[currentUser.role].bg, color: ROLE_STYLES[currentUser.role].color,
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.3px",
                }}>{currentUser.role}</span>
              </div>

              {/* Avatar */}
              <div
                onClick={() => setAvatarOpen(!avatarOpen)}
                style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primary2})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#FFF",
                  position: "relative",
                }}
              >
                {currentUser.initials}
                {avatarOpen && (
                  <div style={{
                    position: "absolute", top: 44, right: 0, width: 190,
                    background: C.surface, borderRadius: 12,
                    border: `1px solid ${C.borderSoft}`, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    padding: 6, zIndex: 50,
                  }}>
                    <div style={{ padding: "8px 10px 10px", borderBottom: `1px solid ${C.borderSoft}`, marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{currentUser.name}</div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", height: 18, padding: "0 7px", borderRadius: 4, marginTop: 4,
                        background: ROLE_STYLES[currentUser.role].bg, color: ROLE_STYLES[currentUser.role].color,
                        fontSize: 10, fontWeight: 700,
                      }}>{currentUser.role}</span>
                    </div>
                    {[
                      { label: "Profile", icon: User },
                      { label: "Sign Out", icon: LogOut },
                    ].map((a) => {
                      const AIcon = a.icon;
                      return (
                        <div
                          key={a.label}
                          style={{
                            padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                            fontSize: 13, color: a.label === "Sign Out" ? C.danger : C.text,
                            display: "flex", alignItems: "center", gap: 8,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          onClick={() => {
                            if (a.label === "Profile") {
                              setAvatarOpen(false);
                              navigate("/settings", { state: { tab: "profile" } });
                            }
                            if (a.label === "Sign Out") {
                              setAvatarOpen(false);
                              navigate("/login");
                            }
                          }}
                        >
                          <AIcon size={14} />
                          {a.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: "20px 28px", overflow: "auto", minHeight: 0 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}