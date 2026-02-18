export const WORK_MODE = {
  REMOTE: { id: 1, label: "WFO", color: "blue" },
  OFFICE: { id: 2, label: "WFH", color: "green" },
  HYBRID: { id: 3, label: "Hybrid", color: "yellow" },
} as const;

export type WorkModeKey = keyof typeof WORK_MODE;

export const WORK_MODE_OPTIONS = Object.values(WORK_MODE).map((mode) => ({
  value: mode.id,
  label: mode.label,
}));
