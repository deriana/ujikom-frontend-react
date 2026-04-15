export const POWER_UP_TYPE = {
  ANTI_LATE_LIGHT: "anti_late_light",
  ANTI_LATE_HARD: "anti_late_hard",
  ABSENT_PROTECT: "absent_protect",
  POINT_BOOSTER: "point_booster",
} as const;

export type PowerUpType = (typeof POWER_UP_TYPE)[keyof typeof POWER_UP_TYPE];

export const POWER_UP_LABEL: Record<PowerUpType, string> = {
  [POWER_UP_TYPE.ANTI_LATE_LIGHT]: "Anti Late Light",
  [POWER_UP_TYPE.ANTI_LATE_HARD]: "Anti Late Hard",
  [POWER_UP_TYPE.ABSENT_PROTECT]: "Absent Protect",
  [POWER_UP_TYPE.POINT_BOOSTER]: "Point Booster",
};
