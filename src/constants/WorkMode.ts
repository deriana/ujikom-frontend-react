export const WORK_MODE = {
  OFFICE: { id: 1, label: "WFO", color: "green" },
  REMOTE: { id: 2, label: "WFH", color: "blue" },
  HYBRID: { id: 3, label: "Hybrid", color: "yellow" },
} as const;

export type WorkModeKey = keyof typeof WORK_MODE;

export const WORK_MODE_OPTIONS = Object.values(WORK_MODE).map((mode) => ({
  value: mode.id,
  label: mode.label,
}));
