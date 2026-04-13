/* All color values are CSS custom properties defined in theme.css
   so dark / light mode switches without touching any component code. */
export const C = {
  /* Base surfaces */
  bg:          "var(--ep-bg)",
  surface:     "var(--ep-surface)",
  surface2:    "var(--ep-surface2)",
  /* Text */
  text:        "var(--ep-text)",
  text2:       "var(--ep-text2)",
  /* Brand */
  primary:     "var(--ep-primary)",
  primary2:    "var(--ep-primary2)",
  accent:      "var(--ep-accent)",
  /* Borders */
  borderSoft:  "var(--ep-border)",
  /* Semantic */
  success:     "var(--ep-success)",
  warning:     "var(--ep-warning)",
  danger:      "var(--ep-danger)",
  /* ── Alpha tints ── replaces `${C.xxx}HH` template literals ── */
  primaryA08:  "var(--ep-primary-a08)",   // was ${C.primary}14
  primaryA05:  "var(--ep-primary-a05)",   // was ${C.primary}0C
  primaryA02:  "var(--ep-primary-a02)",   // was ${C.primary}04
  primaryA03:  "var(--ep-primary-a03)",   // was ${C.primary}08
  dangerA08:   "var(--ep-danger-a08)",    // was ${C.danger}14
  dangerA03:   "var(--ep-danger-a03)",    // was ${C.danger}06
  successA08:  "var(--ep-success-a08)",   // was ${C.success}14
  successA06:  "var(--ep-success-a06)",   // was ${C.success}10
  successA25:  "var(--ep-success-a25)",   // was ${C.success}40
  warningA08:  "var(--ep-warning-a08)",   // was ${C.warning}14
  warningA06:  "var(--ep-warning-a06)",   // was ${C.warning}10
  warningA02:  "var(--ep-warning-a02)",   // was ${C.warning}04
  accentA08:   "var(--ep-accent-a08)",    // was ${C.accent}14
  accentA06:   "var(--ep-accent-a06)",    // was ${C.accent}10
} as const;

export const SHELL = {
  sidebarW: 250,
  headerH: 64,
} as const;
