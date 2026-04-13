import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark";

interface AppSettings {
  theme: Theme;
  setTheme: (t: Theme) => void;
  compact: boolean;
  setCompact: (v: boolean) => void;
  sidebarDefaultCollapsed: boolean;
  setSidebarDefaultCollapsed: (v: boolean) => void;
  cutoffAlert: boolean;
  setCutoffAlert: (v: boolean) => void;
  exceptionAlert: boolean;
  setExceptionAlert: (v: boolean) => void;
  soundAlert: boolean;
  setSoundAlert: (v: boolean) => void;
  emailDigest: boolean;
  setEmailDigest: (v: boolean) => void;
  autoRefresh: boolean;
  setAutoRefresh: (v: boolean) => void;
  refreshInterval: string;
  setRefreshInterval: (v: string) => void;
}

const AppSettingsContext = createContext<AppSettings>({
  theme: "light", setTheme: () => {},
  compact: false, setCompact: () => {},
  sidebarDefaultCollapsed: false, setSidebarDefaultCollapsed: () => {},
  cutoffAlert: true, setCutoffAlert: () => {},
  exceptionAlert: true, setExceptionAlert: () => {},
  soundAlert: false, setSoundAlert: () => {},
  emailDigest: true, setEmailDigest: () => {},
  autoRefresh: true, setAutoRefresh: () => {},
  refreshInterval: "60", setRefreshInterval: () => {},
});

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

function usePersisted<T>(key: string, def: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(`ep_${key}`);
      return s !== null ? JSON.parse(s) : def;
    } catch { return def; }
  });
  const set = (v: T) => {
    setVal(v);
    localStorage.setItem(`ep_${key}`, JSON.stringify(v));
  };
  return [val, set];
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = usePersisted<Theme>("theme", "light");
  const [compact, setCompact] = usePersisted("compact", false);
  const [sidebarDefaultCollapsed, setSidebarDefaultCollapsed] = usePersisted("sidebarCollapsed", false);
  const [cutoffAlert, setCutoffAlert] = usePersisted("cutoffAlert", true);
  const [exceptionAlert, setExceptionAlert] = usePersisted("exceptionAlert", true);
  const [soundAlert, setSoundAlert] = usePersisted("soundAlert", false);
  const [emailDigest, setEmailDigest] = usePersisted("emailDigest", true);
  const [autoRefresh, setAutoRefresh] = usePersisted("autoRefresh", true);
  const [refreshInterval, setRefreshInterval] = usePersisted("refreshInterval", "60");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-compact", compact ? "true" : "false");
  }, [compact]);

  return (
    <AppSettingsContext.Provider value={{
      theme, setTheme,
      compact, setCompact,
      sidebarDefaultCollapsed, setSidebarDefaultCollapsed,
      cutoffAlert, setCutoffAlert,
      exceptionAlert, setExceptionAlert,
      soundAlert, setSoundAlert,
      emailDigest, setEmailDigest,
      autoRefresh, setAutoRefresh,
      refreshInterval, setRefreshInterval,
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
}
