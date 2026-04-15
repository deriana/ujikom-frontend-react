export const POINT_CATEGORY = {
  ATTENDANCE: "attendance",
  PERFORMANCE: "performance",
  DISCIPLINE: "discipline",
  LEARNING: "learning",
  ACHIEVEMENT: "achievement",
} as const;

export type PointCategory = (typeof POINT_CATEGORY)[keyof typeof POINT_CATEGORY];

export const POINT_CATEGORY_OPTIONS = Object.entries(POINT_CATEGORY).map(([key, value]) => ({
  value: value,
  label: key.charAt(0) + key.slice(1).toLowerCase(),
}));
