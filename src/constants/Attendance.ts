export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',

} as const;

export const ATTENDANCE_STATUS_LABEL: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',

};

export const ATTENDANCE_STATUS_COLOR: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  present: 'success',
  absent: 'error',

};
